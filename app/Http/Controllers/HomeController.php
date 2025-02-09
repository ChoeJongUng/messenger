<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index() 
    {
            if (auth()->guest()) {
            // Redirect to the register page
            return redirect()->route('register');
        }
        return Inertia::render('welcome/Index', [
            'canResetPassword' => Route::has('password.request'),
            'appName' => "TradeLink"
        ]);
    }
}
