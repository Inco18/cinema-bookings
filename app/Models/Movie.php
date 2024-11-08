<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * 
 *
 * @property int $id
 * @property int $genre_id
 * @property string $title
 * @property string $director
 * @property int $duration_seconds
 * @property string $description
 * @property string $poster_image
 * @property string $release_date
 * @property int $age_rating
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Genre $genre
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Showing> $showings
 * @property-read int|null $showings_count
 * @method static \Database\Factories\MovieFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Movie newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Movie newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Movie query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Movie whereAgeRating($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Movie whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Movie whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Movie whereDirector($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Movie whereDurationSeconds($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Movie whereGenreId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Movie whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Movie wherePosterImage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Movie whereReleaseDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Movie whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Movie whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Movie extends Model {
    use HasFactory;

    protected $fillable = [
        'title', 'director', 'duration_seconds', 'description', 'poster_image', 'release_date', 'age_rating', 'genre_id'
    ];

    public function genre(): BelongsTo {
        return $this->belongsTo(Genre::class);
    }
    public function showings(): HasMany {
        return $this->hasMany(Showing::class);
    }
}
