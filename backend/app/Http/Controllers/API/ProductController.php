<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();

        // Search filters
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('product_name', 'like', "%{$search}%")
                  ->orWhere('brand', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->has('brand')) {
            $query->where('brand', 'like', "%{$request->brand}%");
        }

        if ($request->has('min_price')) {
            $query->where('sell_price', '>=', $request->min_price);
        }

        if ($request->has('max_price')) {
            $query->where('sell_price', '<=', $request->max_price);
        }

        if ($request->has('rating')) {
            $query->where('rating', '>=', $request->rating);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->is_active);
        } else {
            // Default to active products for public view
            if (!$request->user() || !$request->user()->isAdmin()) {
                $query->where('is_active', true);
            }
        }

        $products = $query->orderBy('created_at', 'desc')->paginate(12);

        return response()->json($products);
    }

    public function show($id)
    {
        $product = Product::findOrFail($id);
        return response()->json($product);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        
        // Check privileges
        if (!$user->isAdmin() && (!$user->privileges || !$user->privileges->can_add_product)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'brand' => 'required|string|max:255',
            'product_name' => 'required|string|max:255',
            'product_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'quantity' => 'required|integer|min:0',
            'cost_price' => 'required|numeric|min:0',
            'sell_price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->except('product_image');

        if ($request->hasFile('product_image')) {
            $path = $request->file('product_image')->store('products', 'public');
            $data['product_image'] = $path;
        }

        $product = Product::create($data);

        return response()->json([
            'message' => 'Product created successfully',
            'product' => $product,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();
        
        // Check privileges
        if (!$user->isAdmin() && (!$user->privileges || !$user->privileges->can_update_product)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $product = Product::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'brand' => 'required|string|max:255',
            'product_name' => 'required|string|max:255',
            'product_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'quantity' => 'required|integer|min:0',
            'cost_price' => 'required|numeric|min:0',
            'sell_price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->except('product_image');

        if ($request->hasFile('product_image')) {
            // Delete old image
            if ($product->product_image) {
                Storage::disk('public')->delete($product->product_image);
            }
            $path = $request->file('product_image')->store('products', 'public');
            $data['product_image'] = $path;
        }

        $product->update($data);

        return response()->json([
            'message' => 'Product updated successfully',
            'product' => $product,
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        
        // Check privileges
        if (!$user->isAdmin() && (!$user->privileges || !$user->privileges->can_delete_product)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $product = Product::findOrFail($id);

        if ($product->product_image) {
            Storage::disk('public')->delete($product->product_image);
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }

    public function toggleStatus(Request $request, $id)
    {
        $user = $request->user();
        
        if (!$user->isAdmin() && (!$user->privileges || !$user->privileges->can_update_product)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $product = Product::findOrFail($id);
        $product->is_active = !$product->is_active;
        $product->save();

        return response()->json([
            'message' => 'Product status updated successfully',
            'product' => $product,
        ]);
    }
}