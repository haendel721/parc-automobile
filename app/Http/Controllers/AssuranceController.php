<?php

namespace App\Http\Controllers;

use App\Models\assurance;
use App\Models\Vehicule;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Carburant;
use App\Models\TypeVehicule;
use App\Models\Marque;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class AssuranceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $assurances = Auth::user()->role === 'admin' ? assurance::all() : Auth::user()->assurance;

        return Inertia::render('Assurances/Index', [
            'assurances' => $assurances,
            'roleUser' => ['role' => Auth::user()->role],
            'userNames' => User::pluck('name', 'id'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $vehicules = Vehicule::all();
        return Inertia::render('Assurances/Create',[
            'vehicules' => $vehicules,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'vehicule_id' => 'required|exists:vehicules,id',
            'NomCompagnie' =>'required|string',
            'NumContrat' => 'required|string',
            'cout' => 'required|numeric|min:0',
            'dateDebut' => 'nullable|date',
            'dateFin' => 'nullable|date',
            
        ]);
        // dd($data);

        assurance::create($data);
        return redirect()->route('assurances.index')->with('message', 'Assurance Affecter avec succès.');
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
    public function edit(Assurance $assurance)
    {
        return Inertia::render('Assurances/Edit', [
            'assurance' => $assurance,
            'Vehicule' => Vehicule::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */

    public function update(Request $request, Assurance $assurance)
    {
        $data = $request->validate([
           'vehicule_id' => 'required|exists:vehicules,id',
            'NomCompagnie' =>'required|string',
            'NumContrat' => 'required|string',
            'cout' => 'required|numeric|min:0',
            'dateDebut' => 'nullable|date',
            'dateFin' => 'nullable|date',
        ]);
        // dd($data);
        $assurance->update($data);

        return redirect()->route('assurances.index')->with('message', 'Assurance mis à jour avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Assurance $assurance)
    {
        $assurance->delete();
        return redirect()->route('assurances.index')->with('message', 'Assurance supprimé avec succès.');
    }
}
