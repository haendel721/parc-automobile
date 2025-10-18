<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
    ];
    // Un véhicule appartient à une seule marque
    public function marque()
    {
        return $this->belongsTo(Marque::class);
    }

    // Un véhicule utilise un seul type de carburant
    public function carburant()
    {
        return $this->belongsTo(Carburant::class);
    }
    // Un véhicule a un seul type de véhicule
    public function typeVehicule()
    {
        return $this->belongsTo(TypeVehicule::class);
    }

    public function assurance()
    {
        return $this->hasOne(Assurance::class, 'vehicule_id');
    }

    /**
     * Un véhicule peut avoir plusieurs assurances.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
