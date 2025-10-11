<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Models\Entretien;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EntretienDemandeNotification extends Notification
{
    use Queueable;

    protected $entretien;

    /**
     * Create a new notification instance.
     */
    public function __construct(Entretien $entretien)
    {
        $this->entretien = $entretien;
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

    /**
     * Get the mail representation of the notification.
     */
    public function toDatabase($notifiable)
    {
        $entretien = $this->entretien;
        $userRole = $notifiable->role; // rôle de celui qui reçoit la notification
        $message = '';

        if ($userRole === 'admin') {
            // Message pour l'admin : nouvelle demande de l'utilisateur
            $message = "Nouvelle demande d'entretien ";
        } elseif ($userRole === 'mecanicien') {
            // Message pour le mécanicien : demande validée
            $message = "Entretien prévu pour : " . optional($entretien->user)->name;
        } else {
            // Message pour l'utilisateur : entretien prévu
            $message = "Entretien prévu pour votre véhicule : " . optional($entretien->vehicule)->immatriculation;
        }

        return [
            'entretien_id' => $entretien->id,
            'vehicule'     => optional($entretien->vehicule)->immatriculation,
            'type'         => $entretien->type,
            'user'         => optional($entretien->user)->name,
            'message'      => $message,
            'url'          => route('entretiens.show', $entretien->id),
        ];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line('The introduction to the notification.')
            ->action('Notification Action', url('/'))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
