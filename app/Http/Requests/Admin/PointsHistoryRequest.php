<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class PointsHistoryRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_id' => ['required', 'exists:users,id'],
            'booking_id' => ['nullable', 'exists:bookings,id'],
            'user_reward_id' => ['nullable', 'exists:user_rewards,id'],
            'points_change' => ['required', 'integer'],
            'description' => ['required', 'string', 'max:255'],
        ];
    }

    public function messages()
    {
        return [
            'required' => 'To pole jest wymagane',
            'integer' => 'Pole musi być liczbą całkowitą',
            'exists' => 'Obiekt o podanym id nie istnieje',
            'max' => 'Pole nie może przekraczać :max znaków',
        ];
    }
}
