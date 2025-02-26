<?php

use App\Enums\BookingStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('showing_id')->constrained();
            $table->foreignId('user_id')->nullable()->constrained();
            $table->tinyInteger('num_people');
            $table->decimal('price');
            $table->string("first_name")->nullable();
            $table->string('last_name')->nullable();
            $table->string('email')->nullable();
            $table->enum('status', BookingStatus::toArray());
            $table->string('payment_id')->nullable();
            $table->string('token', 32);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('bookings');
    }
};
