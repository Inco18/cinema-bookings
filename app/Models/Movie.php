<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Movie extends Model {
    use HasFactory;

    protected $fillable = [
        'title', 'director', 'duration_seconds', 'description', 'poster_image', 'release_date', 'age_rating', 'genre_id'
    ];

    public function genre(): BelongsTo {
        return $this->belongsTo(Genre::class);
    }
}
