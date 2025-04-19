<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Stripe\PaymentIntent;
use Stripe\Stripe;

class StripeController extends Controller
{
    public function createPayment(Request $request) {
        Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

        $intent = PaymentIntent::create([
            'amount' => $request->amount*100,
            'currency' => 'inr',
            'automatic_payment_methods' => ['enabled' => true],
            'expand' => ['charges']
        ]);

        return response()->json([
            'clientSecret' => $intent->client_secret
        ]);
    }
}
