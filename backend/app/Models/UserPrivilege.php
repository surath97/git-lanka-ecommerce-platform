<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserPrivilege extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'can_add_product',
        'can_update_product',
        'can_delete_product',
    ];

    protected $casts = [
        'can_add_product' => 'boolean',
        'can_update_product' => 'boolean',
        'can_delete_product' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
