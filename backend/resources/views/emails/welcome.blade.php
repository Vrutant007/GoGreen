<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Welcome Email</title>
</head>
<body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px;">
        <div style="text-align: center;">
            <img src="{{ asset('Go Green.png') }}" alt="Logo" style="width: 120px;">
            <h2>Welcome to Go Green!</h2>
        </div>
        <p>Hello {{ $user->name }},</p>
        <p>Thank you for registering on our website. We're happy to have you with us!</p>
        <p>Start exploring our eco-friendly products today.</p>
        <p style="margin-top: 20px;">Best regards,<br>Go Green Team</p>
    </div>
</body>
</html>
