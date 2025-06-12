<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Order Placed</title>
</head>
<body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px;">
        <div style="text-align: center;">
            <img src="{{ asset('Go Green.png') }}" alt="Logo" style="width: 120px;">
            <h2>Your Order has been Placed!</h2>
        </div>
        <p>Hello {{ $order->customer->name }},</p>
        <p>Thank you for shopping with us. We're excited to start processing your order.</p>

        <p><strong>Order ID:</strong> {{ $order->id }}</p>
        <p><strong>Total Amount:</strong> ₹{{ $order->grand_total }}</p>

        <p>We’ll notify you once your order is on its way.</p>

        <p style="margin-top: 20px;">Best regards,<br>Go Green Team</p>
    </div>
</body>
</html>
