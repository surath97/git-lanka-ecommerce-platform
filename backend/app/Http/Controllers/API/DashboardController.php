<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats()
    {
        $totalProducts = Product::count();
        $activeProducts = Product::where('is_active', true)->count();
        $totalCustomers = Customer::count();
        $activeCustomers = Customer::where('is_active', true)->count();
        $totalUsers = User::count();
        $activeUsers = User::where('is_active', true)->count();

        return response()->json([
            'total_products' => $totalProducts,
            'active_products' => $activeProducts,
            'total_customers' => $totalCustomers,
            'active_customers' => $activeCustomers,
            'total_users' => $totalUsers,
            'active_users' => $activeUsers,
        ]);
    }
}