<?php

use App\Enums\RewardType;
use App\Enums\RewardValueType;
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
        Schema::create('rewards', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('cost_points');
            $table->enum('type', RewardType::toArray());
            $table->decimal('value', 8, 2)->nullable();
            $table->enum('value_type', RewardValueType::toArray())->nullable();
            $table->string('details')->nullable();
            $table->string('image')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rewards');
    }
};
