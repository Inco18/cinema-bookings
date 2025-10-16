<?php

namespace App\Http\Requests\Admin;

use App\Enums\UserRewardStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRewardRequest extends FormRequest
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
            'reward_id' => ['required', 'exists:rewards,id'],
            'booking_id' => ['nullable', 'exists:bookings,id'],
            'status' => ['required', Rule::in(UserRewardStatus::toArray())],
        ];
    }

    public function messages()
    {
        return [
            'required' => 'To pole jest wymagane',
            'in' => 'Niedopuszczalna zawartość pola',
            'exists' => 'Obiekt o podanym id nie istnieje',
        ];
    }
}
