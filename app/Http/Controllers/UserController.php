<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $utilisateurs = User::all();
        return Inertia::render('Utilisateurs/Index', compact('utilisateurs'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // return Inertia::render('Utilisateurs/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        return Inertia::render('Utilisateurs/Edit', [
            'user' => $user
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        // dd([
        //     'user_avant_update' => $user,
        //     'donnees_formulaire' => $request->all(),
        // ]);

        $request->validate([
            'name' => 'required',
            'prenom' => 'required',
            'phone' => 'required|regex:/^[0-9]{10}$/',
            'statut' => 'required',
            'fonction' => 'required',
            'email' => 'required',
            'role' => 'required',
        ]);
        $user->update($request->all());
        return redirect()->route('utilisateurs.index')->with('message', 'Utilisateur mis à jour avec succès');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
