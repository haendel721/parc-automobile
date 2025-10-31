import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { BellDot, Car, CirclePlus, Filter, Fuel, Gauge, Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import VehiculeUser from './VehiculeUser';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Vehicules',
        href: '/vehicules',
    },
];

type Vehicules = {
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
};
type intervention = {
    id: number;
    user_id: number;
    entretien_id: number;
    kilometrage: number;
};
interface roleUser {
    role: string;
}
type entretien = {
    id: number;
    vehicule_id: number;
    prochaine_visite: string;
    statut: number;
};

type PageProps = {
    flash: {
        message?: string;
    };
    userNames: { [id: number]: string }; // id => nom
    vehicules: Vehicules[];
    roleUser: roleUser;
    marques: { id: number; nom: string }[];
    carburants: { id: number; type: string }[];
    typeVehicules: { id: number; nom: string }[];
    intervention: intervention[];
    entretien: entretien[];
};

export default function Index() {
    const { roleUser, vehicules, flash, marques, carburants, typeVehicules, userNames, intervention, entretien } = usePage<PageProps>().props;
    const { processing, delete: destroy } = useForm();
    const handleDelete = (id: number, immatriculation: string) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer le véhicule: ${immatriculation} ?`)) {
            destroy(route('vehicules.destroy', id));
        }
    };
    const [searchTerm, setSearchTerm] = useState('');
    const getSearchFieldLabel = (field: string) => {
        const labels: { [key: string]: string } = {
            immatriculation: 'immatriculation',
            modele: 'modèle',
            proprietaire: 'propriétaire',
            marque: 'marque',
            carburant: 'carburant',
        };
        return labels[field] || field;
    };

    // États supplémentaires nécessaires
    // const [searchField, setSearchField] = useState('immatriculation');
    // Ajoutez ces états en haut de votre composant
    const [selectedTypeVehicule, setSelectedTypeVehicule] = useState('');
    const [selectedCarburant, setSelectedCarburant] = useState('');
    const [selectedMarque, setSelectedMarque] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const filteredVehicules = vehicules.filter((v) => {
        // Filtre par recherche texte
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase().trim();
            const proprietaire = userNames[v.user_id]?.toLowerCase() || '';
            const immatriculation = v.immatriculation?.toLowerCase() || '';
            const modele = v.model?.toLowerCase() || '';
            const marqueNom = marques.find((m) => m.id === v.marque_id)?.nom?.toLowerCase() || '';

            const matchesSearch = immatriculation.includes(term) || proprietaire.includes(term) || modele.includes(term) || marqueNom.includes(term);

            if (!matchesSearch) return false;
        }

        // Filtre par marque
        if (selectedMarque && v.marque_id !== parseInt(selectedMarque)) {
            return false;
        }

        // Filtre par carburant
        if (selectedCarburant && v.carburant_id !== parseInt(selectedCarburant)) {
            return false;
        }

        // Filtre par type de véhicule
        if (selectedTypeVehicule && v.typeVehicule_id !== parseInt(selectedTypeVehicule)) {
            return false;
        }

        return true;
    });

    console.log('📊 Résultats:', filteredVehicules.length, 'véhicules trouvés');
    // console.log('Km ' + filteredVehicules.map((v) => v.modele));
    // console.log("intervention " + intervention.map(e=>e.entretien_id))
    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Véhicules" />

                {/* Header avec recherche et bouton */}
                <div className="p-2 mb-8 rounded-2xl border border-gray-100 bg-white shadow-sm sm:m-5 sm:p-6">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        {/* Titre et informations - Maintenant en premier sur mobile */}
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-blue-50 p-3 flex items-center gap-4">
                                {/* Bouton créer véhicule */}
                                <Link href={route('vehicules.create')}>
                                    <Button className="bg-blue-500 hover:bg-blue-600" >
                                        <CirclePlus className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Car className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 sm:text-xl">Parc de Véhicules</h2>
                                <p className="text-sm text-gray-500">
                                    {filteredVehicules.length} véhicule{filteredVehicules.length !== 1 ? 's' : ''} disponible
                                    {filteredVehicules.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>

                        {/* Contrôles de recherche et filtres */}
                        <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
                            {/* Champ de recherche principal */}
                            <div className="w-full min-w-0 sm:min-w-[280px] sm:flex-1">
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
                                        <div className="min-w-0 flex-1">
                                            <input
                                                type="text"
                                                placeholder="Rechercher par immatriculation, modèle, propriétaire"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 pl-10 text-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                                            />
                                        </div>

                                        {/* Boutons groupés */}
                                        <div className="flex gap-2">
                                            {/* Bouton filtres avancés */}
                                            <button
                                                onClick={() => setShowFilters(!showFilters)}
                                                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-200 focus:ring-2 focus:ring-blue-100 focus:outline-none sm:flex-none sm:px-4 ${
                                                    showFilters || selectedCarburant || selectedMarque || selectedTypeVehicule
                                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                        : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                                                }`}
                                            >
                                                <SlidersHorizontal className="h-4 w-4" />
                                                <span className="xs:inline hidden">Filtres</span>
                                                {(selectedCarburant || selectedMarque || selectedTypeVehicule) && (
                                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                                                        {(selectedCarburant ? 1 : 0) + (selectedMarque ? 1 : 0) + (selectedTypeVehicule ? 1 : 0)}
                                                    </span>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Indicateur de filtres actifs */}
                    {(searchTerm || selectedCarburant || selectedMarque || selectedTypeVehicule) && (
                        <div className="mt-4 flex flex-col gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
                            <div className="flex flex-col gap-2 text-sm text-blue-700 sm:flex-row sm:items-center">
                                <div className="flex items-center gap-2">
                                    <Filter className="h-4 w-4 flex-shrink-0" />
                                    <span className="font-medium">Filtres actifs :</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {searchTerm && (
                                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium">Recherche : "{searchTerm}"</span>
                                    )}
                                    {selectedMarque && (
                                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium">
                                            Marque : {marques.find((m) => m.id === parseInt(selectedMarque))?.nom}
                                        </span>
                                    )}
                                    {selectedCarburant && (
                                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                                            Carburant : {carburants.find((c) => c.id === parseInt(selectedCarburant))?.type}
                                        </span>
                                    )}
                                    {selectedTypeVehicule && (
                                        <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700">
                                            Type : {typeVehicules.find((t) => t.id === parseInt(selectedTypeVehicule))?.nom}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCarburant('');
                                    setSelectedMarque('');
                                    setSelectedTypeVehicule('');
                                }}
                                className="flex items-center gap-1 self-end text-sm font-medium text-blue-600 hover:text-blue-800 sm:self-auto"
                            >
                                <X className="h-4 w-4" />
                                Tout effacer
                            </button>
                        </div>
                    )}

                    {/* Panneau de filtres avancés */}
                    {showFilters && (
                        <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">Filtres avancés</h3>
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                {/* Filtre par marque */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Marque</label>
                                    <select
                                        value={selectedMarque}
                                        onChange={(e) => setSelectedMarque(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                                    >
                                        <option value="">Toutes les marques</option>
                                        {marques.map((marque) => (
                                            <option key={marque.id} value={marque.id}>
                                                {marque.nom}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Filtre par carburant */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Carburant</label>
                                    <select
                                        value={selectedCarburant}
                                        onChange={(e) => setSelectedCarburant(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                                    >
                                        <option value="">Tous les carburants</option>
                                        {carburants.map((carburant) => (
                                            <option key={carburant.id} value={carburant.id}>
                                                {carburant.type}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Filtre par type de véhicule */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Type de véhicule</label>
                                    <select
                                        value={selectedTypeVehicule}
                                        onChange={(e) => setSelectedTypeVehicule(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                                    >
                                        <option value="">Tous les types</option>
                                        {typeVehicules.map((type) => (
                                            <option key={type.id} value={type.id}>
                                                {type.nom}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-3">
                                <button
                                    onClick={() => {
                                        setSelectedCarburant('');
                                        setSelectedMarque('');
                                        setSelectedTypeVehicule('');
                                    }}
                                    className="order-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 focus:ring-2 focus:ring-gray-100 focus:outline-none sm:order-1"
                                >
                                    Réinitialiser
                                </button>
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="order-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-100 focus:outline-none sm:order-2"
                                >
                                    Appliquer les filtres
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Notification */}
                {flash.message && (
                    <div className="mx-4 mb-6 sm:mx-6">
                        <Alert className="border-l-4 border-l-blue-500 bg-blue-50/50 backdrop-blur-sm">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                    <BellDot className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <AlertTitle className="font-semibold text-blue-900">Notification</AlertTitle>
                                    <AlertDescription className="mt-1 text-blue-800">{flash.message}</AlertDescription>
                                </div>
                            </div>
                        </Alert>
                    </div>
                )}

                {/* Contenu principal */}
                {roleUser.role === 'admin' ? (
                    <>
                        {filteredVehicules.length > 0 ? (
                            <div className="px-4 pb-8 sm:px-6">
                                {/* Grille des véhicules */}
                                <div className="grid grid-cols-1 gap-4  sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                                    {filteredVehicules.map((vehicule) => {
                                        console.log('vehicule ' + vehicule);
                                        const marque = marques.find((m) => m.id === vehicule.marque_id);
                                        const carburant = carburants.find((c) => c.id === vehicule.carburant_id);
                                        const typeVehicule = typeVehicules.find((t) => t.id === vehicule.typeVehicule_id);

                                        return (
                                            <div
                                                key={vehicule.id}
                                                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                                            >
                                                {/* Image du véhicule */}
                                                <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 sm:h-44">
                                                    <img
                                                        src={
                                                            vehicule.photo ? `/storage/${vehicule.photo}` : `/storage/photos_voitures/automoblie.png`
                                                        }
                                                        alt={`${marque?.nom || ''} ${vehicule.model}`}
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                    <div className="absolute top-3 right-3">
                                                        <span className="rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-gray-700 shadow-sm backdrop-blur-sm sm:px-3">
                                                            {typeVehicule?.nom || '—'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Contenu de la carte */}
                                                <div className="p-4 sm:p-5">
                                                    {/* En-tête */}
                                                    <div className="mb-4">
                                                        <div className="flex items-start justify-between">
                                                            <h3 className="line-clamp-1 text-base font-bold text-gray-900 sm:text-lg">
                                                                {marque ? marque.nom : '—'}
                                                            </h3>
                                                            <span className="ml-2 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                                                                {vehicule.immatriculation}
                                                            </span>
                                                        </div>
                                                        <p className="mt-1 text-sm text-gray-500">
                                                            {vehicule.anneeFabrication} • {vehicule.dateAcquisition}
                                                        </p>
                                                    </div>

                                                    {/* Métriques */}
                                                    <div className="grid grid-cols-3 gap-3 border-y border-gray-100 py-3 sm:gap-4">
                                                        <div className="text-center">
                                                            <div className="mx-auto mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 sm:h-8 sm:w-8">
                                                                <Car className="h-3 w-3 text-gray-600 sm:h-4 sm:w-4" />
                                                            </div>
                                                            <span className="block text-xs font-semibold text-gray-900 sm:text-sm">
                                                                {vehicule.model || '—'}
                                                            </span>
                                                            <span className="text-xs text-gray-500">Modèle</span>
                                                        </div>

                                                        <div className="text-center">
                                                            <div className="mx-auto mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 sm:h-8 sm:w-8">
                                                                <Gauge className="h-3 w-3 text-gray-600 sm:h-4 sm:w-4" />
                                                            </div>
                                                            <span className="block text-xs font-semibold text-gray-900 sm:text-sm">
                                                                {vehicule.kilometrique ? `${vehicule.kilometrique.toLocaleString()} km` : '—'}
                                                            </span>
                                                            <span className="text-xs text-gray-500">Kilométrage</span>
                                                        </div>

                                                        <div className="text-center">
                                                            <div className="mx-auto mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 sm:h-8 sm:w-8">
                                                                <Fuel className="h-3 w-3 text-gray-600 sm:h-4 sm:w-4" />
                                                            </div>
                                                            <span className="block text-xs font-semibold text-gray-900 sm:text-sm">
                                                                {carburant ? carburant.type : '—'}
                                                            </span>
                                                            <span className="text-xs text-gray-500">Carburant</span>
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="mt-4 flex justify-end">
                                                        <Link
                                                            href={route('vehicules.show', vehicule.id)}
                                                            className="text-sm font-medium text-blue-600 transition-colors duration-200 hover:text-blue-700"
                                                        >
                                                            Voir détails →
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            /* État vide */
                            <div className="flex flex-col items-center justify-center px-4 py-12 text-center sm:px-6 sm:py-16">
                                <div className="mb-4 rounded-full bg-gray-100 p-4 sm:p-6">
                                    <Car className="h-8 w-8 text-gray-400 sm:h-12 sm:w-12" />
                                </div>
                                <h3 className="mb-2 text-base font-semibold text-gray-900 sm:text-lg">Aucun véhicule trouvé</h3>
                                <p className="max-w-md text-sm text-gray-500 sm:text-base">
                                    {searchTerm
                                        ? `Aucun véhicule ne correspond à "${searchTerm}"`
                                        : 'Commencez par ajouter votre premier véhicule à la flotte'}
                                </p>
                            </div>
                        )}
                    </>
                ) : (
                    /* Vue utilisateur */
                    <>
                        {roleUser.role !== 'admin' && (
                            <VehiculeUser
                                vehicules={vehicules}
                                marques={marques}
                                carburants={carburants}
                                typeVehicules={typeVehicules}
                                intervention={intervention}
                                entretien={entretien}
                            />
                        )}
                    </>
                )}
            </AppLayout>
        </>
    );
}
