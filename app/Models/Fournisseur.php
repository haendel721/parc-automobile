<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Fournisseur extends Model
{
    protected $fillable = [
        'nom',
        'type',
        'addresse',
        'phone',
        'email',
        'siteWeb',
    ];

    public function entretiens()
    {
        return $this->hasMany(Entretien::class);
    }
}
