<?php

namespace App\Services;

use App\Models\PleinCarburant;
use App\Models\Kilometrage;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PleinCarburantService
{
    public function getWeeklyConsumption(int $vehiculeId): array
    {
        try {
            // Récupérer les pleins et les kilométrages du véhicule
            $pleins = PleinCarburant::where('vehicule_id', $vehiculeId)
                        ->orderBy('date_plein')
                        ->get();

            $kilometrages = Kilometrage::where('vehicule_id', $vehiculeId)
                        ->orderBy('date_releve')
                        ->get();

            if ($pleins->isEmpty() || $kilometrages->isEmpty()) {
                return [];
            }

            // Grouper par semaine
            $weeksData = [];

            foreach ($pleins as $plein) {
                $week = Carbon::parse($plein->date_plein)->format('o-\WW');
                if (!isset($weeksData[$week])) {
                    $weeksData[$week] = [
                        'date' => $plein->date_plein,
                        'litres' => 0,
                        'km_start' => null,
                        'km_end' => null,
                    ];
                }
                $weeksData[$week]['litres'] += $plein->quantite;
            }

            // Associer les kilométrages aux semaines
            foreach ($kilometrages as $km) {
                $week = Carbon::parse($km->date_releve)->format('o-\WW');
                if (!isset($weeksData[$week])) {
                    $weeksData[$week] = [
                        'litres' => 0,
                        'km_start' => $km->kilometrage,
                        'km_end' => $km->kilometrage,
                    ];
                } else {
                    if ($weeksData[$week]['km_start'] === null || $km->kilometrage < $weeksData[$week]['km_start']) {
                        $weeksData[$week]['km_start'] = $km->kilometrage;
                    }
                    if ($weeksData[$week]['km_end'] === null || $km->kilometrage > $weeksData[$week]['km_end']) {
                        $weeksData[$week]['km_end'] = $km->kilometrage;
                    }
                }
            }

            // Calculer la consommation
            $result = [];
            foreach ($weeksData as $week => $data) {
                $km_parcourus = $data['km_end'] !== null && $data['km_start'] !== null
                                ? $data['km_end'] - $data['km_start']
                                : 0;
                
                // Éviter la division par zéro
                $consommation = $km_parcourus > 0
                                ? ($data['litres'] / $km_parcourus) * 100
                                : 0;

                $result[] = [
                    'week' => $this->formatWeekLabel($data['date']),
                    'litres' => round($data['litres'], 2),
                    'km' => $km_parcourus,
                    'consommation' => round($consommation, 2),
                ];
            }

            // Trier par semaine
            usort($result, function($a, $b) {
                return strcmp($a['week'], $b['week']);
            });

            return $result;

        } catch (\Exception $e) {
            // \Log::error("Erreur dans getWeeklyConsumption pour véhicule $vehiculeId: " . $e->getMessage());
            return [];
        }
    }

    private function formatWeekLabel($date)
    {
        $carbon = Carbon::parse($date);
        $week = $carbon->isoWeek();
        $year = $carbon->isoWeekYear();
        $monthName = $carbon->locale('fr')->monthName;

        return "Semaine {$week} - {$year} ({$monthName})";
    }
}