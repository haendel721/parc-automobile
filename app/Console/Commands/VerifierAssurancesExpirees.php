<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Assurance;
use App\Notifications\AssuranceExpireNotification;
use Carbon\Carbon;


class VerifierAssurancesExpirees extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'assurances:verifier-expiration';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Vérifie les assurances expirées et notifie les utilisateurs concernés.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $today = Carbon::today();

        // 🔍 Récupérer les assurances expirées qui n’ont pas encore été notifiées
        $assurances = Assurance::whereDate('dateFin', '<', $today)
            ->where('notifie', false)
            ->get();

        if ($assurances->isEmpty()) {
            $this->info('✅ Aucune assurance expirée trouvée.');
            return;
        }

        foreach ($assurances as $assurance) {
            if ($assurance->user) {
                // 📨 Envoyer la notification
                $assurance->user->notify(new AssuranceExpireNotification($assurance));
                $this->info("Notification envoyée à {$assurance->user->name}");
            }

            // 🔄 Marquer comme notifiée
            $assurance->update(['notifie' => true]);
        }

        $this->info('✅ Vérification terminée.');
    }
}
