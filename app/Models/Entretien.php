<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Entretien extends Model
{
    protected $fillable = [
        'vehicule_id',
        'fournisseur_id',
        'user_id',
        'type',
        'cout',
        'piece_remplacee',
        'probleme',
        'recommandation',
        'prochaine_visite',
        'description',
        'dernier_visite',
        'derniere_vidange',
    ];

    public function vehicule() {
        return $this->belongsTo(Vehicule::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function fournisseur() {
        return $this->belongsTo(Fournisseur::class);
    }
}
