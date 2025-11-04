import { router, usePage } from '@inertiajs/react';
import { CircleX, Eye, Bell, X, CheckCheck } from 'lucide-react';
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
            {/* 🔔 Bouton déclencheur modernisé */}
            <button 
                onClick={open} 
                aria-label="Afficher notifications" 
                className="relative inline-flex items-center justify-center p-2 rounded-xl bg-gray-800 hover:bg-gray-700 transition-all duration-200 group border border-gray-700"
            >
                <Bell className="w-5 h-5 text-gray-300 group-hover:text-white" />
                {unread_notifications_count > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-5 h-5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-xs font-semibold text-white border-2 border-gray-900">
                        {unread_notifications_count > 99 ? '99+' : unread_notifications_count}
                    </span>
                )}
            </button>

            {/* 🧭 Drawer modernisé */}
            {isOpen && (
                <div 
                    onClick={close} 
                    className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-md"
                    aria-modal="true" 
                    role="dialog"
                >
                    <aside 
                        onClick={(e) => e.stopPropagation()} 
                        className="relative h-full w-full max-w-md flex flex-col bg-gray-900 text-white shadow-2xl border-l border-gray-700"
                    >
                        {/* En-tête modernisé */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gray-800/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                                    <Bell className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">Notifications</h3>
                                    <p className="text-sm text-gray-400">
                                        {unread_notifications_count} non lue{unread_notifications_count !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => markAsRead()}
                                    className="flex items-center gap-2 rounded-xl bg-gray-700 hover:bg-gray-600 px-3 py-2 text-sm font-medium transition-all duration-200 border border-gray-600"
                                >
                                    <CheckCheck className="w-4 h-4" />
                                    <span className="hidden sm:inline">Tout lire</span>
                                </button>
                                <button 
                                    onClick={close} 
                                    aria-label="Fermer" 
                                    className="p-2 rounded-xl bg-gray-700 hover:bg-gray-600 transition-all duration-200 border border-gray-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Filtres modernisés */}
                        <div className="flex gap-2 p-4 border-b border-gray-700 bg-gray-800/30">
                            {[
                                { key: 'all' as const, label: 'Toutes' },
                                { key: 'unread' as const, label: 'Non lues' },
                                { key: 'read' as const, label: 'Lues' }
                            ].map(({ key, label }) => (
                                <button
                                    key={key}
                                    onClick={() => setFilter(key)}
                                    className={`flex-1 rounded-xl py-3 text-sm font-medium transition-all duration-200 ${
                                        filter === key 
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* Liste des notifications modernisée */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {filteredNotifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                                    <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4 border border-gray-700">
                                        <Bell className="w-8 h-8 text-gray-500" />
                                    </div>
                                    <p className="text-gray-400 font-medium">Aucune notification</p>
                                    <p className="text-gray-500 text-sm mt-2">
                                        {filter === 'all' 
                                            ? "Vous n'avez aucune notification" 
                                            : `Aucune notification ${filter === 'read' ? 'lue' : 'non lue'}`
                                        }
                                    </p>
                                </div>
                            ) : (
                                <ul className="p-4 space-y-3">
                                    {filteredNotifications.map((n) => (
                                        <li
                                            key={n.id}
                                            className={`relative rounded-2xl p-4 transition-all duration-200 border backdrop-blur-sm ${
                                                n.read_at 
                                                    ? 'bg-gray-800/50 border-gray-700 hover:border-gray-600' 
                                                    : 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30 hover:border-blue-400/50'
                                            } hover:shadow-xl hover:scale-[1.02]`}
                                        >
                                            {!n.read_at && (
                                                <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                                            )}
                                            
                                            <div className="pr-8">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-white text-sm">
                                                            {n.data?.vehicule ?? 'Véhicule inconnu'}
                                                        </h4>
                                                        <p className="text-gray-300 text-sm mt-1 leading-relaxed">
                                                            {n.data?.message ?? n.type}
                                                        </p>
                                                        <div className="flex items-center justify-between mt-3">
                                                            <span className="text-xs text-gray-400">
                                                                {new Date(n.created_at).toLocaleString('fr-FR', {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-700/50">
                                                    {!n.read_at && (
                                                        <button
                                                            onClick={() => markAsRead(n.id)}
                                                            className="flex items-center gap-1 rounded-lg bg-gray-700 hover:bg-gray-600 px-3 py-1.5 text-xs transition-all duration-200 border border-gray-600"
                                                        >
                                                            <CheckCheck className="w-3 h-3" />
                                                            Marquer lu
                                                        </button>
                                                    )}
                                                    {n.data?.url && (
                                                        <a
                                                            href={n.data.url}
                                                            className="flex items-center gap-1 rounded-lg bg-blue-600/20 hover:bg-blue-500/30 px-3 py-1.5 text-xs text-blue-300 hover:text-blue-200 transition-all duration-200 border border-blue-500/30"
                                                            onClick={() => {
                                                                close();
                                                                markAsRead(n.id);
                                                            }}
                                                        >
                                                            <Eye className="w-3 h-3" />
                                                            Voir
                                                        </a>
                                                    )}
                                                    <button 
                                                        onClick={() => deleteNotification(n.id)} 
                                                        className="flex items-center gap-1 rounded-lg bg-red-600/20 hover:bg-red-500/30 px-3 py-1.5 text-xs text-red-300 hover:text-red-200 transition-all duration-200 border border-red-500/30 ml-auto"
                                                    >
                                                        <CircleX className="w-3 h-3" />
                                                        Supprimer
                                                    </button>
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

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(75, 85, 99, 0.3);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(139, 92, 246, 0.5);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(139, 92, 246, 0.7);
                }
            `}</style>
        </>
    );
}