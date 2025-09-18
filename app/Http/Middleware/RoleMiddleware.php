<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Vérifie si le rôle de l'utilisateur connecté est dans la liste autorisée.
     */
    public function handle(Request $request, Closure $next, $roles): Response
    {
        // Vérifie que l'utilisateur est connecté
        if (!Auth::check()) {
            abort(403, 'Accès refusé - utilisateur non authentifié');
        }

        // Récupère le rôle de l'utilisateur connecté
        $userRole = strtolower(trim(Auth::user()->role));

        $rolesArray = ["admin", "utilisateur"];
        // dd([
        //     'Nom ' => Auth::user()->name,
        //     'Rôle ' =>Auth::user()->role,
        //     'userRole' => $userRole,
        //     'Liste de rôles autorisés' => $rolesArray
        // ]);
        // Si le rôle n'est pas dans le tableau, accès refusé
        if (!in_array($userRole, $rolesArray)) {
            abort(403, 'Accès refusé - rôle non autorisé');
        }

        // Sinon, accès autorisé
        return $next($request);
    }
}
