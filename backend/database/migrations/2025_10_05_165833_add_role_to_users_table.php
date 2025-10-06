<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('fname')->after('id');
            $table->string('lname')->after('fname');
            $table->string('contact')->after('email');
            $table->enum('role', ['admin', 'user'])->default('user')->after('contact');
            $table->boolean('is_active')->default(true)->after('role');
            $table->dropColumn('name');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('name')->after('id');
            $table->dropColumn(['fname', 'lname', 'contact', 'role', 'is_active']);
        });
    }
};
