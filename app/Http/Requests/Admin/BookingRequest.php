<?php

namespace App\Http\Requests\Admin;

use App\Enums\BookingStatus;
use App\Rules\ValidSeatsForShowing;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BookingRequest extends FormRequest {
    /**
     * Determine if the user is authorized to make this request.
     */
    public function rules(): array {
        return [
            'showing_id' => ['required', 'exists:showings,id'],
            'user_id' => ['nullable', 'exists:users,id'],
            'price' => ['required', 'numeric', 'min:0'],
            'status' => ['required', Rule::in(BookingStatus::toArray())],
            'first_name' => ['required', 'regex:/^[\pL\s-]*$/u', 'max:255'],
            'last_name' => ['required', 'regex:/^[\pL\s-]*$/u', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'seats' => [
                'required',
                'array',
                'min:1',
                new ValidSeatsForShowing($this->input(key: 'showing_id'))
            ],
            'seats.*' => [
                'distinct',
                'exists:seats,id'
            ],
        ];
    }

    public function messages() {
        return [
            'required' => 'To pole jest wymagane',
            'in' => "Niedopuszczalna zawartość pola",
            'integer' => 'To pole może zawierać tylko liczby całkowite',
            'numeric' => 'To pole może zawierać tylko liczby',
            'min' => "To pole nie może być mniejsze niż :min",
            'max' => "Przekroczono maksymalną długość pola",
            'exists' => "Obiekt o podanym id nie istnieje",
            'regex' => "To pole może składać się tylko z liter",
            'email' => "Podaj poprawny adres email",
            'seats.min' => "Przynajmniej 1 miejsce musi być wybrane",
            'seats.*.distinct' => 'Tablica siedzeń nie może zawierać duplikatów',
            'seats.*.exists' => 'Jedno lub więcej siedzeń nie istnieje',
        ];
    }
}
