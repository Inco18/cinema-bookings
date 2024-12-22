<?php

namespace App\Http\Requests\Main;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBookingRequest extends FormRequest {
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array {
        return [
            'first_name' => ['required', 'regex:/^[\pL\s-]*$/u', 'max:255'],
            'last_name' => ['required', 'regex:/^[\pL\s-]*$/u', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
        ];
    }

    public function messages() {
        return [
            'required' => 'To pole jest wymagane',
            'max' => "Przekroczono maksymalną długość pola",
            'regex' => "To pole może składać się tylko z liter",
            'email' => "Podaj poprawny adres email",
        ];
    }
}
