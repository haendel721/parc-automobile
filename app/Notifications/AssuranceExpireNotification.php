<?php

namespace App\Notifications;

use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AssuranceExpireNotification extends Notification
{
    use Queueable;
    protected $assurance;
    /**
     * Create a new notification instance.
     */
    public function __construct($assurance)
    {
        $this->assurance = $assurance;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $joursRestants = Carbon::now()->diffInDays($this->assurance->date_fin);

        return (new MailMessage)
            ->subject('Expiration prochaine de votre assurance')
            ->line("Votre assurance pour le véhicule ID {$this->assurance->vehicule_id} expire dans {$joursRestants} jours.")
            ->action('Renouveler maintenant', url('/assurances'))
            ->line('Merci de renouveler avant la date d’expiration.');
    }
    /**
     * Données enregistrées dans la table notifications
     */
    public function toDatabase($notifiable)
    {
        return [
            'type' => 'assurance_expiration',
            'assurance_id' => $this->assurance->id,
            'vehicule_id' => $this->assurance->vehicule_id,
            'vehicule' => optional($this->assurance->vehicule)->immatriculation,
            'date_fin' => Carbon::parse($this->assurance->date_fin)->format('d/m/Y'),
            'message' => "L’assurance du véhicule " . optional($this->assurance->vehicule)->immatriculation .
                " expire le " . Carbon::parse($this->assurance->date_fin)->format('d/m/Y') . ".",
            'url' => route('assurances.show', $this->assurance->id),
        ];
    }
    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'vehicule_id' => $this->assurance->vehicule_id,
            'message' => 'Votre assurance expire dans 7 jours !',
            'date_fin' => $this->assurance->date_fin,
        ];
    }
}
