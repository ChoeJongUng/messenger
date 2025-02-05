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
            'gender'=> ['string', 'max:255',"nullable"],
            'age'=> ['integer',"nullable"],
            'country'=> ['string', 'max:255',"nullable"],
            'city'=> ['string', 'max:255',"nullable"],
            'company'=> ['string', 'max:255',"nullable"],
            'job'=> ['string', 'max:255',"nullable"],
            'category'=> ['string', 'max:255',"nullable"],
            'capability'=>['string', 'max:255',"nullable"],
        ];
    }
}
