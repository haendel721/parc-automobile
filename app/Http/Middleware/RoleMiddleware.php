<?php

namespace App\Http\Middleware; 

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
   public function handle(Request $request, Closure $next, $role)
    {
    //     dd(
    //         Auth::user()->role ,
    //         Auth::user()->name            
    //     );

        if (!Auth::check() || strtolower(trim(Auth::user()->role)) !== strtolower(trim($role)) ) {
            abort(403, 'Accès refusé');
        }

        return $next($request);
    }

}
