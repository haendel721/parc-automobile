<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class pleinCarburant extends Model
{
    protected $fillable = [
        'vehicule_id',
        'user_id',
        'date_plein',
        'quantite',
        'prix_unitaire',
        'montant_total',
        'station',
    ];
    public function vehicule()
    {
        return $this->belongsTo(Vehicule::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
