<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\TempImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

use function Psy\debug;

class ProductController extends Controller
{
    public function index(){
        $products = Product::orderBy('created_at','DESC')
                                    ->with('product_images')
                                    ->get();
        return response()->json([
            'status' => 200,
            'data' => $products
        ],200);
    }

    public function store(Request $request){

        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'price' => 'required|numeric',
            'qty' => 'required|numeric',
            'category' => 'required|integer',
            //'sku' => 'required|unique:products,sku',
            //'is_featured' => 'required',
            'weight' => 'required',
            'status' => 'required'
        ]);

        if($validator->fails()){
            return response()->json([
                'status' => 400,
                'error' => $validator->errors()
            ], 400);
        }

        $product = new Product();
        $product->title = $request->title;
        $product->price = $request->price;
        $product->compare_price = $request->compare_price;
        $product->category_id = $request->category;
        $product->brand_id = $request->brand;
        $product->sku = $request->sku;
        $product->qty = $request->qty;
        $product->weight = $request->weight;
        $product->description = $request->description;
        $product->short_description = $request->short_description;
        $product->status = $request->status;
        $product->is_featured = $request->is_featured;
        $product->save();

        //images upload
        if(!empty($request->gallery)){
            foreach ($request->gallery as $key => $tempImageId){
                $tempImage = TempImage::find($tempImageId);

                //Large Image
                $extArray = explode('.',$tempImage->name);
                $ext = end($extArray);

                $imageName = $product->id . '-' . time() . '-' . uniqid() . '.' . $ext;
                $manager = new ImageManager(Driver::class);
                $img = $manager->read(public_path('uploads/temp/'.$tempImage->name));
                $img->scaleDown(1200);
                $img->save(public_path('uploads/products/large/'.$imageName));

                //Small Image
                $manager = new ImageManager(Driver::class);
                $img = $manager->read(public_path('uploads/temp/'.$tempImage->name));
                $img->coverDown(500,560);
                $img->save(public_path('uploads/products/small/'.$imageName));

                $productImage = new ProductImage();
                $productImage->image = $imageName;
                $productImage->product_id = $product->id;
                $productImage->save();

                if($key==0){
                    $product->image = $imageName;
                    $product->save();
                }

            }
        }

        return response()->json([
            'status' => 200,
            'message' => 'Product has been Created Successfully'
        ], 200);

    }

    public function show($id){
        $product =  Product::with('product_images')->find($id);

        if($product == null){
            return response()->json([
                'status' => 404,
                'message' => 'Product Not Found'
            ],404);
        }

        return response()->json([
            'status' => 200,
            'data' => $product
        ]);

    }

    public function update($id , Request $request){

        $product =  Product::find($id);

        if($product == null){
            return response()->json([
                'status' => 404,
                'message' => 'Product Not Found'
            ],404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'price' => 'required|numeric',
            'qty' => 'required|numeric',
            'sku' => 'required|unique:products,sku,'.$id.',id',
            //'is_featured' => 'required',
            'weight' => 'required',
            'status' => 'required'
        ]);

        if($validator->fails()){
            return response()->json([
                'status' => 400,
                'error' => $validator->errors()
            ], 400);
        }


        $product->title = $request->title;
        $product->price = $request->price;
        $product->compare_price = $request->compare_price;
        $product->category_id = $request->category;
        $product->brand_id = $request->brand;
        $product->sku = $request->sku;
        $product->qty = $request->qty;
        $product->weight = $request->weight;
        $product->description = $request->description;
        $product->short_description = $request->short_description;
        $product->status = $request->status;
        $product->is_featured = $request->is_featured;
        $product->save();

        return response()->json([
            'status' => 200,
            'message' => 'Product has been Updated Successfully'
        ], 200);

        return response()->json([
            'status' => 500,
            'message' => 'Internal Server Error',
            'error' => $e->getMessage()
        ], 500);
    }

    public function destroy($id){

        $product =  Product::find($id);

        if($product == null){
            return response()->json([
                'status' => 404,
                'message' => 'Product Not Found'
            ],404);
        }

        $product->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Product has been Deleted Successfully'
        ]);

    }
    public function saveProductImages(Request $request){
        $validator = Validator::make($request->all(),[
            'image' => 'required|mimes:jpg,jpeg,png,gif'
        ]);

        if($validator->fails()){
            return response()->json([
                'status' => 400,
                'error' => $validator->errors()
            ], 400);
        }



        $image = $request->file('image');
        $imageName = $request->product_id.'-'.time().'.'.$image->extension();

         //Large Image

         $manager = new ImageManager(Driver::class);
         $img = $manager->read($image->getPathName());
         $img->scaleDown(1200);
         $img->save(public_path('uploads/products/large/'.$imageName));

         //Small Image
         $manager = new ImageManager(Driver::class);
         $img = $manager->read($image->getPathName());
         $img->coverDown(500,560);
         $img->save(public_path('uploads/products/small/'.$imageName));

        $productImage = new ProductImage();
        $productImage->image = $imageName;
        $productImage->product_id = $request->product_id;
        $productImage->save();

        return response()->json([
            'status' => 200,
            'message' => 'Image uploaded successfully',
            'data' => $productImage
        ],200);
    }
    public function updateDefaultImage(Request $request){

        $product = Product::find($request->product_id);
        $product->image = $request->image;
        $product->save();

        return response()->json([
            'status' => 200,
            'message' => 'Product Default Image Changed Successfully',
            'data' => $product
        ],200);
    }
    public function deleteProductImage($id){
        $productImage = ProductImage::find($id);
        if($productImage == null){
            return response()->json([
                'status' => 404,
                'message' => 'Image not Found'
            ],200);
        }
        File::delete(public_path('uploads/products/large/'.$productImage->image));
        File::delete(public_path('uploads/products/small/'.$productImage->image));

        $productImage->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Product Image Deleted Successfully'
        ],200);
    }
}
