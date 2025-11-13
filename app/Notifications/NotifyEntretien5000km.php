<?php

namespace App\Notifications;

use App\Models\Kilometrage;
use App\Models\Vehicule;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NotifyEntretien5000km extends Notification
{
    use Queueable;

    protected $vehicule;
    protected $kilometrageCumule;
    protected $kilometrage;
    public function __construct(Vehicule $vehicule, $kilometrageCumule, Kilometrage $kilometrage)
    {
        $this->vehicule = $vehicule;
        $this->kilometrageCumule = $kilometrageCumule;
        $this->kilometrage = $kilometrage;
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'type' => 'entretien_5000km',
            'vehicule_id' => $this->vehicule->id,
            'vehicule_immatriculation' => $this->vehicule->immatriculation,
            'kilometrage_total' => $this->vehicule->kilometrique,
            'kilometrage_cumule' => $this->kilometrageCumule,
            'kilometrage_releve_id' => $this->kilometrage->id,
            'message' => "Le véhicule {$this->vehicule->immatriculation} a atteint " .
                $this->kilometrage->cumul_avant_reinitialisation .
                " km. Il est recommandé d'envoyer une demande d'entretien.",
            'url' => route('vehicules.show', $this->vehicule->id),
            'timestamp' => now()->toDateTimeString(),
        ];
    }

    public function toArray(object $notifiable): array
    {
        return [];
    }
}
