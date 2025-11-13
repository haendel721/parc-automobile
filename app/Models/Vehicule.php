<?php

namespace App\Models;

use App\Notifications\NotifyEntretien5000km;
use Illuminate\Database\Eloquent\Model;

class Vehicule extends Model
{
    protected $fillable = [
        'immatriculation',
        'marque_id',
        'model',
        'numSerie',
        'anneeFabrication',
        'dateAcquisition',
        'carburant_id',
        'typeVehicule_id',
        'couleur',
        'photo',
        'user_id',
        'kilometrique',
        'dernier_kilometrage',
        'dernier_releve_date',
        'releve_km_cumule'
    ];

    // protected $casts = [
    //     'kilometrique' => 'integer',
    // ];

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
        return $this->hasMany(Kilometrage::class)->orderBy('date_releve', 'desc');
    }
    

    public function interventions()
    {
        return $this->hasMany(Intervention::class);
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function dernierKilometrage()
    {
        return $this->hasOne(Kilometrage::class)->latest('date_releve');
    }
    
}
