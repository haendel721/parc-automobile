import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Activity, ArrowLeft, BatteryFull, CalendarDays, Car, FileText, Fuel, Gauge, Hash, Palette, SquarePen, Truck, User } from 'lucide-react';
import { route } from 'ziggy-js';

type Vehicule = {
    id: number;
    immatriculation: string;
    marque_id: number;
    model: string;
    typeVehicule_id: number;
    couleur: string;
    carburant_id: number;
    numSerie: string;
    anneeFabrication: number;
    dateAcquisition: string;
    photo: string;
    user_id: number;
    kilometrique: number;
    capacite_reservoir: number;
};

type PageProps = {
    vehicule: Vehicule;
    user: { id: number; name: string };
    marques: { id: number; nom: string }[];
    carburants: { id: number; type: string }[];
    typesVehicules: { id: number; nom: string };
    userConnecter: { role: string };
    flash: { message?: string };
};

export default function Show() {
    const { vehicule, user, marques,  carburants, typesVehicules, userConnecter, flash } = usePage<PageProps>().props;

    const getVehiculeIcon = () => {
        const typeVehiculeNom = typesVehicules?.nom?.toLowerCase() || '';
        const carburantType = carburants?.type?.toLowerCase() || '';

        if (typeVehiculeNom.includes('camion')) return <Truck className="h-10 w-10 text-emerald-400" />;
        if (typeVehiculeNom.includes('voiture')) return <Car className="h-10 w-10 text-blue-400" />;
        if (carburantType.includes('électrique')) return <BatteryFull className="h-10 w-10 text-green-400" />;
        if (carburantType.includes('essence') || carburantType.includes('diesel')) return <Fuel className="h-10 w-10 text-amber-400" />;
        return <Activity className="h-10 w-10 text-gray-400" />;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Accueil', href: '/dashboard' },
                { title: 'Véhicules', href: '/vehicules' },
                { title: `${vehicule.immatriculation}`, href: `/vehicules/${vehicule.id}/edit` },
            ]}
        >
            <Head title={`Véhicule ${vehicule.model}`} />

            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 lg:p-8">
                {/* Notification */}
                {flash.message && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                        <Alert className="mb-6 border-emerald-500/20 bg-emerald-500/10 backdrop-blur-sm">
                            <AlertTitle className="text-emerald-400">Succès</AlertTitle>
                            <AlertDescription className="text-emerald-200">{flash.message}</AlertDescription>
                        </Alert>
                    </motion.div>
                )}

                {/* Bouton retour */}
                <div className="mb-8">
                    <Link href={route('vehicules.index')}>
                        <Button
                            variant="outline"
                            className="group flex items-center gap-2 border-gray-700 bg-gray-800/50 text-gray-300 backdrop-blur-sm transition-all duration-300 hover:border-blue-500 hover:bg-blue-500/10 hover:text-blue-400"
                        >
                            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                            Retour à la liste
                        </Button>
                    </Link>
                </div>

                {/* Carte principale */}
                <motion.div
                    className="overflow-hidden rounded-2xl border border-gray-700/50 bg-gray-800/30 shadow-2xl backdrop-blur-sm"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    {/* En-tête avec image */}
                    <div className="relative">
                        <div className="relative flex h-72 items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
                            <img
                                src={vehicule.photo ? `/storage/${vehicule.photo}` : `/storage/photos_voitures/automoblie.png`}
                                alt={vehicule.model}
                                className="h-48 w-auto object-contain drop-shadow-2xl transition-all duration-500 hover:scale-105"
                            />
                            <div className="absolute top-6 left-6 rounded-2xl bg-gray-900/80 p-3 backdrop-blur-sm">{getVehiculeIcon()}</div>
                            <div className="absolute right-6 bottom-6 rounded-2xl bg-gray-900/80 px-4 py-2 backdrop-blur-sm">
                                <span className="text-sm font-semibold tracking-wider text-gray-300 uppercase">{typesVehicules.nom}</span>
                            </div>
                        </div>
                    </div>

                    {/* Contenu */}
                    <div className="p-8">
                        {/* Titre */}
                        <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                            <div>
                                <h1 className="text-4xl font-bold text-white">
                                    {marques.map((m) => (m.id === vehicule.marque_id ? m.nom : ''))} {vehicule.model}
                                </h1>
                                <p className="mt-2 text-xl text-gray-400">{vehicule.immatriculation}</p>
                            </div>
                            {userConnecter.role === 'admin' && (
                                <Link href={route('vehicules.edit', vehicule.id)}>
                                    <Button className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-white shadow-lg transition-all duration-300 hover:from-blue-500 hover:to-blue-600 hover:shadow-xl">
                                        <SquarePen className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                                        Modifier le véhicule
                                    </Button>
                                </Link>
                            )}
                        </div>

                        {/* Grille d'informations */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                            <InfoItem
                                icon={<User className="text-blue-400" />}
                                label="Propriétaire"
                                value={vehicule.user_id === user.id ? user.name : '—'}
                                gradient="from-blue-500/10 to-blue-600/10"
                            />
                            <InfoItem
                                icon={<Hash className="text-purple-400" />}
                                label="Immatriculation"
                                value={vehicule.immatriculation}
                                gradient="from-purple-500/10 to-purple-600/10"
                            />
                            <InfoItem
                                icon={<Car className="text-cyan-400" />}
                                label="Modèle"
                                value={vehicule.model}
                                gradient="from-cyan-500/10 to-cyan-600/10"
                            />
                            <InfoItem
                                icon={<Palette className="text-pink-400" />}
                                label="Couleur"
                                value={vehicule.couleur}
                                gradient="from-pink-500/10 to-pink-600/10"
                            />
                            <InfoItem
                                icon={<Gauge className="text-amber-400" />}
                                label="Kilométrage"
                                value={`${vehicule.kilometrique} km`}
                                gradient="from-amber-500/10 to-amber-600/10"
                            />
                            <InfoItem
                                icon={<Fuel className="text-emerald-400" />}
                                label="Carburant"
                                value={carburants.map((c) => (c.id === vehicule.carburant_id ? c.type : ''))}
                                gradient="from-emerald-500/10 to-emerald-600/10"
                            />
                            <InfoItem
                                icon={<CalendarDays className="text-cyan-400" />}
                                label="Année"
                                value={vehicule.anneeFabrication.toString()}
                                gradient="from-cyan-500/10 to-cyan-600/10"
                            />
                            <InfoItem
                                icon={<CalendarDays className="text-violet-400" />}
                                label="Date d'acquisition"
                                value={formatDate(vehicule.dateAcquisition)}
                                gradient="from-violet-500/10 to-violet-600/10"
                            />
                            <InfoItem
                                icon={<FileText className="text-gray-400" />}
                                label="Numéro de série"
                                value={vehicule.numSerie}
                                gradient="from-gray-500/10 to-gray-600/10"
                            />
                        </div>

                        {/* Section statistiques supplémentaires */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="mt-12 rounded-2xl border border-gray-700/50 bg-gray-800/40 p-6 backdrop-blur-sm"
                        >
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-400">{vehicule.capacite_reservoir}</div>
                                    <div className="text-sm text-gray-400">Litres</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-emerald-400">
                                        {carburants.map((c) => (c.id === vehicule.carburant_id ? c.type : ''))}
                                    </div>
                                    <div className="text-sm text-gray-400">Type de carburant</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-amber-400">{vehicule.kilometrique} km</div>
                                    <div className="text-sm text-gray-400">Kilométrage</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </AppLayout>
    );
}

/** Composant d'information avec design moderne */
const InfoItem = ({
    icon,
    label,
    value,
    gradient = 'from-gray-700/10 to-gray-800/10',
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    gradient?: string;
}) => (
    <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ duration: 0.2 }}
        className={`flex items-center gap-4 rounded-xl bg-gradient-to-r ${gradient} border border-gray-700/30 p-4 backdrop-blur-sm transition-all duration-300 hover:border-gray-600/50`}
    >
        <div className="flex-shrink-0 rounded-xl bg-gray-900/50 p-3 backdrop-blur-sm">{icon}</div>
        <div className="min-w-0 flex-1">
            <p className="text-sm font-medium tracking-wide text-gray-400 uppercase">{label}</p>
            <p className="truncate text-lg font-semibold text-white">{value}</p>
        </div>
    </motion.div>
);
