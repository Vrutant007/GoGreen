<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Addresses;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function saveOrder(Request $request){

        $address = Addresses::find($request->address_id);

        if (!$address) {
            return response()->json([
                'status' => 400,
                'message' => 'Please Select Address'
            ], 400);
        }
        if(!empty($request->cart)){
            $order = new Order();
            $order->grand_total =  $request->grand_total;
            $order->sub_total =  $request->sub_total;
            $order->delivery =  $request->delivery;
            $order->discount =  $request->discount;
            $order->payment_status =  $request->payment_status;
            $order->status =  $request->status;
            $order->user_id =  $request->user()->id;
            $order->address_id = $address->id;
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
