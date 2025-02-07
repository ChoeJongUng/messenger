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
            'avatar' => ['required', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'], 
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'lowercase', 'max:255', Rule::unique(User::class)->ignore($this->user()->id)],
            'gender'=> ['required','string', 'max:255',],
            'age'=> ['required','integer',],
            'country'=> ['required','string', 'max:255',],
            'city'=> ['required','string', 'max:255',],
            'company'=> ['required','string', 'max:255',],
            'job'=> ['required','string', 'max:255',],
            'category'=> ['required','string', 'max:255',],
            'capability'=>['required','string', 'max:255',],
        ];
    }
}
