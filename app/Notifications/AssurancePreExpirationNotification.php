<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use App\Models\assurance;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Carbon\Carbon;
use Illuminate\Notifications\Notification;

class AssurancePreExpirationNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    protected $joursRestants;
    protected $assurance;

    public function __construct(assurance $assurance, $joursRestants)
    {
        $this->assurance = $assurance;
        $this->joursRestants = $joursRestants;
    }
    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line('The introduction to the notification.')
            ->action('Notification Action', url('/'))
            ->line('Thank you for using our application!');
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
            'type' => 'assurance_pre_expiration',
            'assurance_id' => $this->assurance->id,
            'vehicule_id' => $this->assurance->vehicule_id,
            'vehicule' => optional($this->assurance->vehicule)->immatriculation,
            'date_fin' => Carbon::parse($this->assurance->date_fin)->format('d/m/Y'),
            'message' => "L'assurance du véhicule " . optional($this->assurance->vehicule)->immatriculation .
                " expire dans {$this->joursRestants} jours.",
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
            //
        ];
    }
}
