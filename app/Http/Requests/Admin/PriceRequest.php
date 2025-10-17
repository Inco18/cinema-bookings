<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class PriceRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'base_price' => ['required', 'numeric', 'min:0', 'max:9999.99'],
            'min_price' => ['required', 'numeric', 'min:0', 'max:9999.99', 'lte:base_price'],
            'max_price' => ['required', 'numeric', 'min:0', 'max:9999.99', 'gte:base_price'],
            'description' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages()
    {
        return [
            'required' => 'To pole jest wymagane',
            'numeric' => 'Pole musi być liczbą',
            'min' => 'Pole nie może być mniejsze niż :min',
            'max' => 'Pole nie może przekraczać :max',
            'lte' => 'Cena minimalna nie może być wyższa niż cena bazowa',
            'gte' => 'Cena maksymalna nie może być niższa niż cena bazowa',
        ];
    }
}
