<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Entretien;

class DashboardController extends Controller
{
    public function index()
{
    // Récupère tous les entretiens avec les infos de véhicule liées
    $entretiens = Entretien::with('vehicule')->get();

    // Renvoie les données via Inertia
    return inertia('Dashboard', [
        'entretiens' => $entretiens
    ]);
}

}
