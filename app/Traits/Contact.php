<?php

namespace App\Traits;

use App\Models\User;

trait Contact
{
    public function contacts() 
    {
        // $contacts = User::join('chat_contacts as cc', 'users.id', 'cc.contact_id')
        //     ->where('user_id', auth()->id())
        //     ->when(request()->filled('query'), function ($query) {
        //         $query->where('name', 'LIKE', '%'. request('query') .'%');
        //     })
        //     ->select('users.*', 'cc.is_contact_blocked')
        //     ->paginate(15)
        //     ->withQueryString();
        // $contacts = User::leftJoin('chat_contacts as cc', 'users.id', 'cc.contact_id')
        //     // ->where('user_id', auth()->id())
        //     // ->when(request()->filled('query'), function ($query) {
        //     //     $query->where('name', 'LIKE', '%'. request('query') .'%');
        //     // })
        //     ->select('users.*', 'cc.is_contact_blocked')
        //     ->paginate(15)
        //     ->withQueryString();
        // // $contacts = User::all();
        // // dd($contacts);
        // return $contacts;

        $contacts = User::leftJoin('chat_contacts as cc', function ($join) {
            $join->on('users.id', 'cc.contact_id')
                ->where('cc.user_id', auth()->id()); // Ensure the contact belongs to the authenticated user
        })
        ->when(request()->filled('query'), function ($query) {
            // Search for users by name if a query is provided
            $query->where('users.name', 'LIKE', '%'. request('query') .'%');
        })
        ->select('users.*', 'cc.is_contact_blocked') // Select all user details, along with the blacklist status
        ->paginate(15)
        ->withQueryString()
        ->setPath(route('contacts.data'));
        return $contacts;


    }
}