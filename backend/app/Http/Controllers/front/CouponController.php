<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\CouponCode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CouponController extends Controller
{
    public function applyCoupon(Request $request){
        $coupon_code = $request->code;

        $coupon =CouponCode::where('code',$coupon_code)->first();

        if($coupon){
            return response()->json([
                'status' => 200,
                'message' => 'Coupon Applied Successfully',
                'data' => [
                    'discount_amount' => $coupon->discount_amount
                ]
            ],200);
        }else{
            return response()->json([
                'status' => 404,
                'message' => 'Invalid Coupon Code',
            ],404);
        }
    }

    public function getCouponCode() {
        $couponCode = CouponCode::orderBy('created_at', 'DESC')->get();
        return response()->json([
            'status' => 200,
            'data' => $couponCode
        ],200);
    }

    public function storeCoupon(Request $request) {
        $validator = Validator::make($request->all(), [
            'code' => 'required',
            'discount_amount' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'error' => $validator->errors(),
            ],400);
        }

        $coupon = new CouponCode();
        $coupon->code = $request->code;
        $coupon->discount_amount = $request->discount_amount;
        $coupon->expire_at = $request->expire_at;
        $coupon->save();

        return response()->json([
            'status' => 200,
            'message' => 'Coupon Code Added Successfully'
        ],200);
    }

    public function showCode($id) {

        $couponCode = CouponCode::find($id);

        if($couponCode == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Coupon Code Not Found',
            ],404);
        }

        return response()->json([
            'status' => 200,
            'data' => $couponCode
        ],200);
    }

    public function updateCode($id, Request $request) {

        $couponCode = CouponCode::find($id);

        if($couponCode == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Coupon Code Not Found',
            ],404);
        }

        $validator = Validator::make($request->all(), [
            'code' => 'required',
            'discount_amount' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'error' => $validator->errors(),
            ],400);
        }

        $couponCode->code = $request->code;
        $couponCode->discount_amount = $request->discount_amount;
        $couponCode->expire_at = $request->expire_at;
        $couponCode->save();

        return response()->json([
            'status' => 200,
            'message' => 'Coupon Code Updated Successfully',
        ],200);
    }

    public function deleteCouponCode($id) {

        $couponCode = CouponCode::find($id);

        if($couponCode == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Coupon Code Not Found',
            ],404);
        }

        $couponCode->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Coupon Code Deleted Successfully',
        ],200);
    }
}
