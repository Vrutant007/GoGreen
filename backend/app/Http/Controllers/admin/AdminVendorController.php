<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Vendors;
use Illuminate\Http\Request;

class AdminVendorController extends Controller
{
    public function index() {
        $vendor = Vendors::orderBy('created_at', 'DESC')->get();
        return response()->json([
            'status' => 200,
            'data' => $vendor
        ],200);
    }

    public function vendorsOrder($id) {
        $vendor = Vendors::findOrFail($id);

        $orders = Order::with(['address', 'customer'])
        ->whereHas('address', function ($query) use ($vendor) {
            $query->whereRaw('LOWER(TRIM(area)) = ?', [strtolower(trim($vendor->area))]);
        })
        ->orderBy('created_at', 'desc')
        ->get();

        if(!$orders) {
            return response()->json([
                'status' => 404,
                'message' => 'No orders found for this vendor'
            ],404);
        }

        return response()->json([
            'status' => 200,
            'data' => $orders
        ],200);
    }
}
