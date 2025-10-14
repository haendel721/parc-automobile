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
        'statut',
        'mecanicien_id',
    ];
     // ⚡ Dit à Laravel que 'prochaine_visite' est une date
    protected $casts = [
        'prochaine_visite' => 'datetime',
        'dernier_visite' => 'datetime',
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
    public function interventions()
{
    return $this->hasMany(Intervention::class);
}
}
