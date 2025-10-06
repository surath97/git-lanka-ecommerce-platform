<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('brand');
            $table->string('product_name');
            $table->string('product_image')->nullable();
            $table->integer('quantity');
            $table->decimal('cost_price', 10, 2);
            $table->decimal('sell_price', 10, 2);
            $table->text('description')->nullable();
            $table->integer('rating')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
