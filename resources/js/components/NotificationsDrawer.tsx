import { Button } from '@headlessui/react';
import { router, usePage } from '@inertiajs/react';
import { CircleX, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

export default function NotificationsDrawer() {
    // notifications passées globalement via HandleInertiaRequests.php
    const { notifications: serverNotifications, unread_notifications_count } = usePage().props as any;

    // on garde une copy locale pour enlever les notifs quand on marque comme lues,
    // sans forcer un reload de page (optimiste)
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all');

    const notification_data = notifications.map((n) => n.data);
    console.log('Notification data :', notification_data);

    const getFilteredNotifications = () => {
        if (filter == 'read') {
            return notifications.filter((n) => n.read_at !== null);
        }
        if (filter == 'unread') {
            return notifications.filter((n) => n.read_at === null);
        }
        return notifications; // tout
    };

    const filteredNotifications = getFilteredNotifications();

    useEffect(() => {
        console.log('serverNotifications (from Inertia):', serverNotifications);
        // convert Laravel collection -> array JS (si c'est un array déjà, ok)
        setNotifications(serverNotifications ? JSON.parse(JSON.stringify(serverNotifications)) : []);
    }, [serverNotifications]);

    const close = () => setIsOpen(false);
    const open = () => setIsOpen(true);

    const markAsRead = (id?: string) => {
        router.post(
            route('admin.notifications.markread'),
            { id },
            {
                onSuccess: () => {
                    console.log('markAsRead onSuccess — before local update', notifications);
                    if (id) {
                        // On garde la notif, mais on la passe en "lue"
                        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)));
                    } else {
                        // On met toutes en "lues"
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
                    // Mettre à jour l'état local en retirant la notif
                    setNotifications((prev) => prev.filter((n) => n.id !== id));
                },
            });
        }
    };
    return (
        <>
            {/* Bouton déclencheur : affiché où tu veux dans le layout */}
            <button onClick={open} aria-label="Afficher notifications" className="relative inline-flex items-center rounded p-2 hover:bg-gray-100">
                🔔
                {unread_notifications_count > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center rounded-full bg-red-600 px-1 text-xs leading-none font-medium text-white">
                        {unread_notifications_count}
                    </span>
                )}
            </button>

            {/* Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex" aria-modal="true" role="dialog">
                    {/* Drawer panel (glisse depuis la droite) */}
                    <aside
                        className={`relative ml-auto w-full max-w-sm transform bg-black shadow-xl transition-transform duration-300 ease-in-out`}
                        role="complementary"
                    >
                        <div className="flex items-center justify-between border-b p-4">
                            <h3 className="text-lg font-semibold">Notifications</h3>
                            <div className="flex items-center gap-2">
                                <button onClick={() => markAsRead(undefined)} className="rounded border px-2 py-1 text-sm">
                                    Tout marquer lu
                                </button>
                                <button onClick={close} aria-label="Close" className="px-2 text-xl">
                                    ✕
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 border-b p-4">
                            <Button
                                onClick={() => setFilter('read')}
                                className={`w-full border ${filter === 'read' ? 'bg-gray-700' : 'bg-black-500 text-white'}`}
                            >
                                Lues
                            </Button>
                            <Button
                                onClick={() => setFilter('unread')}
                                className={`w-full border ${filter === 'unread' ? 'bg-gray-700' : 'bg-black-500 text-white'}`}
                            >
                                Non lues
                            </Button>
                            <Button
                                onClick={() => setFilter('all')}
                                className={`w-full border ${filter === 'all' ? 'bg-gray-700' : 'bg-black-500 text-white'}`}
                            >
                                Tout
                            </Button>
                        </div>

                        <div className="h-full overflow-y-auto p-4">
                            {filteredNotifications.length === 0 ? (
                                <div className="mt-6 text-center text-sm text-gray-500">Aucune notification.</div>
                            ) : (
                                <ul className="space-y-3">
                                    {filteredNotifications.map((n: any) => (
                                        <li key={n.id} className={`rounded border bg-gray-950 p-3 ${n.read_at ? 'bg-neutral-950' : 'bg-gray-50'}`}>
                                            <div className="flex justify-between">
                                                <div>
                                                    <div className="font-medium">{n.data?.vehicule ?? 'Véhicule inconnu'}</div>
                                                    <div className="text-sm text-gray-700">{n.data?.message ?? n.type}</div>
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
                                                            onClick={close} /* fermer drawer si on ouvre un detail */
                                                        >
                                                            <Eye />
                                                        </a>
                                                    )}

                                                    <Button onClick={() => deleteNotification(n.id)} className="text-xs text-red-500">
                                                        <CircleX />
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
