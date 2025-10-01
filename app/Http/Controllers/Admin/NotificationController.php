<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        // récupérer toutes les notifications
        $notifications = $user->notifications()->orderBy('created_at', 'desc')->get();
        // envoyer à la page Inertia
        return Inertia::render('Entretiens/Notifications', [
            'notifications' => $notifications,
            'unread_count' => $user->unreadNotifications()->count(),
        ]);
    }
    // marquer une notification comme lue (si id null => marquer tout comme lu)

    /**  ↓
     * Récupérer l'utilisateur connecté
     *   ↓
     * Récupérer l'ID depuis la requête
     *   ↓
     * ID fourni ? → OUI → Chercher la notification spécifique
     *   ↓                           ↓
     *   NON                        Trouvée ? → OUI → Marquer comme lue → Succès
     *   ↓                           ↓
     * Marquer toutes               NON → Erreur "Introuvable"
     * les non-lues  ↓
     * Succès "Toutes marquées"
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\RedirectResponse
     */         
    public function markAsRead(Request $request)
    {
        $user = auth()->user();

        // Récupère l'ID de la notification depuis la requête HTTP
        $id = $request->input('id');

        if ($id) {
            // Cherche la notification spécifique parmi celles de l'utilisateur
            $notification = $user->notifications()->where('id', $id)->first();

            // Si trouvée : appelle markAsRead() sur cette notification
            if ($notification) {
                $notification->markAsRead();
                return back()->with('success', 'Notification marquée comme lue.');
            }
            // Si non trouvée : retourne un message d'erreur
            return back()->with('error', 'Notification introuvable.');
        }
        
        // Si aucun ID n'est fourni, marque toutes les notifications non-lues comme lues
        $user->unreadNotifications->markAsRead();
        return back()->with('success', 'Toutes les notifications marquées comme lues.');
    }
    public function markAllAsRead()
    {
        // Récupère l'utilisateur connecté
        $user = Auth::user();

        // Marque toutes les notifications comme lues
        $user->unreadNotifications->markAsRead();

        return response()->json(['success' => true, 'message' => 'Toutes les notifications ont été marquées comme lues']);
    }
    public function destroy ($id){
        $notification = auth()->user()->notifications()->findOrFail($id);
        $notification->delete();
        return back()->with('succes','Notification supprimée avec succès.');
    }
}
