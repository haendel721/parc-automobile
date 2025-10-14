<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Entretien;
use App\Models\Vehicule;
use App\Models\Marque;
use App\Models\User;
use App\Models\Assurance; // si tu as une table assurances
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        // Récupère tous les entretiens avec les infos de véhicule
        $entretiens = Entretien::with('vehicule', 'user')->get();

        // Récupère tous les véhicules
        $vehicules = Vehicule::all();

        // Recupère tous les marques
        $marques = Marque::all();

        // Récupère tous les utilisateurs
        $users = User::all();
        $userConnecter = Auth::user();
        
        // Récupère toutes les assurances
        $assurances = Assurance::all();
        // Ajouter la durée en jours pour chaque assurance
        $assurances->transform(function ($assurance) {
            $dateDebut = \Carbon\Carbon::parse($assurance->dateDebut);
            $dateFin = \Carbon\Carbon::parse($assurance->dateFin);

            // Calcul de la durée en jours
            $assurance->duree_jours = $dateDebut->diffInDays($dateFin);

            return $assurance;
        });
        // Renvoie toutes les données à Inertia
        // $this->updateDernierVisite();
        return inertia('dashboard', [
            'entretiens' => $entretiens,
            'vehicules'  => $vehicules,
            'marques' => $marques,
            'users'      => $users,
            'userConnecter' => $userConnecter,
            'assurances' => $assurances,
        ]);
    }
    // parcourus tous les entretiens est cherche l'entretien qui est déjà finit et en ce moment là dernier_visite = prochaine_visite
    // public function updateDernierVisite(Entretien $entretien){
    //     $derniere_visite = $entretien->prochaine_visite->format('d/m/Y H:i');
    //         $entretien['dernier_visite'] = $derniere_visite;
    //         //  dd($entretien);
    //         $entretien->update();
    // }
}
