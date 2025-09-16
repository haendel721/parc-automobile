<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, $roles)
    {
        //     dd(
        //         Auth::user()->role ,
        //         Auth::user()->name            
        //     );

        // Vérifier si l'utilisateur est connecté
        if (!Auth::check()) {
            abort(403, 'Accès refusé');
        }

        // Récupérer le rôle de l'utilisateur connecté
        $userRole = strtolower(trim(Auth::user()->role));

        // Transformer la chaîne "admin,direction" en tableau ['admin', 'direction']
        $rolesArray = array_map('strtolower', array_map('trim', explode(',', $roles)));

        if (!in_array($userRole, $rolesArray)) {
            abort(403, 'Accès refusé');
        }

        return $next($request);
    }
}
