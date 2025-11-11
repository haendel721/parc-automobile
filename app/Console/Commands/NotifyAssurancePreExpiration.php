<?php

namespace App\Console\Commands;

use App\Models\Assurance;
use Illuminate\Console\Command;
use App\Notifications\AssurancePreExpirationNotification;
use Illuminate\Support\Facades\Notification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;

class NotifyAssurancePreExpiration extends Command
{
    protected $signature = 'assurances:notify-preexpiration';
    protected $description = 'Envoie des notifications pour les assurances proches de l’expiration';

    public function handle()
    {
        $joursAvant = [14, 10, 6, 2];
        $aujourdHui = Carbon::today();
        $notificationsEnvoyees = 0;

        $assurances = Assurance::where('dateFin', '>=', $aujourdHui->toDateString())->get();

        foreach ($assurances as $assurance) {
            $dateFin = Carbon::parse($assurance->dateFin)->startOfDay();

            foreach ($joursAvant as $jours) {
                $dateNotification = $dateFin->copy()->subDays($jours);

                if ($aujourdHui->isSameDay($dateNotification)) {
                    // Clé de cache unique pour aujourd'hui
                    $cacheKey = "assurance_notif_{$assurance->id}_{$jours}_{$aujourdHui->format('Ymd')}";

                    if (!Cache::has($cacheKey)) {
                        $user = \App\Models\User::find($assurance->user_id);
                        if ($user) {
                            Notification::send($user, new AssurancePreExpirationNotification($assurance, $jours));
                            
                            // Stocker en cache pour 24h
                            Cache::put($cacheKey, true, now()->addHours(24));
                            
                            $notificationsEnvoyees++;
                            
                            if ($this->output) {
                                $this->info("Notification envoyée pour l'assurance {$assurance->id} (expire dans {$jours} jours)");
                            }
                        }
                    } else {
                        if ($this->output) {
                            $this->line("Notification déjà envoyée aujourd'hui pour l'assurance {$assurance->id} (expire dans {$jours} jours)");
                        }
                    }
                }
            }
        }

        if ($this->output) {
            if ($notificationsEnvoyees > 0) {
                $this->info("{$notificationsEnvoyees} notification(s) envoyée(s) avec succès.");
            } else {
                $this->info('Aucune nouvelle notification à envoyer.');
            }
        }
    }
}