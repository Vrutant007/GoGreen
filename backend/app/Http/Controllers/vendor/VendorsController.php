<?php

namespace App\Http\Controllers\vendor;

use App\Http\Controllers\Controller;
use App\Models\Vendors;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class VendorsController extends Controller
{
    public function register (Request $request) {
        $rules = [
            'name'=> 'required',
            'email'=> 'required|email|unique:vendors,email',
            'password'=> 'required',
            'area' => 'required',
            'pincode' => 'required|digits:6|numeric',
        ];

        $validator = Validator::make($request->all(),$rules);

        if($validator->fails()){
            return response()->json([
                'status' => 400,
                'error' => $validator->errors()
            ],400);
        }

        $vendor = new Vendors();
        $vendor->name = $request->name;
        $vendor->email = $request->email;
        $vendor->area = $request->area;
        $vendor->pincode = $request->pincode;
        $vendor->password = Hash::make($request->password);
        $vendor->save();

        return response()->json([
            'status' => 200,
            'message' => 'You have Registered Successfully !'
        ],200);
    }

    public function authenticate(Request $request) {
        $rules = [
            'email' => 'required|email',
            'password' => 'required',
        ];

        $validator = Validator::make($request->all(),$rules);

        if($validator->fails()){
            return response()->json([
                'status' => 400,
                'error' => $validator->errors()
            ],400);
        }

        $vendor = Vendors::where('email', $request->email)->first();

        if(!$vendor || !Hash::check($request->password, $vendor->password)) {

            return response()->json([
                'status' => 401,
                'message' => 'Either email or password is incorrect'
            ],401);

        }

        $token = $vendor->createToken('vendor_token')->plainTextToken;

        return response()->json([
            'status' => 200,
            'token' => $token,
            'id' => $vendor->id,
            'name' => $vendor->name
        ],200);
    }
}
