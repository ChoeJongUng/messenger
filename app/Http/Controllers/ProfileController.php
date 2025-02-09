<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Carbon\Carbon;
class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $friends = User::whereNot('id', auth()->id())
                ->select('id', 'name')
                ->get();
      
        return Inertia::render('profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'friends'=>$friends
        ]);
    }
    public function personal(Request $request): Response
    {
        $friends = User::whereNot('id', auth()->id())
                ->select('id', 'name')
                ->get();
      
        return Inertia::render('profile/Personal', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'friends'=>$friends
        ]);
    }
    public function premium(Request $request): Response
    {
        $friends = User::whereNot('id', auth()->id())
                ->select('id', 'name')
                ->get();
      
        return Inertia::render('profile/Premium', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'friends'=>$friends
        ]);
    }
    public function security(Request $request): Response
    {
        $friends = User::whereNot('id', auth()->id())
                ->select('id', 'name')
                ->get();
      
        return Inertia::render('profile/Security', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'friends'=>$friends
        ]);
    }
    public function account(Request $request): Response
    {
        $friends = User::whereNot('id', auth()->id())
                ->select('id', 'name')
                ->get();
      
        return Inertia::render('profile/Account', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'friends'=>$friends
        ]);
    }
    public function charge(Request $request): Response
    {
        $friends = User::whereNot('id', auth()->id())
                ->select('id', 'name')
                ->get();
      
        return Inertia::render('profile/Charge', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'friends'=>$friends
        ]);
    }
    public function get_premium(Request $request){
        $paid_at = auth()->user()->paid_at;
        $finished_at = auth()->user()->finished_at;
        $now=Date('Y-m-d h:i:s');
        $diff=-1;
        $is_premium = false;
        if(!is_null($paid_at)&&!is_null($finished_at)){
            if($finished_at>$now){
                $date1 = new \DateTime($finished_at);
                $date2 = new \DateTime($now);

                // Calculate the difference
                $diff = $date1->diff($date2)->days;
                if($diff>=0) $is_premium = true;
            }
        }

        
        return response()->json([
            'is_premium'=>$is_premium,
            'diff'=>$diff
        ]);

    }
    public function get_credit(Request $request){
        $balance = auth()->user()->balance;
        
        return response()->json([
            'credit'=>$balance,
        ]);

    }
    public function btransfer(Request $request): Response
    {
        $friends = User::whereNot('id', auth()->id())
                ->select('id', 'name')
                ->get();
      
        return Inertia::render('profile/Transfer', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'friends'=>$friends
        ]);
    }
    /**
     * Update the user's profile information.
     */
    public function transfer(Request $request): Response
    {
        $balance = $request->input('balance')-$request->input('amount');
        $user = $request->user();
        $user->update([
            'balance' => $balance
        ]);
        $target = User::where('name',$request->input('target_name'))->first();
        $target->update([
            'balance'=>$target->balance+$request->input('amount')
        ]);

        // return Redirect::to('/profile');
        return Inertia::render('profile/Edit', [
            'status' => 'Transaction completed successfully!',
            'status_type' => 'transfer' // You can also pass the message type (success, error, etc.)
        ]);
    }
    public function purchase(Request $request): RedirectResponse
    {
        $user = $request->user();

        $paid_at = auth()->user()->paid_at;
        $finished_at = auth()->user()->finished_at;
        $now=Date('Y-m-d h:i:s');
        $diff=-1;
        $is_premium = false;
        if(!is_null($paid_at)&&!is_null($finished_at)){
            if($finished_at>$now){
                $date1 = new \DateTime($finished_at);
                $date2 = new \DateTime($now);

                // Calculate the difference
                $diff = $date1->diff($date2)->days;
            }
        }
        if($diff>=0) $is_premium = true;
        $balance = $user->balance-1000;

        if($is_premium==false){
            $paid_at = Carbon::now()->format('Y-m-d H:i:s');  // Using Carbon to get the current date and time
            $finished_at = Carbon::now()->addDays(30)->format('Y-m-d H:i:s');  // Add 30 days to the current date
        }else{
            $paid_at = Carbon::now()->format('Y-m-d H:i:s');  // Using Carbon to get the current date and time
            $finished_at = Carbon::parse($finished_at)->addDays(30)->format('Y-m-d H:i:s');
        }


        $user->update([
            'balance' => $balance,
            'paid_at'=>$paid_at,
            'finished_at'=>$finished_at
        ]);

        return Redirect::to('/profile');
    }
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $attributes = $request->validated();
        if ($request->hasFile('avatar')) {
            $attributes['avatar'] = upload_file($request->file('avatar'), 'user');
            remove_file($request->user()->avatar);
        } else {
            unset($attributes['avatar']);
        }

        $request->user()->fill($attributes);

        // if ($request->user()->isDirty('email')) {
        //     $request->user()->email_verified_at = null;
        // }

        $request->user()->update($attributes);

        return Redirect::to('/profile');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->update([
            'name' => 'Deleted Account',
            'phone' => $user->id,
            'avatar' => '/images/ghost.png',
            'active_status' => false,
            'is_online' => false,
            'last_seen' => '1970-01-01'
        ]);

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
