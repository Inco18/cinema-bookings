<?php

namespace App\Http\Requests\Main;

use App\Rules\ValidSeatsForShowing;
use Illuminate\Foundation\Http\FormRequest;

class UpdateBookingSeatsRequest extends FormRequest {
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array {
        return [
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
            'required' => 'Przynajmniej 1 miejsce musi być wybrane',
            'seats.min' => "Przynajmniej 1 miejsce musi być wybrane",
            'seats.*.distinct' => 'Tablica siedzeń nie może zawierać duplikatów',
            'seats.*.exists' => 'Jedno lub więcej siedzeń nie istnieje',
        ];
    }
}
