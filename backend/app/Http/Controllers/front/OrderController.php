<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function saveOrder(Request $request){

        if(!empty($request->cart)){
            $order = new Order();
            $order->name =  $request->name;
            $order->email =  $request->email;
            $order->address =  $request->address;
            $order->mobile =  $request->mobile;
            $order->city =  $request->city;
            $order->state =  $request->state;
            $order->zip_code =  $request->zip_code;
            $order->grand_total =  $request->grand_total;
            $order->sub_total =  $request->sub_total;
            $order->delivery =  $request->delivery;
            $order->discount =  $request->discount;
            $order->payment_status =  $request->payment_status;
            $order->status =  $request->status;
            $order->user_id =  $request->user()->id;
            $order->save();

            Payment::create([
                'order_id' => $order->id,
                'user_id' => $request->user()->id,
                'payment_method' => $request->payment_method,
                'card_last_four' => $request->card_last_four,
                'amount' => $order->grand_total
            ]);

            foreach ($request->cart as $item){
                $orderItem = new OrderItem();
                $orderItem->order_id = $order->id;
                $orderItem->price = $item['qty'] * $item['price'];
                $orderItem->unit_price = $item['price'];
                $orderItem->qty = $item['qty'];
                $orderItem->product_id = $item['product_id'];
                $orderItem->name = $item['title'];
                $orderItem->save();
            }

            return response()->json([
                'status' => 200,
                'id' => $order->id,
                'message' => 'Your Order has Placed Successfully'
            ],200);

        }else{
            return response()->json([
                'status' => 400,
                'message' => 'Your Cart is Empty'
            ],400);
        }

    }
}
