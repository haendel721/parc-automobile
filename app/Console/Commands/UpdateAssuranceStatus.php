<?php

namespace App\Console\Commands;

use App\Models\assurance;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Notifications\AssuranceExpireNotification;
use Illuminate\Support\Facades\Notification;
use Carbon\Carbon;

class UpdateAssuranceStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'assurances:update-status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Met à jour le statut des assurances expirées';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $today = Carbon::today()->toDateString();

        // 1️⃣ Récupérer toutes les assurances expirées (avant mise à jour)

        $assurancesExpirees = Assurance::where('dateFin', '<', $today)
            ->where('statut', '!=', 'expire')
            ->get();

        // 2️⃣ Mettre à jour le statut de toutes les assurances
        DB::table('assurances')
            ->where('dateFin', '<', $today)
            ->update(['statut' => 'expire']);

        DB::table('assurances')
            ->where('dateFin', '>', $today)
            ->update(['statut' => 'assure']);

        // 3️⃣ Envoyer une notification à chaque utilisateur concerné
        foreach ($assurancesExpirees as $assurance) {
            // Récupère l'utilisateur concerné
            $user = \App\Models\User::find($assurance->user_id);

            // Vérifie que l'utilisateur existe avant d'envoyer la notification
            if ($user) {
                Notification::send($user, new AssuranceExpireNotification($assurance));
            }
        }

        // ✅ Utiliser des messages seulement si on a une console
        if ($this->output) {
            $this->info('Statuts des assurances mis à jour avec succès.');
        }

        return 0;
    }
}
