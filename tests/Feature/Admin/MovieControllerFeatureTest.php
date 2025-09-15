<?php

namespace Tests\Feature\Admin;

use App\Enums\RoleType;
use App\Models\Genre;
use App\Models\Movie;
use App\Models\User;
use Database\Seeders\PermissionSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MovieControllerFeatureTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(PermissionSeeder::class);
        $this->seed(RoleSeeder::class);
        $this->admin = User::factory()->create([
            'first_name' => 'Admin',
            'last_name' => 'Adminowy',
            'email' => 'admin@admin.com',
            'password' => '12345678',
        ])->assignRole(RoleType::ADMIN->value)->assignRole(RoleType::WORKER->value)->removeRole(RoleType::CLIENT->value);
        Genre::factory()->create(['name' => 'Akcja']);
    }

    /** @test */
    public function admin_can_create_movie_with_poster()
    {
        Storage::fake('local');
        $this->actingAs($this->admin);
        $file = UploadedFile::fake()->image('poster.jpg');
        $response = $this->post(route('movies.store'), [
            'title' => 'Test Movie',
            'director' => 'Test Director',
            'duration_seconds' => 7200,
            'description' => 'Opis',
            'poster_image' => $file,
            'release_date' => '2025-01-01',
            'age_rating' => 12,
            'genre_id' => Genre::first()->id,
        ]);
        $response->assertRedirect(route('movies.index'));
        $this->assertDatabaseHas('movies', ['title' => 'Test Movie']);
        Storage::disk('public')->assertExists('posters/'.$file->hashName());
    }

    /** @test */
    public function admin_can_update_movie_and_remove_poster()
    {
        Storage::fake('local');
        $this->actingAs($this->admin);
        $file = UploadedFile::fake()->image('poster.jpg');
        $movie = Movie::factory()->create([
            'poster_image' => $file->store('posters'),
            'genre_id' => Genre::first()->id,
        ]);
        $response = $this->put(route('movies.update', $movie), [
            'title' => 'Nowy tytuł',
            'director' => $movie->director,
            'duration_seconds' => $movie->duration_seconds,
            'description' => $movie->description,
            'release_date' => $movie->release_date,
            'age_rating' => $movie->age_rating,
            'genre_id' => $movie->genre_id,
            'removePoster' => true,
        ]);
        $response->assertRedirect(route('movies.index'));
        $this->assertDatabaseHas('movies', ['id' => $movie->id, 'title' => 'Nowy tytuł']);
        Storage::disk('local')->assertMissing($movie->poster_image);
    }

    /** @test */
    public function admin_can_delete_movie_and_poster()
    {
        Storage::fake('local');
        $this->actingAs($this->admin);
        $file = UploadedFile::fake()->image('poster.jpg');
        $posterPath = $file->store('posters');
        $movie = Movie::factory()->create([
            'poster_image' => $posterPath,
            'genre_id' => Genre::first()->id,
        ]);
        $this->delete(route('movies.destroy', $movie));
        $this->assertDatabaseMissing('movies', ['id' => $movie->id]);
        Storage::disk('local')->assertMissing($posterPath);
    }

    /** @test */
    public function admin_can_search_and_sort_movies()
    {
        $this->actingAs($this->admin);
        Movie::factory()->create(['title' => 'Aaa', 'genre_id' => Genre::first()->id]);
        Movie::factory()->create(['title' => 'Zzz', 'genre_id' => Genre::first()->id]);
        $response = $this->get(route('movies.index', ['search' => 'Aaa']));
        $response->assertOk();
        $response->assertSee('Aaa');
        $response->assertDontSee('Zzz');
        $response = $this->get(route('movies.index', ['sortBy' => 'title', 'sortDesc' => true]));
        $response->assertOk();
        $this->assertStringContainsString('Zzz', $response->getContent());
    }
}
