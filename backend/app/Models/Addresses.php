<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Addresses extends Model
{
    public function orders() {
        return $this->hasMany(Order::class, 'address_id');
    }
}
