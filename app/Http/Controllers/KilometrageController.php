<?php

namespace App\Http\Controllers;

use App\Models\Vehicule;
use Illuminate\Http\Request;
use App\Models\kilometrage;

class KilometrageController extends Controller
{

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validation des données reçues
        $validated = $request->validate([
            'date_releve' => 'required|date',
            'kilometrage' => 'required|integer|min:0',
            'type_releve' => 'required|in:normal,vidange',
            'vehicule_id' => 'required|exists:vehicules,id',
        ]);
        // dd($validated);
        // Création du relevé
        $releve = kilometrage::create($validated);
        return redirect()->back()->with('success', 'Kilométrage enregistré !');

        // Retourne une réponse JSON ou redirection
        // return response()->json([
        //     'message' => 'Relevé de kilométrage enregistré avec succès.',
        //     'releve' => $releve
        // ], 201);
    }

    public function sommeKilometrage($vehiculeId)
    {
        $vehicule = Vehicule::with(['kilometrages', 'interventions'])->find($vehiculeId);

        $total = $vehicule->calculerEtMettreAJourKilometrage();

        return response()->json([
            'vehicule' => $vehicule->modele,
            'kilometrage_total' => $total . ' km'
        ]);
    }
     public function sommeKilometrageToutVehicule()
    {
        $vehicules = Vehicule::with(['kilometrages', 'interventions'])->get();

        $resultats = [];

        foreach ($vehicules as $vehicule) {
            $total = $vehicule->calculerEtMettreAJourKilometrage();

            $resultats[] = [
                'vehicule' => $vehicule->id,
                'kilometrage_total' => number_format($total, 0, ',', ' ') . ' km',
            ];
        }

        return response()->json($resultats);
    }
}
