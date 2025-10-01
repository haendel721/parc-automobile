import React from 'react';
import { Head, usePage ,  router} from '@inertiajs/react';
import { route } from 'ziggy-js';


export default function Notifications() {
  // usePage().props contient les données passées depuis Laravel (Inertia)
  const { notifications, unread_count } = usePage().props as any;

  const markAsRead = (id?: string) => {
    // envoi POST pour marquer comme lu (id = spécifique, ou undefined pour tout)
    router.post(route('admin.notifications.markread'), { id });
  };

  return (
    <div className="p-6">
      <Head title="Notifications" />
      <h1 className="text-2xl font-bold mb-4">Notifications des entretiens dans Admin</h1>

      <div className="mb-4">
        <button
          onClick={() => markAsRead(undefined)}
          className="px-3 py-1 border rounded"
        >
          Marquer toutes comme lues ({unread_count})
        </button>
      </div>

      <ul className="space-y-3">
        {notifications.length === 0 && <li>Aucune notification.</li>}
        {notifications.map((n: any) => (
          <li key={n.id} className={`p-3 border rounded ${n.read_at ? 'bg-black' : 'bg-yellow-500'}`}>
            <div className="flex justify-between items-start">
              <div>
                <strong>{n.data.vehicule ?? 'Véhicule inconnu'}</strong>
                <div>{n.data.message ?? 'Nouvelle notification'}</div>
                <div className="text-sm text-gray-600">Demandé par: {n.data.user}</div>
                <div className="text-sm text-gray-500">Reçu: {new Date(n.created_at).toLocaleString()}</div>
              </div>

              <div className="ml-4">
                {!n.read_at && (
                  <button onClick={() => markAsRead(n.id)} className="px-2 py-1 text-white border rounded">
                    Marquer comme lue
                  </button>
                )}
                <a href={n.data.url} className="block mt-2 text-sm underline">Voir</a>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
