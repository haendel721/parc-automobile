<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
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

        DB::table('assurances')
            ->where('dateFin', '<', $today)
            ->update(['statut' => 'expire']);

        DB::table('assurances')
            ->where('dateFin', '>=', $today)
            ->update(['statut' => 'assure']);

        $this->info('Statut des assurances mis à jour avec succès.');
    }
}
