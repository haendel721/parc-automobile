<?php

namespace App\Http\Controllers;
use App\Models\Frais;
use Illuminate\Support\Facades\Auth;

use Illuminate\Http\Request;

class FraisController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'vehicule_id' => 'required|exists:vehicules,id',
            'type_frais' => 'required|in:carburant,entretien,assurance,reparation',
            'montant' => 'required|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        $validated['user_id'] = Auth::id();

        Frais::create($validated);

        return back()->with('message', 'Frais enregistré avec succès !');
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
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
