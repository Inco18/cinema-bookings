<?php

namespace App\Http\Requests\Admin;

use App\Enums\ShowingType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ShowingRequest extends FormRequest {
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array {
        return [
            'hall_id' => ['required', 'exists:halls,id'],
            'movie_id' => ['required', 'exists:movies,id'],
            'start_time' => ['required', 'date', 'after_or_equal:today'],
            'end_time' => ['required', 'date', 'after:start_time'],
            'speech_lang' => ['required', 'max:3'],
            'dubbing_lang' => ['max:3'],
            'subtitles_lang' => ['max:3'],
            'type' => ['required', Rule::in(ShowingType::toArray())]
        ];
    }

    public function messages() {
        return [
            'required' => 'To pole jest wymagane',
            'date' => 'Podaj poprawną datę',
            'start_time.after_or_equal' => 'Data nie może być w przeszłości',
            'end_time.after' => 'Data zakończenia nie może być wcześniejsza niż data rozpoczęcia',
            'max' => 'Kod języka nie może mieć więcej niż 3 znaki',
            'in' => "Niedopuszczalna zawartość pola",
            'exists' => "Obiekt o podanym id nie istnieje",
        ];
    }
}
