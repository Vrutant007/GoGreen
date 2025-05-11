<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class ChangePasswordController extends Controller
{
    public function changePassword (Request $request) {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:6',
            'confirm_password' => 'required|same:new_password'
        ]);

        $user = User::find($request->id);

        if (!$user) {
            return response()->json([
                'status' => 404,
                'message' => 'User not found.'
            ], 404);
        }

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'status' => 401,
                'message' => 'Your Current Password is Incorrect. Please Try Again.'
            ], 401);
        }

        // if ($request->new_password !== $request->confirm_password) {
        //     return response()->json([
        //         'status' => 422,
        //         'message' => 'Your New Password does not match with Confirm Password.'
        //     ], 422);
        // }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json([
            'status' => 200,
            'message' => 'Password changed successfully.'
        ], 200);
    }
}
