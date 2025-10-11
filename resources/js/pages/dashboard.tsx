import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import background from '../../images/backgroundV.jpg';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];
interface users {
    id: number;
    name: string;
    email: string;
    role: string;
}
interface vehicules {
    id: number;
    marque_id: number;
    model: string;
    couleur: string;
    photo: string;
    user_id: number;
    immatriculation: string;
}

interface marques {
    id: number;
    nom: string;
}

interface entretiens {
    id: number;
    user_id: number;
    type: string;
    statut: string;
    vehicule?: vehicules;
    prochaine_visite: string;
}

interface assurances {
    id: number;
    assurance_id: number;
    NomCompagnie: string;
    vehicule_id: number;
    NumContrat: string;
    user_id: number;
    cout: number;
    dateDebut: string;
    dateFin: string;
    duree_jours: number;
}

type Props = {
    users: users;
    vehicules: vehicules[];
    entretiens: entretiens[];
    assurances: assurances[];
    marques: marques[];
    userConnecter: { id: number; role: string };
};

export default function Dashboard() {
    // Récupère les données envoyées par le controller

    const { entretiens, vehicules, users, assurances, userConnecter, marques } = usePage<Props>().props;

    const vehiculeConnecter = vehicules.filter((v) => v.user_id === userConnecter.id);
    const assuranceConnecter = assurances.filter((a) => a.user_id === userConnecter.id);
    const entretiensConnecter = entretiens.filter((e) => e.user_id === userConnecter.id);
    console.log(entretiensConnecter);
    const vehiculesAvecMarque = vehiculeConnecter.map((v) => {
        const marque = marques.find((m) => m.id === v.marque_id);
        return {
            ...v,
            marqueNom: marque ? marque.nom : 'Marque inconnue',
        };
    });
    entretiensConnecter?.forEach((e) => console.log(e.statut));

    const [current, setCurrent] = useState(0);

    // Fonction pour aller à l'image suivante
    const nextSlide = () => {
        setCurrent((prev) => (prev === vehiculeConnecter.length - 1 ? 0 : prev + 1));
    };

    // Fonction pour aller à l'image précédente
    const prevSlide = () => {
        setCurrent((prev) => (prev === 0 ? vehiculeConnecter.length - 1 : prev - 1));
    };
    // Optionnel : défilement automatique toutes les 3 secondes
    useEffect(() => {
        const timer = setInterval(nextSlide, 10000);
        return () => clearInterval(timer);
    }, [current]);
    const vehicule = vehiculeConnecter[current];
    // console.log('vehicule ' + vehiculeConnecter.map((v) => v.id) + '\nAssurance ' + assuranceConnecter.map((a) => a.vehicule_id));
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            {userConnecter.role === 'admin' ? (
                <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                        <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                    </div>
                    <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
            ) : (
                <div className="relative flex min-h-screen flex-col items-center overflow-hidden p-6">
                    {/* --- Image de fond sombre --- */}
                    <div
                        className="absolute inset-0 -z-10 bg-cover bg-center brightness-50"
                        style={{ backgroundImage: `url(${background})` }}
                    ></div>

                    {/* Image de la voiture */}
                    <div className="relative mb-8 h-96 w-full overflow-hidden rounded-xl bg-gray-900 shadow-lg">
                        {/* --- Image du véhicule --- */}
                        {vehiculesAvecMarque.map((v, index) => (
                            <img
                                key={v.id}
                                src={`/storage/${v.photo}`}
                                alt={v.marqueNom}
                                className={`absolute top-0 left-0 h-full w-full object-cover transition-opacity duration-700 ${
                                    index === current ? 'opacity-100' : 'opacity-0'
                                }`}
                            />
                        ))}

                        {/* --- Dégradé pour lisibilité du texte --- */}
                        <div className="absolute right-0 bottom-0 left-0 h-40 bg-gradient-to-t from-black to-transparent"></div>

                        {/* --- Informations du véhicule --- */}
                        <div className="absolute bottom-4 left-6 text-white">
                            <h2 className="text-2xl font-bold">
                                {vehiculesAvecMarque[current].marqueNom} : {vehiculesAvecMarque[current].model}
                            </h2>
                            <p className="mt-1 text-sm text-gray-200">
                                Immatriculation : <span className="font-semibold">{vehiculesAvecMarque[current].immatriculation}</span>
                            </p>
                        </div>

                        {/* --- Boutons navigation --- */}
                        <button
                            onClick={prevSlide}
                            className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/70"
                        >
                            ❮
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/70"
                        >
                            ❯
                        </button>

                        {/* --- Indicateurs (petits points) --- */}
                        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 space-x-2">
                            {vehiculeConnecter.map((_, index) => (
                                <div
                                    key={index}
                                    onClick={() => setCurrent(index)}
                                    className={`h-2 w-2 cursor-pointer rounded-full ${index === current ? 'bg-white' : 'bg-gray-500'}`}
                                ></div>
                            ))}
                        </div>
                    </div>

                    {/* Infos principales */}
                    {/* <h3 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-100"></h3>
                    <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">Immatriculation :</p> */}

                    {/* Statistiques */}
                    <div className="flex grid w-full grid-cols-1 gap-4 text-sm md:grid-cols-2">
                        {/* --- Bloc assurances --- */}
                        <div className="rounded-xl bg-cyan-700 sm:grid-cols-1">
                            {assuranceConnecter?.map((assurance) => (
                                <div
                                    key={assurance.id}
                                    className="relative p-6 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                                >
                                    {/* Bandeau supérieur */}
                                    <div className="mb-4 flex items-center justify-between border-b border-white/30 pb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-full bg-white/20 p-2">
                                                <ShieldCheck className="h-6 w-6 text-white" />
                                            </div>
                                            <div>
                                                {vehiculeConnecter.map((v) =>
                                                    v.id === assurance.vehicule_id ? (
                                                        <>
                                                            <h2 className="text-lg font-semibold">
                                                                {marques.map((m) => (v.marque_id === m.id ? m.nom : ''))}
                                                            </h2>
                                                            <h2 className="text-lg font-semibold">{v.immatriculation}</h2>
                                                        </>
                                                    ) : (
                                                        ''
                                                    ),
                                                )}

                                                <p className="text-sm text-white/80">Contrat : {assurance.NumContrat}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Badge durée restante */}
                                    <div className="absolute top-6 right-4 rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white backdrop-blur-md">
                                        ⏳ {assurance.duree_jours} jours restants
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid gap-4 sm:grid-cols-1">
                            {entretiensConnecter
                                ?.filter((e) => e.statut?.toLowerCase() === 'validé')
                                .map((entretien) => (
                                    <div
                                        key={entretien.id}
                                        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 via-green-500 to-emerald-400 p-6 text-white shadow-lg"
                                    >
                                        {/* Effet décoratif en fond */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0"></div>

                                        {/* En-tête de la carte */}
                                        <div className="mb-4 flex items-center justify-between">
                                            <h3 className="text-xl font-semibold">Entretien #{entretien.id}</h3>
                                            <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-md">✅ Validé</span>
                                        </div>

                                        {/* Contenu */}
                                        <div className="space-y-2">
                                            <p className="flex items-center gap-2">
                                                <span className="font-medium text-white/80">Statut :</span>
                                                <span>{entretien.statut}</span>
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <span className="font-medium text-white/80">Prochaine visite :</span>
                                                <span>{entretien.prochaine_visite}</span>
                                            </p>
                                        </div>

                                        {/* Bouton ou lien d’action */}
                                        <div className="mt-5">
                                            <button className="w-full rounded-xl bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
                                                Voir les détails
                                            </button>
                                        </div>
                                    </div>
                                ))}

                            {/* Si aucun entretien validé n’est trouvé */}
                            {entretiensConnecter?.filter((e) => e.statut?.toLowerCase() === 'validé').length === 0 && (
                                <p className="col-span-full text-center text-gray-400">Aucun entretien validé trouvé.</p>
                            )}
                        </div>

                        <div className="flex flex-col items-center rounded-lg bg-green-50 p-4 shadow-md dark:bg-green-900">
                            <span className="font-bold text-gray-800 dark:text-gray-100">$3,00,290.00</span>
                            <span className="text-gray-500 dark:text-gray-400">Total Cost</span>
                        </div>

                        <div className="flex flex-col items-center rounded-lg bg-yellow-50 p-4 shadow-md dark:bg-yellow-900">
                            <span className="font-bold text-gray-800 dark:text-gray-100">$5.2K</span>
                            <span className="text-gray-500 dark:text-gray-400">Top Speed</span>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
