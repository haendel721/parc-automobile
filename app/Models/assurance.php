<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class assurance extends Model
{
    protected $fillable = [
        'vehicule_id',
        'NomCompagnie',
        'NumContrat',
        'cout',
        'dateDebut',
        'dateFin'
    ];

    /**
     * Une assurance appartient à un véhicule.
     */
    public function vehicule()
    {
        return $this->belongsTo(Vehicule::class, 'vehicule_id');
    }
}
