<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'brand',
        'product_name',
        'product_image',
        'quantity',
        'cost_price',
        'sell_price',
        'description',
        'rating',
        'is_active',
    ];

    protected $casts = [
        'cost_price' => 'decimal:2',
        'sell_price' => 'decimal:2',
        'is_active' => 'boolean',
        'rating' => 'integer',
        'quantity' => 'integer',
    ];

    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }
}
