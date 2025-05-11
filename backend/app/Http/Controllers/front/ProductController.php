<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function latestProducts(){
        $products =  Product::orderBy('created_at','DESC')
                                    ->where('status',1)
                                    ->limit(8)
                                    ->get();

        return response()->json([
            'status' => 200,
            'data' => $products
        ],200);
    }

    public function FeaturedProducts(){
        $products =  Product::orderBy('created_at','DESC')
                                    ->where('status',1)
                                    ->where('is_featured','yes')
                                    ->limit(8)
                                    ->get();

        return response()->json([
            'status' => 200,
            'data' => $products
        ],200);
    }
    public function getCatergories(){
        $categories = Category::orderBy('name' , 'ASC')->where('status' , 1)->get();
        return response()->json([
            'status' => 200,
            'data' => $categories
        ],200);
    }
    public function getBrands(){
        $brands = Brand::orderBy('name','ASC')->where('status',1)->get();
        return response()->json([
            'status' => 200,
            'data' => $brands
        ],200);
    }
    public function getProducts(Request $request){
        $products = Product::orderBy('created_at','DESC')->where('status',1);

        //Filter Products using Category
        if(!empty($request->category)){
            $categoryArray = explode(',',$request->category);
            $products = $products->whereIn('category_id',$categoryArray);
        }

        //Filter Products using Brands
        if(!empty($request->brand)){
            $brandArray = explode(',',$request->brand);
            $products = $products->whereIn('brand_id',$brandArray);
        }

        $products = $products->get();

        return response()->json([
            'status' => 200,
            'data' => $products
        ],200);
    }

    public function productPage($id, Request $request){
        $product = Product::with('product_images')->find($id);

        if($product == null){
            return response()->json([
                'status' => 404,
                'message' => 'Product Not Found'
            ],404);
        }

        $products = Product::query();

        if ($request->has('search')) {
            $products->where('title', 'like', '%' . $request->search . '%');
        }

        return response()->json([
            'status' => 200,
            'data' => $product
        ],200);
    }

    public function filteredProducts(Request $request) {
        $products = Product::with('product_images') // include images
            ->orderBy('created_at', 'DESC')
            ->where('status', 1);

        // Search filter
        if ($request->has('search') && !empty($request->search)) {
            $products->where('title', 'like', '%' . $request->search . '%');
        }

        // Category filter
        if ($request->has('category') && !empty($request->category)) {
            $categoryIds = explode(',', $request->category);
            $products->whereIn('category_id', $categoryIds);
        }

        // Brand filter
        if ($request->has('brand') && !empty($request->brand)) {
            $brandIds = explode(',', $request->brand);
            $products->whereIn('brand_id', $brandIds);
        }

        $products = $products->get();

        return response()->json([
            'status' => 200,
            'data' => $products
        ]);
    }
}
