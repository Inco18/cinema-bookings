<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class MovieRequest extends FormRequest {

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array {
        return [
            'title' => ['required'],
            'director' => ['required', 'regex:/^[\pL\s-]*$/u'],
            'genre_id' => ['required', 'exists:genres,id'],
            'poster_image' => ['nullable', 'image'],
            'duration_seconds' => ['required', 'integer'],
            'release_date' => ['required', 'date'],
            'age_rating' => ['required', 'integer', 'between:0,99'],
            'description' => ['required']
        ];
    }

    public function messages() {
        return [
            'required' => 'To pole jest wymagane',
            'regex' => "To pole może składać się tylko z liter",
            'exists' => "Obiekt o podanym id nie istnieje",
            'image' => "Wyślij poprawny obraz",
            'integer' => "To pole może zawierać tylko liczby całkowite",
            'date' => 'Podaj poprawną datę',
            'between' => 'Podaj liczbę z zakresu 0-99'
        ];
    }
}
