<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EntretienValidated extends Model
{
    protected $fillable = [
        'user_id',
        'entretien_id',
        'vehicule_id',
        'mecanicien_id',
        'Type_entretien',
        'date_prevue',
    ];
    protected $casts = [
        'date_prevue' => 'datetime',
    ];
}
