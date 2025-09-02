<?php

namespace App\Http\Requests\Main;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTicketsRequest extends FormRequest {
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array {
        return [
            'normal' => ['required', 'integer', 'min:0'],
            'reduced' => ['required', 'integer', 'min:0'],
            'selected_discount_id' => ['nullable', 'integer', 'exists:user_rewards,id'],
        ];
    }

    public function messages() {
        return [
            'required' => 'To pole jest wymagane',
            'min' => "Wartość musi być większa lub równa 0",
            'integer' => 'Wartość musi być liczbą całkowitą',
            'exists' => 'Wybrany rabat nie istnieje',
        ];
    }
}
