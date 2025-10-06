<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $cartItems = CartItem::with('product')
            ->where('customer_id', $request->user()->id)
            ->get();

        $total = $cartItems->sum(function($item) {
            return $item->product->sell_price * $item->quantity;
        });

        return response()->json([
            'cart_items' => $cartItems,
            'total' => $total,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $product = Product::findOrFail($request->product_id);

        if (!$product->is_active) {
            return response()->json(['message' => 'Product is not available'], 400);
        }

        if ($product->quantity < $request->quantity) {
            return response()->json(['message' => 'Insufficient stock'], 400);
        }

        $cartItem = CartItem::where('customer_id', $request->user()->id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($cartItem) {
            $newQuantity = $cartItem->quantity + $request->quantity;
            
            if ($product->quantity < $newQuantity) {
                return response()->json(['message' => 'Insufficient stock'], 400);
            }

            $cartItem->quantity = $newQuantity;
            $cartItem->save();
        } else {
            $cartItem = CartItem::create([
                'customer_id' => $request->user()->id,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
            ]);
        }

        return response()->json([
            'message' => 'Item added to cart successfully',
            'cart_item' => $cartItem->load('product'),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $cartItem = CartItem::where('customer_id', $request->user()->id)
            ->findOrFail($id);

        $product = $cartItem->product;

        if ($product->quantity < $request->quantity) {
            return response()->json(['message' => 'Insufficient stock'], 400);
        }

        $cartItem->quantity = $request->quantity;
        $cartItem->save();

        return response()->json([
            'message' => 'Cart item updated successfully',
            'cart_item' => $cartItem->load('product'),
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $cartItem = CartItem::where('customer_id', $request->user()->id)
            ->findOrFail($id);

        $cartItem->delete();

        return response()->json(['message' => 'Item removed from cart successfully']);
    }

    public function clear(Request $request)
    {
        CartItem::where('customer_id', $request->user()->id)->delete();

        return response()->json(['message' => 'Cart cleared successfully']);
    }
}