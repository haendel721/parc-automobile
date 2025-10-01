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
        return [
            'entretien_id' => $this->entretien->id,
            'vehicule'     => optional($this->entretien->vehicule)->immatriculation, 
            'type'         => $this->entretien->type,
            'user'         => optional($this->entretien->user)->name,
            'message'      => "Nouvelle demande d'entretien",
            // tu peux ajouter une URL vers la page détail
            'url'          => route('entretiens.show', $this->entretien->id),
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
