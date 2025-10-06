<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class CustomerAuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'fname' => 'required|string|max:255',
            'lname' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:customers',
            'contact' => 'required|string|max:20',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $customer = Customer::create([
            'fname' => $request->fname,
            'lname' => $request->lname,
            'email' => $request->email,
            'contact' => $request->contact,
            'password' => Hash::make($request->password),
        ]);

        $token = $customer->createToken('customer-token')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful',
            'customer' => $customer,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $customer = Customer::where('email', $request->email)->first();

        if (!$customer || !Hash::check($request->password, $customer->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        if (!$customer->is_active) {
            return response()->json(['message' => 'Account is deactivated'], 403);
        }

        $token = $customer->createToken('customer-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'customer' => $customer,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function profile(Request $request)
    {
        return response()->json(['customer' => $request->user()]);
    }

    public function updateProfile(Request $request)
    {
        $customer = $request->user();

        $validator = Validator::make($request->all(), [
            'fname' => 'required|string|max:255',
            'lname' => 'required|string|max:255',
            'email' => 'required|email|unique:customers,email,' . $customer->id,
            'contact' => 'required|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $customer->update($request->only(['fname', 'lname', 'email', 'contact']));

        return response()->json([
            'message' => 'Profile updated successfully',
            'customer' => $customer,
        ]);
    }
}