<?php

namespace App\Models;

use App\Notifications\NotifyEntretien5000km;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class Vehicule extends Model
{
    protected $fillable = [
        'immatriculation',
        'marque_id',
        'model',
        'typeVehicule_id',
        'couleur',
        'carburant_id',
        'numSerie',
        'anneeFabrication',
        'dateAcquisition',
        'user_id',
        'photo',
        'kilometrique',
        'capacite_reservoir',
        'historiqueKm',
        'diff_km_cumule',
        'notify5000km',
    ];

    protected $casts = [
        'kilometrique' => 'integer',
        'historiqueKm' => 'integer',
        'diff_km_cumule' => 'integer',
        'notify5000km' => 'boolean',
    ];

    // 🔹 Éviter les boucles de recalcul
    protected $recalculEnCours = false;

    // Relations
    public function marque()
    {
        return $this->belongsTo(Marque::class);
    }

    public function carburant()
    {
        return $this->belongsTo(Carburant::class);
    }

    public function typeVehicule()
    {
        return $this->belongsTo(TypeVehicule::class);
    }

    public function assurance()
    {
        return $this->hasOne(Assurance::class, 'vehicule_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function kilometrages()
    {
        return $this->hasMany(Kilometrage::class);
    }

    public function interventions()
    {
        return $this->hasMany(Intervention::class);
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * 🟩 Étape 1 & 2 : Récupération des données et vérification de historiqueKm
     */
    public function calculerEtMettreAJourKilometrage($forceSave = true)
    {
        // 🔒 Éviter les boucles infinies
        if ($this->recalculEnCours) {
            Log::warning("🔄 Calcul déjà en cours pour le véhicule {$this->id}");
            return $this->kilometrique;
        }
        $this->recalculEnCours = true;

        Log::info("🚗 DÉBUT - Calcul kilométrage véhicule", [
            'vehicule_id' => $this->id,
            'immatriculation' => $this->immatriculation,
            'kilometrique_initial' => $this->kilometrique,
            'historiqueKm_initial' => $this->historiqueKm,
            'diff_km_cumule_initial' => $this->diff_km_cumule,
            'notify5000km_initial' => $this->notify5000km
        ]);
       
        // 🟦 Étape 2 : Vérification de historiqueKm
        if ($this->historiqueKm == 0) {
            Log::info("🟦 Premier relevé détecté", [
                'kilometrique' => $this->kilometrique,
                'historiqueKm' => $this->historiqueKm
            ]);
            // Premier relevé
            $this->traiterPremierReleve();
        } else {
            Log::info("🟦 Calcul normal - Historique existant", [
                'historiqueKm' => $this->historiqueKm
            ]);
            // Continuation du calcul avec diff_km_cumule
            $this->traiterCalculNormal();
        }

        // 💾 Sauvegarde
        if ($forceSave) {
            $this->saveQuietly();
            Log::info("💾 Véhicule sauvegardé", [
                'kilometrique_final' => $this->kilometrique,
                'historiqueKm_final' => $this->historiqueKm,
                'diff_km_cumule_final' => $this->diff_km_cumule,
                'notify5000km_final' => $this->notify5000km
            ]);
        }

        Log::info("✅ FIN - Calcul kilométrage terminé", [
            'kilometrique_final' => $this->kilometrique,
            'kilometrage_total' => $this->kilometrage_total
        ]);

        $this->recalculEnCours = false;
        return $this->kilometrique;
    }

    /**
     * Traitement pour le premier relevé
     */
    protected function traiterPremierReleve()
    {
        if ($this->kilometrique >= 5000) {
            Log::info("🎯 SEUIL ATTEINT - Premier relevé ≥ 5000km", [
                'kilometrique' => $this->kilometrique
            ]);
            
            // 🔔 Envoyer immédiatement une notification
            $this->envoyerNotification5000km();
            
            // Sauvegarder l'ancien compteur et réinitialiser
            $this->historiqueKm += $this->kilometrique;
            $this->kilometrique = 0;
            $this->diff_km_cumule = 0;
            $this->notify5000km = true;

            Log::info("🔄 Cycle réinitialisé après premier relevé", [
                'historiqueKm_apres' => $this->historiqueKm,
                'kilometrique_apres' => $this->kilometrique
            ]);
        } else {
            Log::info("📝 Premier relevé normal", [
                'kilometrique' => $this->kilometrique
            ]);
            // Commencer le calcul normal
            $this->kilometrique;
            $this->diff_km_cumule = 0;
        }
    }

    /**
     * 🟨🟧🟪 Traitement du calcul normal des différences
     */
    protected function traiterCalculNormal()
    {
        // 🟨 Étape 3 : Filtrage des relevés
        $pointReference = $this->historiqueKm > 0 ? $this->kilometrique : $this->kilometrique;

        Log::info("🟨 Filtrage des relevés", [
            'point_reference' => $pointReference
        ]);

        $pointsKilometriques = $this->collecterPointsValides($pointReference);

        if ($pointsKilometriques->isEmpty()) {
            Log::info("📭 Aucun nouveau point kilométrique valide");
            return;
        }

        Log::info("🟨 Points valides collectés", [
            'nombre_points' => $pointsKilometriques->count(),
            'points' => $pointsKilometriques->pluck('valeur')->toArray()
        ]);

        // 🟧 Étape 4 : Tri et calcul des différences
        $totalDifference = $this->calculerDifferencesSuccessives($pointsKilometriques, $pointReference);

        // 🟪 Étape 5 : Mise à jour du kilométrage total
        $this->mettreAJourKilometrageTotal($totalDifference);

        // 🔴 Étape 6 : Vérification du seuil 5000 km
        $this->verifierSeuil5000km();
    }

    /**
     * 🟨 Étape 3 : Collecte des points valides
     */
    protected function collecterPointsValides($pointReference)
    {
        $points = collect();

        // Récupérer les relevés de kilométrage valides
        $relevesValides = $this->kilometrages()
            ->where('kilometrage', '>', $pointReference)
            ->get();

        Log::debug("🔍 Recherche relevés valides", [
            'point_reference' => $pointReference,
            'nombre_releves_trouves' => $relevesValides->count()
        ]);

        foreach ($relevesValides as $releve) {
            $points->push([
                'valeur' => $releve->kilometrage,
                'date' => $releve->date_releve,
                'type' => 'releve'
            ]);
        }

        return $points;
    }

    /**
     * 🟧 Étape 4 : Calcul des différences successives
     */
    protected function calculerDifferencesSuccessives($points, $pointReference)
    {
        Log::info("🟧 Début calcul différences", [
            'point_reference' => $pointReference,
            'nombre_points' => $points->count()
        ]);

        // Trier par valeur croissante
        $pointsTries = $points->sortBy('valeur')->values();

        $totalDifference = 0;
        $dernierPoint = $pointReference;

        foreach ($pointsTries as $index => $point) {
            $difference = $point['valeur'] - $dernierPoint;
            if ($difference > 0) {
                $totalDifference += $difference;
                $dernierPoint = $point['valeur'];
                
                Log::debug("📊 Calcul différence détaillé", [
                    'iteration' => $index + 1,
                    'point_actuel' => $point['valeur'],
                    'dernier_point' => $dernierPoint,
                    'difference' => $difference,
                    'total_difference_cumulee' => $totalDifference
                ]);
            }
        }

        Log::info("🟧 Calcul différences terminé", [
            'total_difference' => $totalDifference,
            'dernier_point_traite' => $dernierPoint
        ]);

        return $totalDifference;
    }

    /**
     * 🟪 Étape 5 : Mise à jour du kilométrage total
     */
    protected function mettreAJourKilometrageTotal($totalDifference)
    {
        Log::info("🟪 Début mise à jour kilométrage", [
            'total_difference' => $totalDifference,
            'diff_km_cumule_avant' => $this->diff_km_cumule,
            'kilometrique_avant' => $this->kilometrique,
            'historiqueKm_avant' => $this->historiqueKm
        ]);

        // Mettre à jour diff_km_cumule
        $nouveauDiffCumule = $this->diff_km_cumule + $totalDifference;

        // Calculer le nouveau kilométrage total
        if ($this->historiqueKm > 0) {
            // Utiliser le point de référence historiqueKm
            $nouveauKilometrage = $this->historiqueKm + $nouveauDiffCumule;
            Log::debug("🟪 Mode historique", [
                'historiqueKm' => $this->historiqueKm,
                'nouveauDiffCumule' => $nouveauDiffCumule,
                'nouveauKilometrage' => $nouveauKilometrage
            ]);
        } else {
            // Premier calcul
            $nouveauKilometrage = $this->kilometrique + $totalDifference;
            Log::debug("🟪 Mode premier calcul", [
                'kilometrique_initial' => $this->kilometrique,
                'totalDifference' => $totalDifference,
                'nouveauKilometrage' => $nouveauKilometrage
            ]);
        }

        $this->diff_km_cumule = $nouveauDiffCumule;
        $this->kilometrique = $nouveauKilometrage;

        Log::info("🟪 Mise à jour terminée", [
            'diff_km_cumule_apres' => $this->diff_km_cumule,
            'kilometrique_apres' => $this->kilometrique
        ]);
    }

    /**
     * 🔴 Étape 6 : Vérification du seuil 5000 km
     */
    protected function verifierSeuil5000km()
    {
        Log::info("🔴 Vérification seuil 5000km", [
            'diff_km_cumule' => $this->diff_km_cumule,
            'notify5000km' => $this->notify5000km
        ]);

        if ($this->diff_km_cumule >= 5000 && !$this->notify5000km) {
            Log::info("🎯 SEUIL 5000km ATTEINT - Début traitement", [
                'diff_km_cumule' => $this->diff_km_cumule,
                'kilometrique_avant' => $this->kilometrique,
                'historiqueKm_avant' => $this->historiqueKm
            ]);

            // 🔔 Envoyer notification
            $this->envoyerNotification5000km();

            // 🟫 Mise à jour après seuil atteint
            $this->historiqueKm += $this->kilometrique; // Sauvegarder l'ancien compteur
            $this->kilometrique = 0; // Réinitialiser
            $this->diff_km_cumule = 0; // Réinitialiser le cumul
            $this->notify5000km = true; // Marquer notification envoyée

            Log::info("🔄 Cycle réinitialisé après 5000km", [
                'historiqueKm_apres' => $this->historiqueKm,
                'kilometrique_apres' => $this->kilometrique,
                'diff_km_cumule_apres' => $this->diff_km_cumule,
                'notify5000km_apres' => $this->notify5000km
            ]);

            return true;
        }

        Log::info("🟫 Seuil non atteint", [
            'diff_km_cumule' => $this->diff_km_cumule,
            'reste_pour_seuil' => 5000 - $this->diff_km_cumule
        ]);
        return false;
    }

    /**
     * 🔔 Envoi de notification 5000km
     */
    protected function envoyerNotification5000km()
    {
        $owner = $this->owner;
        if ($owner) {
            Log::info("📧 Envoi notification au propriétaire", [
                'proprietaire_id' => $owner->id,
                'proprietaire_email' => $owner->email
            ]);
            
            $owner->notify(new NotifyEntretien5000km($this));
            
            Log::info("✅ Notification 5000km envoyée avec succès");
        } else {
            Log::warning("⚠️ Aucun propriétaire trouvé pour envoyer la notification", [
                'vehicule_id' => $this->id,
                'immatriculation' => $this->immatriculation
            ]);
        }
    }

    /**
     * Méthodes utilitaires
     */
    public function recalculerKilometrage()
    {
        Log::info("🔧 Recalcul manuel du kilométrage", [
            'vehicule_id' => $this->id,
            'immatriculation' => $this->immatriculation
        ]);
        
        return $this->calculerEtMettreAJourKilometrage(true);
    }

    public function testerSeuil5000km()
    {
        Log::info("🧪 Test manuel du seuil 5000km", [
            'vehicule_id' => $this->id,
            'immatriculation' => $this->immatriculation
        ]);
        
        return $this->verifierSeuil5000km();
    }

    public function reinitialiserCycle()
    {
        Log::info("🔄 Réinitialisation manuelle du cycle", [
            'vehicule_id' => $this->id,
            'immatriculation' => $this->immatriculation,
            'ancien_historiqueKm' => $this->historiqueKm,
            'ancien_diff_km_cumule' => $this->diff_km_cumule
        ]);

        $this->historiqueKm = 0;
        $this->diff_km_cumule = 0;
        $this->notify5000km = false;
        $this->saveQuietly();

        Log::info("✅ Cycle réinitialisé", [
            'nouvel_historiqueKm' => $this->historiqueKm,
            'nouveau_diff_km_cumule' => $this->diff_km_cumule
        ]);
    }

    /**
     * Accesseur pour le kilométrage total
     */
    public function getKilometrageTotalAttribute()
    {
        return $this->historiqueKm + $this->kilometrique;
    }

    /**
     * Sauvegarde silencieuse
     */
    public function saveQuietly(array $options = [])
    {
        return static::withoutEvents(function () use ($options) {
            return $this->save($options);
        });
    }
}