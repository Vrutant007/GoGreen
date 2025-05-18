<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function index(){
        $users = DB::table('users')
            ->where('users.role', 'customer')
            ->leftJoin('addresses', function ($join) {
                $join->on('users.id', '=', 'addresses.user_id');
            })
            ->select(
                'users.id as user_id',
                'users.name as user_name',
                'users.email',
                'addresses.mobile',
                'addresses.address',
                'addresses.city',
                'addresses.state',
                'addresses.zip_code'
            )
            ->orderBy('users.id', 'DESC')
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $users
        ], 200);
    }


    public function getLastOrderDetails(){
        $user = Auth::user();

        $lastOrder = Order::where('user_id',$user->id)->latest()->first();

        if(!$lastOrder){
            return response()->json([
                'status' => 404,
                'message' => 'No orders found'
            ]);
        }else{
            return response()->json([
                'status' => 200,
                'data' => $lastOrder
            ]);
        }
    }
    public function getOrders(){
        $user = Auth::user();

        $orders = Order::where('user_id',$user->id)
                            ->orderBy('created_at','DESC')
                            ->with('items')
                            ->get();

        if(!$orders){
            return response()->json([
                'status' => 404,
                'message' => 'No Orders Yet'
            ]);
        }else{
            return response()->json([
                'status' => 200,
                'data' => $orders
            ]);
        }
    }
}
