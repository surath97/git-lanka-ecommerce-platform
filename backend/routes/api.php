<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CartController;
use App\Http\Controllers\API\CustomerAuthController;
use App\Http\Controllers\API\CustomerController;
use App\Http\Controllers\API\DashboardController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\UserController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/customer/register', [CustomerAuthController::class, 'register']);
Route::post('/customer/login', [CustomerAuthController::class, 'login']);
Route::post('/admin/login', [AuthController::class, 'login']);

// Public product routes
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

// Customer protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Customer auth
    Route::post('/customer/logout', [CustomerAuthController::class, 'logout']);
    Route::get('/customer/profile', [CustomerAuthController::class, 'profile']);
    Route::put('/customer/profile', [CustomerAuthController::class, 'updateProfile']);

    // Cart management
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::put('/cart/{id}', [CartController::class, 'update']);
    Route::delete('/cart/{id}', [CartController::class, 'destroy']);
    Route::delete('/cart', [CartController::class, 'clear']);
});

// Admin & User protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Admin/User auth
    Route::post('/admin/logout', [AuthController::class, 'logout']);
    Route::get('/admin/profile', [AuthController::class, 'profile']);
    Route::put('/admin/profile', [AuthController::class, 'updateProfile']);

    // Dashboard
    Route::get('/admin/dashboard/stats', [DashboardController::class, 'stats']);

    // Product management
    Route::post('/admin/products', [ProductController::class, 'store']);
    Route::put('/admin/products/{id}', [ProductController::class, 'update']);
    Route::delete('/admin/products/{id}', [ProductController::class, 'destroy']);
    Route::patch('/admin/products/{id}/toggle-status', [ProductController::class, 'toggleStatus']);

    // Customer management
    Route::get('/admin/customers', [CustomerController::class, 'index']);
    Route::get('/admin/customers/{id}', [CustomerController::class, 'show']);
    Route::delete('/admin/customers/{id}', [CustomerController::class, 'destroy']);
    Route::patch('/admin/customers/{id}/toggle-status', [CustomerController::class, 'toggleStatus']);

    // User management
    Route::get('/admin/users', [UserController::class, 'index']);
    Route::get('/admin/users/{id}', [UserController::class, 'show']);
    Route::post('/admin/users', [UserController::class, 'store']);
    Route::put('/admin/users/{id}', [UserController::class, 'update']);
    Route::delete('/admin/users/{id}', [UserController::class, 'destroy']);
    Route::patch('/admin/users/{id}/toggle-status', [UserController::class, 'toggleStatus']);
    Route::put('/admin/users/{id}/privileges', [UserController::class, 'updatePrivileges']);
});