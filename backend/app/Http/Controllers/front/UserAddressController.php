<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Addresses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class UserAddressController extends Controller
{
    public function index() {
        return Addresses::where('user_id', Auth::id())->get();
    }

    public function store(Request $request) {

        $validator = Validator::make($request->all(),[
            'label' => 'required|string',
            'name' => 'required|string',
            'email' => 'required|email',
            'mobile' => 'required|digits:10|numeric',
            'address' => 'required|string',
            'city' => 'required|string',
            'state' => 'required|string',
            'zip_code' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'message' => $validator->errors(),
            ],400);
        }

        $addresses = new Addresses();
        $addresses->label = $request->label;
        $addresses->name = $request->name;
        $addresses->email = $request->email;
        $addresses->mobile = $request->mobile;
        $addresses->address = $request->address;
        $addresses->city = $request->city;
        $addresses->state = $request->state;
        $addresses->zip_code = $request->zip_code;
        $addresses->user_id = Auth::id();
        $addresses->save();


        return response()->json([
            'status' => 200,
            'message' => 'Address Saved Successfully',
            'data' => $addresses
        ],200);
    }

    public function show($id) {
        $addresses = Addresses::where('user_id',$id)->get();

        if ($addresses->isEmpty()) {
            return response()->json([
                'status' => 404,
                'message' => 'Address not Found'
            ],404);
        } else{
            return response()->json([
                'status' => 200,
                'data' => $addresses
            ],200);
        }
    }

    public function update($id, Request $request) {
        $addresses = Addresses::find($id);

        if ($addresses == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Address not Found',
                'data' => []
            ],404);
        }

        $validator = Validator::make(request()->all(),[
            'label' => 'required|string',
            'name' => 'required|string',
            'email' => 'required|email',
            'mobile' => 'required',
            'address' => 'required|string',
            'city' => 'required|string',
            'state' => 'required|string',
            'zip_code' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'message' => $validator->errors(),
            ],400);
        }

        $addresses->label = $request->label;
        $addresses->name = $request->name;
        $addresses->email = $request->email;
        $addresses->mobile = $request->mobile;
        $addresses->address = $request->address;
        $addresses->city = $request->city;
        $addresses->state = $request->state;
        $addresses->zip_code = $request->zip_code;
        $addresses->user_id = Auth::id();
        $addresses->save();

        return response()->json([
            'status' => 200,
            'message' => 'Address Updated Successfully',
            'data' => $addresses
        ],200);
    }

    public function destroy ($id) {
        $addresses = Addresses::find($id);

        if ($addresses == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Address not Found'
            ],404);
        }

        $addresses->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Address Deleted Successfully',
            'data' => []
        ],200);
    }

    public function getSingleAddress ($id) {
        $addresses = Addresses::find($id);

        if ($addresses == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Address not Found'
            ],404);
        }

        return response()->json([
            'status' => 200,
            'data' => $addresses
        ],200);
    }
}
