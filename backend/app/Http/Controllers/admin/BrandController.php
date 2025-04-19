<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BrandController extends Controller
{
    public function index(){
        $brands = Brand::orderBy('created_at','DESC')->get();
        return response()->json([
            'status' => 200,
            'data' => $brands
        ]);
    }
    public function store(Request $request){
        $validator = Validator::make($request->all(),[
            'name' => 'required',
            'status' => 'required'
        ]);

        if($validator->fails()){
            return response()->json([
                'status' => 400,
                'error' => $validator->errors()
            ],400);
        }
        $brand = new Brand();
        $brand->name = $request->name;
        $brand->status = $request->status;
        $brand->save();

        return response()->json([
            'status' => 200,
            'message' => 'Brand added Successfully',
            'data' => $brand
        ],200);
    }

    public function show($id){
        $brand = Brand::find($id);

        if($brand == null){
            return response()->json([
                'status' => 404,
                'message' => 'Brand not Found',
                'data' => []
            ],404);
        }else{
            return response()->json([
                'status' => 200,
                'data' => $brand
            ]);
        }
    }

    public function update($id , Request $request){

        $brand = Brand::find($id);

        if($brand == null){
            return response()->json([
                'status' => 404,
                'message' => 'Brand not Found',
                'data' => []
            ],404);
        }

        $validator = Validator::make($request->all(),[
            'name' => 'required',
        ]);

        if($validator->fails()){
            return response()->json([
                'status' => 400,
                'error' => $validator->errors()
            ],400);
        }

        $brand->name = $request->name;
        $brand->status = $request->status;
        $brand->save();

        return response()->json([
            'status' => 200,
            'message' => 'Brand Updated Successfully',
            'data' => $brand
        ],200);

    }

    public function destroy($id){

        $brand = Brand::find($id);

        if($brand == null){
            return response()->json([
                'status' => 404,
                'message' => 'Brand not Found',
                'data' => []
            ],404);
        }
        $brand->delete();
        return response()->json([
            'status' => 200,
            'message' => 'Brand deleted Successfully',
        ],200);
    }
}
