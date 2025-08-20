<?php

use App\Http\Controllers\admin\AuthController;
use App\Http\Controllers\admin\BrandController;
use App\Http\Controllers\admin\CategoryController;
use App\Http\Controllers\admin\OrderController as AdminOrderController;
use App\Http\Controllers\admin\ProductController;
use App\Http\Controllers\admin\TempImageController;
use App\Http\Controllers\admin\UserController;
use App\Http\Controllers\front\AccountController;
use App\Http\Controllers\front\ChangePasswordController;
use App\Http\Controllers\front\CouponController;
use App\Http\Controllers\front\OrderController;
use App\Http\Controllers\front\ProductController as FrontProductController;
use App\Http\Controllers\front\StripeController;
use App\Http\Controllers\front\UserAddressController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/admin/login',[AuthController::class,'authenticate']);
Route::get('get-latest-products', [FrontProductController::class,'latestProducts']);
Route::get('get-featured-products', [FrontProductController::class,'FeaturedProducts']);
Route::get('get-categories', [FrontProductController::class,'getCatergories']);
Route::get('get-brands', [FrontProductController::class,'getBrands']);
Route::get('get-products', [FrontProductController::class,'getProducts']);
Route::get('get-products', [FrontProductController::class,'filteredProducts']);
Route::get('get-product/{id}', [FrontProductController::class,'productPage']);
Route::post('register', [AccountController::class,'register']);
Route::post('login', [AccountController::class,'authenticate']);
Route::get('coupon-code', [CouponController::class,'applyCoupon']);
Route::get('get-coupon-code', [CouponController::class,'getCouponCode']);
Route::post('store-coupon-code', [CouponController::class,'storeCoupon']);
Route::get('show-coupon-code/{id}', [CouponController::class,'showCode']);
Route::put('update-coupon-code/{id}', [CouponController::class,'updateCode']);
Route::delete('delete-coupon-code/{id}', [CouponController::class,'deleteCouponCode']);
// routes/api.php
Route::post('/create-payment-intent', [StripeController::class, 'createPayment']);
Route::post('/change-password/{id}',[ChangePasswordController::class,'changePassword']);




Route::group(['middleware' => ['auth:sanctum','checkUserRole']],function(){
    Route::post('save-order', [OrderController::class,'saveOrder']);
    Route::get('latest', [UserController::class,'getLastOrderDetails']);
    Route::get('get-orders', [UserController::class,'getOrders']);
    Route::get('get-order-details/{id}', [AccountController::class,'getOrderDetails']);
    Route::post('save-address',[UserAddressController::class,'store']);
    Route::get('get-user-address/{id}',[UserAddressController::class,'show']);
    Route::get('get-address',[UserAddressController::class,'index']);
    Route::put('update-address/{id}',[UserAddressController::class,'update']);
    Route::delete('delete-address/{id}',[UserAddressController::class,'destroy']);
    Route::get('get-single-address/{id}',[UserAddressController::class,'getSingleAddress']);

});





Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::group(['middleware' => ['auth:sanctum','checkAdminRole']],function(){
    Route::resource('categories',CategoryController::class);
    Route::resource('brands',BrandController::class);
    Route::resource('products',ProductController::class);

    Route::post('temp-images', [TempImageController::class,'store']);
    Route::post('save-product-image', [ProductController::class,'saveProductImages']);
    Route::get('change-product-default-image', [ProductController::class,'updateDefaultImage']);
    Route::delete('delete-product-image/{id}', [ProductController::class,'deleteProductImage']);

    Route::get('orders',[AdminOrderController::class,'index']);
    Route::get('order/{id}',[AdminOrderController::class,'detail']);
    Route::post('update-order/{id}',[AdminOrderController::class,'updateOrder']);

    Route::get('users',[UserController::class,'index']);

});
