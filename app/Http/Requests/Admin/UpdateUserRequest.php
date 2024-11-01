<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest {
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array {
        return [
            'first_name' => ['required', 'regex:/^[\pL\s-]*$/u', 'max:255'],
            'last_name' => ['required', 'regex:/^[\pL\s-]*$/u', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
            ],
            'role' => ['in:client,admin']
        ];
    }

    public function messages() {
        return [
            'required' => 'To pole jest wymagane',
            'regex' => "To pole może składać się tylko z liter",
            'max' => "Przekroczono maksymalną długość pola",
            'email' => "Podaj poprawny adres email",
            "role.in" => "To pole może mieć wartość: Klient lub Admin"
        ];
    }
}
