<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'lowercase', 'max:255', Rule::unique(User::class)->ignore($this->user()->id)],
            'gender'=> ['string', 'max:255'],
            'age'=> ['number'],
            'country'=> ['string', 'max:255'],
            'city'=> ['string', 'max:255'],
            'company'=> ['string', 'max:255'],
            'job'=> ['string', 'max:255'],
            'category'=> ['string', 'max:255'],
            'capability'=>['string', 'max:255'],
        ];
    }
}
