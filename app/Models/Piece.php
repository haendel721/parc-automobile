<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Piece extends Model
{
    use HasFactory;
    protected $fillable = [
        'nom',
        'prix',
        'quantite',
        'fournisseur_id',
        'user_id',
        'entretien_id',
        'vehicule_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relation avec le fournisseur
    public function fournisseur()
    {
        return $this->belongsTo(Fournisseur::class);
    }
    public function interventions()
    {
        return $this->belongsToMany(Intervention::class, 'intervention_piece', 'piece_id', 'intervention_id');
    }
}
