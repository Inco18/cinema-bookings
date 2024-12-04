<?php

namespace App\Http\Requests\Admin;

use App\Enums\SeatType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SeatRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array {
        return [
            'hall_id' => ['required', 'exists:halls,id'],
            'row' => ['required', 'integer', 'min:1'],
            'column' => ['required', 'integer', 'min:1'],
            'number' => ['required', 'integer', 'min:1'],
            'type' => ['required', Rule::in(SeatType::toArray())]
        ];
    }

    public function messages() {
        return [
            'required' => 'To pole jest wymagane',
            'integer' => 'To pole może zawierać tylko liczby całkowite',
            'min' => "To pole nie może być mniejsze niż 1",
            'in' => "Niedopuszczalna zawartość pola",
            'exists' => "Obiekt o podanym id nie istnieje",
        ];
    }
}
