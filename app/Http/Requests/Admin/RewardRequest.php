<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class RewardRequest extends FormRequest {
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array {
        return [
            'name' => ['required'],
            'cost_points' => ['required', 'integer', 'min:0'],
            'type' => ['required'],
            'value' => ['nullable', 'numeric'],
            'value_type' => ['nullable'],
            'details' => ['nullable', 'string'],
            'image' => ['nullable', 'image'],
        ];
    }

    public function messages() {
        return [
            'required' => 'To pole jest wymagane',
            'integer' => 'To pole może zawierać tylko liczby całkowite',
            'min' => 'Podaj wartość większą lub równą 0',
            'numeric' => 'To pole może zawierać tylko liczby',
            'image' => 'Wyślij poprawny obraz',
        ];
    }
}
