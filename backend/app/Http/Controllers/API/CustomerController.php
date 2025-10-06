<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $query = Customer::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('fname', 'like', "%{$search}%")
                  ->orWhere('lname', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('contact', 'like', "%{$search}%");
            });
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->is_active);
        }

        $customers = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($customers);
    }

    public function show($id)
    {
        $customer = Customer::findOrFail($id);
        return response()->json($customer);
    }

    public function destroy($id)
    {
        $customer = Customer::findOrFail($id);
        $customer->delete();

        return response()->json(['message' => 'Customer deleted successfully']);
    }

    public function toggleStatus($id)
    {
        $customer = Customer::findOrFail($id);
        $customer->is_active = !$customer->is_active;
        $customer->save();

        return response()->json([
            'message' => 'Customer status updated successfully',
            'customer' => $customer,
        ]);
    }
}