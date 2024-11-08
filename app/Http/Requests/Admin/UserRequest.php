<?php

namespace App\Http\Requests\Admin;

use App\Enums\RoleType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest {
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array {
        $allowedValues = RoleType::toArray();
        return [
            'first_name' => ['required', 'regex:/^[\pL\s-]*$/u', 'max:255'],
            'last_name' => ['required', 'regex:/^[\pL\s-]*$/u', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
            ],
            'roles' => ['required',
                function ($attribute, $value, $fail) use ($allowedValues) {
                    foreach ($value as $item) {
                        if (!in_array($item, $allowedValues)) {
                            $fail("Pole posiada niepoprawną wartość");
                        }
                    }
                },],
        ];
    }

    public function messages() {
        return [
            'required' => 'To pole jest wymagane',
            'regex' => "To pole może składać się tylko z liter",
            'max' => "Przekroczono maksymalną długość pola",
            'email' => "Podaj poprawny adres email",
            'roles.required' => "Użytkownik musi posiadać przynajmniej 1 rolę",
        ];
    }
}
