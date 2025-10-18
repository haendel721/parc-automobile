<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EntretienKilometrageNotification extends Notification
{
    use Queueable;
    protected $vehicule;
    /**
     * Create a new notification instance.
     */
    public function __construct($vehicule)
    {
        $this->vehicule = $vehicule;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'type' => 'kilometrage',
            'vehicule_id' => $this->vehicule->id,
            'vehicule' => $this->vehicule->immatriculation,
            'kilometrage' => $this->vehicule->kilometrique,
            'message' => "Le véhicule {$this->vehicule->immatriculation} a atteint {$this->vehicule->kilometrique} km. 
                          Un entretien est recommandé.",
            'url' => route('vehicules.index', $this->vehicule->id), // lien vers la page du véhicule
        ];
    }
    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
     public function toArray($notifiable)
    {
        return [
            'message' => "Le véhicule {$this->vehicule->immatricultion} a atteint {$this->vehicule->kilometrique} km. 
                          Un entretien est recommandé.",
            'vehicule_id' => $this->vehicule->id,
        ];
    }
}
