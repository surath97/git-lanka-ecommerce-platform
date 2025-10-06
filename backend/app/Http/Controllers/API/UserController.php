<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserPrivilege;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('privileges');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('fname', 'like', "%{$search}%")
                  ->orWhere('lname', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('contact', 'like', "%{$search}%");
            });
        }

        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->is_active);
        }

        $users = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($users);
    }

    public function show($id)
    {
        $user = User::with('privileges')->findOrFail($id);
        return response()->json($user);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'fname' => 'required|string|max:255',
            'lname' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'contact' => 'required|string|max:20',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:admin,user',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'fname' => $request->fname,
            'lname' => $request->lname,
            'email' => $request->email,
            'contact' => $request->contact,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        // Create default privileges for non-admin users
        if ($user->role === 'user') {
            UserPrivilege::create([
                'user_id' => $user->id,
                'can_add_product' => false,
                'can_update_product' => false,
                'can_delete_product' => false,
            ]);
        }

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user->load('privileges'),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'fname' => 'required|string|max:255',
            'lname' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'contact' => 'required|string|max:20',
            'role' => 'required|in:admin,user',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user->update($request->only(['fname', 'lname', 'email', 'contact', 'role']));

        if ($request->has('password') && $request->password) {
            $user->password = Hash::make($request->password);
            $user->save();
        }

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user->load('privileges'),
        ]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        // Prevent deleting yourself
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'Cannot delete your own account'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    public function toggleStatus($id)
    {
        $user = User::findOrFail($id);
        
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'Cannot deactivate your own account'], 403);
        }

        $user->is_active = !$user->is_active;
        $user->save();

        return response()->json([
            'message' => 'User status updated successfully',
            'user' => $user,
        ]);
    }

    public function updatePrivileges(Request $request, $id)
    {
        $user = User::findOrFail($id);

        if ($user->role === 'admin') {
            return response()->json(['message' => 'Cannot modify admin privileges'], 403);
        }

        $validator = Validator::make($request->all(), [
            'can_add_product' => 'required|boolean',
            'can_update_product' => 'required|boolean',
            'can_delete_product' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $privileges = $user->privileges;
        
        if (!$privileges) {
            $privileges = UserPrivilege::create(['user_id' => $user->id]);
        }

        $privileges->update($request->only([
            'can_add_product',
            'can_update_product',
            'can_delete_product',
        ]));

        return response()->json([
            'message' => 'Privileges updated successfully',
            'user' => $user->load('privileges'),
        ]);
    }
}