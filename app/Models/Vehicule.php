<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehicule extends Model
{
    protected $fillable = [
        'immatriculation',
        'marque_Id',
        'model',
        'typeVehicule_id',
        'couleur',
        'carburant_id',
        'numSerie',
        'anneeFabrication',
        'dateAcquisition',
        'user_id',
        'photo',
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
    public function user()
{
    return $this->belongsTo(User::class);
}

}
