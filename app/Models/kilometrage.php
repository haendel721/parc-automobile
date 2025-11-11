<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kilometrage extends Model
{
    protected $fillable = [
        'vehicule_id',
        'date_releve',
        'kilometrage',
        'type_releve',
    ];

    protected $casts = [
        'date_releve' => 'datetime',
        'kilometrage' => 'integer',
    ];

    public function vehicule()
    {
        return $this->belongsTo(Vehicule::class);
    }

    protected static function booted()
    {
        static::created(function ($model) {
            $model->declencherRecalculVehicule();
        });
        // Recalculer seulement si le kilométrage a changé
        static::updated(function ($model) {
            if ($model->isDirty('kilometrage')) {
                $model->declencherRecalculVehicule();
            }
        });

        static::deleted(function ($model) {
            $model->declencherRecalculVehicule();
        });
    }

    protected function declencherRecalculVehicule()
    {
        $vehicule = $this->vehicule;
        if ($vehicule) {
            $vehicule->calculerEtMettreAJourKilometrage(true);
        }
    }
}
