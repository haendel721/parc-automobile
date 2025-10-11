<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Intervention extends Model
{
    protected $fillable = [
        'entretien_id',
        'vehicule_id',
        'main_oeuvre',
        'kilometrage',
        'duree_immobilisation',
        'statut',
        'description',
        'user_id',
    ];
    public function entretien()
    {
        return $this->belongsTo(Entretien::class);
    }

    public function piece()
    {
        return $this->belongsTo(Piece::class);
    }
    public function vehicule()
    {
        return $this->belongsTo(Vehicule::class);
    }


    public function pieces()
    {
        return $this->belongsToMany(Piece::class, 'intervention_piece', 'intervention_id', 'piece_id');
    }
}
