<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kilometrage extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicule_id',
        'kilometrage',
        'date_releve',
        'user_id',
        'type_releve',
        'kilometrage_parcouru',
        'difference',
        'cumul_avant_reinitialisation',
        'a_generer_entretien'
    ];

//    protected $casts = [
//         'date_releve' => 'date',
//         'a_generer_entretien' => 'boolean'
//     ];

    // Relation avec le véhicule
     public function vehicule()
    {
        return $this->belongsTo(Vehicule::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
