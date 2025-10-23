import { router, usePage } from '@inertiajs/react';
import { CircleX, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
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
                <div onClick={close} className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm" aria-modal="true" role="dialog">
                    <aside onClick={(e)=>e.stopPropagation()} className="relative h-full max-h-screen flex flex-col transform rounded-l-3xl bg-white text-gray-900 shadow-2xl transition-transform duration-300 ease-in-out">
                        {/* En-tête */}
                        <div className="flex items-center justify-between border-b border-gray-200 p-5">
                            <h3 className="text-lg font-semibold">Notifications</h3>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => markAsRead()}
                                    className="rounded-lg border border-gray-300 px-3 py-1 text-sm font-medium transition hover:bg-gray-100"
                                >
                                    Tout marquer lu
                                </button>
                                <button onClick={close} aria-label="Fermer" className="text-xl transition hover:text-red-500">
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Filtres */}
                        <div className="grid grid-cols-3 gap-2 border-b border-gray-200 p-4">
                            <button
                                onClick={() => setFilter('read')}
                                className={`w-full rounded-lg py-2 text-sm font-medium transition ${
                                    filter === 'read' ? 'bg-gray-200' : 'bg-gray-50 hover:bg-gray-100'
                                }`}
                            >
                                Lues
                            </button>
                            <button
                                onClick={() => setFilter('unread')}
                                className={`w-full rounded-lg py-2 text-sm font-medium transition ${
                                    filter === 'unread' ? 'bg-gray-200' : 'bg-gray-50 hover:bg-gray-100'
                                }`}
                            >
                                Non lues
                            </button>
                            <button
                                onClick={() => setFilter('all')}
                                className={`w-full rounded-lg py-2 text-sm font-medium transition ${
                                    filter === 'all' ? 'bg-gray-200' : 'bg-gray-50 hover:bg-gray-100'
                                }`}
                            >
                                Tout
                            </button>
                        </div>

                        {/* Liste des notifications */}
                        <div className="h-full space-y-3 overflow-y-auto p-4">
                            {filteredNotifications.length === 0 ? (
                                <div className="mt-6 text-center text-sm text-gray-400">Aucune notification.</div>
                            ) : (
                                <ul className="space-y-3">
                                    {filteredNotifications.map((n) => (
                                        <li
                                            key={n.id}
                                            className={`flex justify-between rounded-2xl border p-4 shadow-sm transition ${
                                                n.read_at ? 'border-gray-200 bg-gray-50' : 'border-blue-200 bg-blue-50'
                                            } hover:shadow-md`}
                                        >
                                            <div>
                                                <div className="font-medium">{n.data?.vehicule ?? 'Véhicule inconnu'}</div>
                                                <div className="text-sm text-gray-500">{n.data?.message ?? n.type}</div>
                                                <div className="mt-1 text-xs text-gray-400">
                                                   {new Date(n.created_at).toLocaleString()}
                                                </div>
                                            </div>

                                            <div className="ml-3 flex flex-col items-end gap-2">
                                                {!n.read_at && (
                                                    <button
                                                        onClick={() => markAsRead(n.id)}
                                                        className="rounded-lg border px-2 py-1 text-xs transition hover:bg-gray-100"
                                                    >
                                                        Marquer lu
                                                    </button>
                                                )}
                                                {n.data?.url && (
                                                    <a
                                                        href={n.data.url}
                                                        className="text-xs text-blue-600 underline hover:text-blue-800"
                                                        onClick={() => {
                                                            close();
                                                            markAsRead(n.id);
                                                        }}
                                                    >
                                                        <Eye size={14} />
                                                    </a>
                                                )}
                                                <button onClick={() => deleteNotification(n.id)} className="text-xs text-red-500 hover:text-red-700">
                                                    <CircleX size={14} />
                                                </button>
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
