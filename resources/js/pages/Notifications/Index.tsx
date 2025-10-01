import React from "react";
import AppLayout from "@/layouts/app-layout"; // ton layout principal
import { Head } from "@inertiajs/react";

type Notification = {
  id: string;
  type: string;
  data: any;
  read_at: string | null;
  created_at: string;
};

interface Props {
  notifications: Notification[];
}

export default function Index({ notifications }: Props) {
  return (
    <AppLayout>
      <Head title="Mes Notifications" />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Mes Notifications</h1>

        {notifications.length === 0 ? (
          <p>Aucune notification reçue.</p>
        ) : (
          <ul className="space-y-3">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`p-4 rounded-lg shadow ${
                  notification.read_at ? "bg-gray-100" : "bg-blue-100"
                }`}
              >
                <p>
                  <strong>Type :</strong> {notification.type}
                </p>
                <p>
                  <strong>Détails :</strong>{" "}
                  {JSON.stringify(notification.data)}
                </p>
                <p className="text-sm text-gray-500">
                  Reçu le {new Date(notification.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppLayout>
  );
}
