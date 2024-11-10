<?php

use App\Enums\ShowingType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('showings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('movie_id')->constrained();
            $table->foreignId('hall_id')->constrained();
            $table->dateTime('start_time');
            $table->dateTime('end_time');
            $table->string('speech_lang');
            $table->string('dubbing_lang')->nullable();
            $table->string('subtitles_lang')->nullable();
            $table->string('type')->default(ShowingType::TWO_D);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('showings');
    }
};
