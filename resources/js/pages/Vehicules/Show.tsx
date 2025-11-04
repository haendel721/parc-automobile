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
    modele: string;
    typeVehicule_id: number;
    couleur: string;
    carburant_id: number;
    numSerie: string;
    anneeFabrication: number;
    dateAcquisition: string;
    photo: string;
    user_id: number;
    kilometrique: number;
};

type PageProps = {
    vehicule: Vehicule;
    userName: string;
    marques: { id: number; nom: string };
    carburants: { id: number; type: string };
    typesVehicules: { id: number; nom: string };
    userConnecter: { role: string };
    flash: { message?: string };
};

export default function Show() {
    const { vehicule, userName, marques, carburants, typesVehicules, userConnecter, flash } = usePage<PageProps>().props;

    const getVehiculeIcon = () => {
        const typeVehiculeNom = typesVehicules?.nom?.toLowerCase() || '';
        const carburantType = carburants?.type?.toLowerCase() || '';

        if (typeVehiculeNom.includes('camion')) return <Truck className="h-8 w-8 text-green-500" />;
        if (typeVehiculeNom.includes('voiture')) return <Car className="h-8 w-8 text-blue-500" />;
        if (carburantType.includes('électrique')) return <BatteryFull className="h-8 w-8 text-green-500" />;
        if (carburantType.includes('essence') || carburantType.includes('diesel')) return <Fuel className="h-8 w-8 text-yellow-500" />;
        return <Activity className="h-8 w-8 text-gray-400" />;
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Accueil', href: '/dashboard' },
                { title: 'Véhicules', href: '/vehicules' },
                { title: ` ${vehicule.immatriculation}`, href: `/vehicules/${vehicule.id}/edit`},
            ]}
        >
            <Head title={`Véhicule ${vehicule.modele}`} />

            <div className="m-8">
                {/* Notification */}
                {flash.message && (
                    <Alert className="mb-6">
                        <AlertTitle>Notification</AlertTitle>
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                )}

                {/* Bouton retour */}
                <div className="mb-6">
                    <Link href={route('vehicules.index')}>
                        <Button variant="outline" className="flex items-center gap-2 bg-gray-500">
                            <ArrowLeft className="h-4 w-4" /> Retour à la liste
                        </Button>
                    </Link>
                </div>

                {/* Carte principale */}
                <motion.div
                    className="overflow-hidden rounded-sm bg-gray-900/90 shadow-lg"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Image du véhicule */}
                    <div className="relative flex h-60 items-center justify-center bg-gray-500">
                        <img
                            src={vehicule.photo ? `/storage/${vehicule.photo}` : `/storage/photos_voitures/automoblie.png`}
                            alt={vehicule.modele}
                            className="h-full object-contain drop-shadow-md"
                        />
                        <div className="absolute top-4 left-4">{getVehiculeIcon()}</div>
                    </div>

                    {/* Informations du véhicule */}
                    <div className="p-8">
                        <h1 className="mb-6 text-3xl font-semibold text-gray-800">
                            {marques.nom} {vehicule.modele}
                        </h1>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 ">
                            <InfoItem icon={<User className="text-indigo-500" />} label="Propriétaire" value={userName} />
                            <InfoItem icon={<Hash className="text-orange-500" />} label="Immatriculation" value={vehicule.immatriculation} />
                            <InfoItem icon={<Palette className="text-pink-500" />} label="Couleur" value={vehicule.couleur} />
                            <InfoItem icon={<Gauge className="text-amber-500" />} label="Kilométrage" value={`${vehicule.kilometrique ?? '—'} km`} />
                            <InfoItem icon={<Fuel className="text-green-600" />} label="Carburant" value={carburants.type} />
                            <InfoItem icon={<CalendarDays className="text-blue-600" />} label="Année" value={vehicule.anneeFabrication.toString()} />
                            <InfoItem
                                icon={<CalendarDays className="text-purple-600" />}
                                label="Date d’acquisition"
                                value={vehicule.dateAcquisition}
                            />
                            <InfoItem icon={<FileText className="text-gray-600" />} label="Numéro de série" value={vehicule.numSerie} />
                        </div>

                        {/* Bouton Modifier si admin */}
                        {userConnecter === 'admin' && (
                            <div className="mt-10 flex justify-end">
                                <Link href={route('vehicules.edit', vehicule.id)}>
                                    <Button className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
                                        <SquarePen className="h-4 w-4" /> Modifier le véhicule
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AppLayout>
    );
}

/** 🧩 Composant réutilisable pour afficher une info avec icône */
const InfoItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 transition-all duration-200 hover:bg-gray-100">
        <div className="flex-shrink-0">{icon}</div>
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-base font-medium text-gray-800">{value}</p>
        </div>
    </div>
);
