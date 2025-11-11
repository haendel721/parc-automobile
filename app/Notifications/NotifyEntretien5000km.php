<?php

namespace App\Notifications;

use App\Models\Vehicule;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NotifyEntretien5000km extends Notification
{
    use Queueable;

    protected $vehicule;

    public function __construct($vehicule)
    {
        $this->vehicule = $vehicule;
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
            'kilometrage_total' => $this->vehicule->kilometrage_total,
            'diff_km_cumule' => $this->vehicule->diff_km_cumule,
            'message' => "Le véhicule {$this->vehicule->immatriculation} a atteint {$this->vehicule->diff_km_cumule} km depuis le dernier entretien. Un entretien est requis.",
            'url' => route('vehicules.show', $this->vehicule->id),
            'timestamp' => now()->toDateTimeString(),
        ];
    }

    public function toArray(object $notifiable): array
    {
        return [];
    }
}