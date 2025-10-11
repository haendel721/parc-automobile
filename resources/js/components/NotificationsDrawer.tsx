import { useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Button } from '@headlessui/react';
import { CircleX, Eye } from 'lucide-react';
import { route } from 'ziggy-js';

type Notification = {
    id: string;
    read_at: string | null;
    created_at: string;
    data: {
        vehicule?: string;
        message?: string;
        user?: string;
        url?: string;
    };
};

export default function NotificationsDrawer() {
    const { notifications: serverNotifications, unread_notifications_count } = usePage().props as any;

    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all');

    useEffect(() => {
        setNotifications(serverNotifications ? JSON.parse(JSON.stringify(serverNotifications)) : []);
    }, [serverNotifications]);

    const close = () => setIsOpen(false);
    const open = () => setIsOpen(true);

    const getFilteredNotifications = () => {
        if (filter === 'read') return notifications.filter((n) => n.read_at !== null);
        if (filter === 'unread') return notifications.filter((n) => n.read_at === null);
        return notifications;
    };

    const filteredNotifications = getFilteredNotifications();

    const markAsRead = (id?: string) => {
        router.post(
            route('admin.notifications.markread'),
            { id },
            {
                onSuccess: () => {
                    if (id) {
                        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)));
                    } else {
                        setNotifications((prev) => prev.map((n) => ({ ...n, read_at: new Date().toISOString() })));
                    }
                },
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    const deleteNotification = (id: string) => {
        if (confirm('Voulez-vous vraiment supprimer cette notification ?')) {
            router.delete(route('admin.notifications.destroy', id), {
                onSuccess: () => {
                    setNotifications((prev) => prev.filter((n) => n.id !== id));
                },
            });
        }
    };

    return (
        <>
            {/* 🔔 Bouton déclencheur */}
            <button onClick={open} aria-label="Afficher notifications" className="relative inline-flex items-center rounded p-2 hover:bg-gray-100">
                🔔
                {unread_notifications_count > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center rounded-full bg-red-600 px-1 text-xs leading-none font-medium text-white">
                        {unread_notifications_count}
                    </span>
                )}
            </button>

            {/* 🧭 Drawer (panneau latéral) */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex" aria-modal="true" role="dialog">
                    <aside className="relative ml-auto w-full max-w-sm transform bg-black text-white shadow-xl transition-transform duration-300 ease-in-out">
                        <div className="flex items-center justify-between border-b p-4">
                            <h3 className="text-lg font-semibold">Notifications</h3>
                            <div className="flex items-center gap-2">
                                <button onClick={() => markAsRead()} className="rounded border px-2 py-1 text-sm">
                                    Tout marquer lu
                                </button>
                                <button onClick={close} aria-label="Fermer" className="px-2 text-xl">
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* 🔘 Filtres */}
                        <div className="grid grid-cols-3 gap-2 border-b p-4">
                            <Button onClick={() => setFilter('read')} className={`w-full border ${filter === 'read' ? 'bg-gray-700' : 'bg-gray-900'}`}>
                                Lues
                            </Button>
                            <Button onClick={() => setFilter('unread')} className={`w-full border ${filter === 'unread' ? 'bg-gray-700' : 'bg-gray-900'}`}>
                                Non lues
                            </Button>
                            <Button onClick={() => setFilter('all')} className={`w-full border ${filter === 'all' ? 'bg-gray-700' : 'bg-gray-900'}`}>
                                Tout
                            </Button>
                        </div>

                        {/* 📜 Liste des notifications */}
                        <div className="h-full overflow-y-auto p-4">
                            {filteredNotifications.length === 0 ? (
                                <div className="mt-6 text-center text-sm text-gray-400">Aucune notification.</div>
                            ) : (
                                <ul className="space-y-3">
                                    {filteredNotifications.map((n) => (
                                        <li
                                            key={n.id}
                                            className={`rounded border p-3 transition ${
                                                n.read_at ? 'bg-gray-900' : 'bg-gray-800 border-gray-600'
                                            }`}
                                        >
                                            <div className="flex justify-between">
                                                <div>
                                                    <div className="font-medium">{n.data?.vehicule ?? 'Véhicule inconnu'}</div>
                                                    <div className="text-sm text-gray-400">{n.data?.message ?? n.type}</div>
                                                    <div className="mt-1 text-xs text-gray-500">
                                                        Par {n.data?.user ?? 'Utilisateur'} — {new Date(n.created_at).toLocaleString()}
                                                    </div>
                                                </div>

                                                <div className="ml-3 flex flex-col items-end gap-2">
                                                    {!n.read_at && (
                                                        <button onClick={() => markAsRead(n.id)} className="rounded border px-2 py-1 text-xs">
                                                            Marquer lu
                                                        </button>
                                                    )}
                                                    {n.data?.url && (
                                                        <a
                                                            href={n.data.url}
                                                            className="text-xs underline"
                                                            onClick={() => {
                                                                close();
                                                                markAsRead(n.id);
                                                            }}
                                                        >
                                                            <Eye size={14} />
                                                        </a>
                                                    )}
                                                    <Button onClick={() => deleteNotification(n.id)} className="text-xs text-red-500">
                                                        <CircleX size={14} />
                                                    </Button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </aside>
                </div>
            )}
        </>
    );
}
