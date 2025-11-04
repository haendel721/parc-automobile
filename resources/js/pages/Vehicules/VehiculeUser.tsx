// components/CarDetails.jsx
import { Button } from '@/components/ui/button';
import { Link, useForm } from '@inertiajs/react';
import { AlertTriangle, Calendar, Car, Eye, Filter, Fuel, Gauge, Search, SlidersHorizontal, SquarePen, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';
import { route } from 'ziggy-js';

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
    kilometrique?: number;
    prochaineMaintenance?: string;
    etat?: string;
    nbAlertes?: number;
    assurance?: {
        id: number;
        dateDebut: string;
        dateFin: string;
    };
};

type Marque = {
    id: number;
    nom: string;
};

type TypeVehicule = {
    id: number;
    nom: string;
};

type Carburant = {
    id: number;
    type: string;
};

type intervention = {
    id: number;
    user_id: number;
    entretien_id: number;
    vehicule_id: number;
    kilometrage: number;
};

type entretien = {
    id: number;
    vehicule_id: number;
    prochaine_visite: string;
    statut: string;
};

type VehiculeUserProps = {
    vehicules: Vehicules[];
    marques: Marque[];
    typeVehicules: TypeVehicule[];
    carburants: Carburant[];
    intervention: intervention[];
    entretien: entretien[];
    // Props pour les filtres
    searchTerm?: string;
    selectedMarque?: string;
    selectedCarburant?: string;
    selectedTypeVehicule?: string;
    onSearchChange?: (term: string) => void;
    onMarqueChange?: (marque: string) => void;
    onCarburantChange?: (carburant: string) => void;
    onTypeVehiculeChange?: (type: string) => void;
    onClearFilters?: () => void;
};

const VehiculeUser: React.FC<VehiculeUserProps> = ({ 
    vehicules, 
    marques, 
    carburants, 
    typeVehicules, 
    // Props pour les filtres
    searchTerm = '',
    selectedMarque = '',
    selectedCarburant = '',
    selectedTypeVehicule = '',
    onMarqueChange,
    onCarburantChange,
    onTypeVehiculeChange,
}) => {
    const { processing, delete: destroy } = useForm();
    const [showFilters, setShowFilters] = useState(false);

    const handleDelete = (id: number, immatriculation: string) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer le véhicule: ${immatriculation} ?`)) {
            destroy(route('vehicules.destroy', id));
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    const getDaysRemaining = (dateFin: string) => {
        const today = new Date();
        const endDate = new Date(dateFin);
        const diffTime = endDate.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    return (
        <div className="space-y-6 p-4">
                {/* Panneau de filtres avancés */}
                {showFilters && (
                    <div className="mt-6 rounded-xl border border-gray-700 bg-gray-800 p-4 sm:p-6 backdrop-blur-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-white">Filtres avancés</h3>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-700 hover:text-gray-200"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            {/* Filtre par marque */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">Marque</label>
                                <select
                                    value={selectedMarque}
                                    onChange={(e) => onMarqueChange?.(e.target.value)}
                                    className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2.5 text-sm text-white transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    <option value="" className="bg-gray-700 text-gray-300">Toutes les marques</option>
                                    {marques.map((marque) => (
                                        <option key={marque.id} value={marque.id} className="bg-gray-700 text-white">
                                            {marque.nom}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Filtre par carburant */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">Carburant</label>
                                <select
                                    value={selectedCarburant}
                                    onChange={(e) => onCarburantChange?.(e.target.value)}
                                    className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2.5 text-sm text-white transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    <option value="" className="bg-gray-700 text-gray-300">Tous les carburants</option>
                                    {carburants.map((carburant) => (
                                        <option key={carburant.id} value={carburant.id} className="bg-gray-700 text-white">
                                            {carburant.type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Filtre par type de véhicule */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">Type de véhicule</label>
                                <select
                                    value={selectedTypeVehicule}
                                    onChange={(e) => onTypeVehiculeChange?.(e.target.value)}
                                    className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2.5 text-sm text-white transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    <option value="" className="bg-gray-700 text-gray-300">Tous les types</option>
                                    {typeVehicules.map((type) => (
                                        <option key={type.id} value={type.id} className="bg-gray-700 text-white">
                                            {type.nom}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-3">
                            <button
                                onClick={() => {
                                    onMarqueChange?.('');
                                    onCarburantChange?.('');
                                    onTypeVehiculeChange?.('');
                                }}
                                className="order-2 rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-gray-600 hover:text-white focus:ring-2 focus:ring-gray-500 focus:outline-none sm:order-1"
                            >
                                Réinitialiser
                            </button>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="order-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none sm:order-2"
                            >
                                Appliquer les filtres
                            </button>
                        </div>
                    </div>
                )}

            {/* Liste des véhicules */}
            {vehicules.length > 0 ? (
                <div className="space-y-6">
                    {vehicules.map((vehicule) => {
                        const marque = marques.find((m) => m.id === vehicule.marque_id);
                        const carburant = carburants.find((c) => c.id === vehicule.carburant_id);
                        const typeVehicule = typeVehicules.find((t) => t.id === vehicule.typeVehicule_id);

                        // Calcul dynamique des alertes
                        let alertes = vehicule.nbAlertes || 0;
                        let assuranceDaysRemaining = 0;

                        if (vehicule.assurance && vehicule.assurance.dateFin) {
                            assuranceDaysRemaining = getDaysRemaining(vehicule.assurance.dateFin);
                            if (assuranceDaysRemaining <= 7) {
                                alertes += 1;
                            }
                        }

                        const hasAlerts = alertes > 0;

                        return (
                            <div key={vehicule.id} className="group">
                                {/* Carte principale */}
                                <div className="overflow-hidden rounded-2xl bg-gray-800 shadow-2xl transition-all duration-300 hover:shadow-2xl hover:bg-gray-750 border border-gray-700">
                                    <div className="flex flex-col lg:flex-row">
                                        {/* Section Image */}
                                        <div className="relative lg:w-2/5">
                                            <div className="aspect-video h-64 w-full lg:h-full">
                                                <img
                                                    src={vehicule.photo ? `/storage/${vehicule.photo}` : '/images/default-car.png'}
                                                    alt={`Photo de ${marque?.nom || vehicule.marque_id} ${vehicule.model}`}
                                                    className="h-full w-full object-cover"
                                                />
                                                {/* Overlay gradient */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent lg:bg-gradient-to-r lg:from-gray-900/50 lg:to-transparent" />
                                            </div>
                                        </div>

                                        {/* Section Informations */}
                                        <div className="flex flex-1 flex-col p-6 lg:p-8">
                                            {/* En-tête */}
                                            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                                                <div className="flex-1">
                                                    <div className="mb-1 flex items-center gap-2 text-sm text-gray-400">
                                                        <Car className="h-4 w-4" />
                                                        {typeVehicule?.nom || vehicule.typeVehicule_id}
                                                    </div>
                                                    <h2 className="text-2xl font-bold text-white">
                                                        {marque?.nom || vehicule.marque_id} {vehicule.model}
                                                    </h2>
                                                    <p className="mt-1 font-mono text-lg font-semibold text-blue-400">{vehicule.immatriculation}</p>
                                                </div>

                                                {/* Compteur d'alertes */}
                                                {hasAlerts && (
                                                    <div className="flex items-center gap-2">
                                                        <div className="relative">
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white shadow-lg">
                                                                <AlertTriangle className="h-5 w-5" />
                                                            </div>
                                                            {alertes > 0 && (
                                                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow-lg">
                                                                    {alertes}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Caractéristiques principales */}
                                            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-900/30 border border-blue-800/50">
                                                        <Fuel className="h-5 w-5 text-blue-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-400">Carburant</p>
                                                        <p className="font-semibold text-white">{carburant?.type || vehicule.carburant_id}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-900/30 border border-green-800/50">
                                                        <Gauge className="h-5 w-5 text-green-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-400">Kilométrage</p>
                                                        <p className="font-semibold text-white">{vehicule.kilometrique?.toLocaleString() || '0'} km</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-900/30 border border-purple-800/50">
                                                        <Calendar className="h-5 w-5 text-purple-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-400">Acquisition</p>
                                                        <p className="font-semibold text-white">{formatDate(vehicule.dateAcquisition)}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Informations supplémentaires */}
                                            <div className="mt-6 grid grid-cols-1 gap-6 border-t border-gray-700 pt-6 sm:grid-cols-2">
                                                <div className="space-y-3">
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-gray-400">Couleur</span>
                                                        <span className="font-medium text-white">{vehicule.couleur}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-gray-400">N° de série</span>
                                                        <span className="font-mono text-sm text-gray-300">{vehicule.numSerie}</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-gray-400">Année</span>
                                                        <span className="font-medium text-white">{vehicule.anneeFabrication}</span>
                                                    </div>
                                                    {vehicule.assurance && (
                                                        <div className="flex justify-between">
                                                            <span className="text-sm text-gray-400">Assurance</span>
                                                            <span
                                                                className={`text-sm font-medium ${
                                                                    assuranceDaysRemaining < 0
                                                                        ? 'text-red-400'
                                                                        : assuranceDaysRemaining <= 7
                                                                          ? 'text-yellow-400'
                                                                          : 'text-green-400'
                                                                }`}
                                                            >
                                                                {assuranceDaysRemaining > 0 ? `${assuranceDaysRemaining} jour(s) restant` : 'Expirée'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="mt-8 flex flex-wrap items-center gap-3">
                                                <Link href={route('vehicules.edit', vehicule.id)}>
                                                    <Button
                                                        variant="outline"
                                                        className="flex items-center gap-2 border-blue-600 bg-blue-900/20 text-blue-400 hover:bg-blue-800 hover:text-white transition-all duration-200"
                                                    >
                                                        <SquarePen className="h-4 w-4" />
                                                        Modifier
                                                    </Button>
                                                </Link>

                                                <Button
                                                    variant="outline"
                                                    disabled={processing}
                                                    onClick={() => handleDelete(vehicule.id, vehicule.immatriculation)}
                                                    className="flex items-center gap-2 border-red-600 bg-red-900/20 text-red-400 hover:bg-red-800 hover:text-white transition-all duration-200"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Supprimer
                                                </Button>

                                                {vehicule.assurance ? (
                                                    <Link href={route('assurances.byVehicule', vehicule.id)}>
                                                        <Button className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700 transition-all duration-200">
                                                            <Eye className="h-4 w-4" />
                                                            Voir l'assurance
                                                        </Button>
                                                    </Link>
                                                ) : (
                                                    <span className="rounded-lg border border-dashed border-gray-600 px-3 py-2 text-sm text-gray-500">
                                                        Aucune assurance
                                                    </span>
                                                )}

                                                <Button
                                                    variant="outline"
                                                    className="flex items-center gap-2 border-orange-600 bg-orange-900/20 text-orange-400 hover:bg-orange-800 hover:text-white transition-all duration-200"
                                                >
                                                    <AlertTriangle className="h-4 w-4" />
                                                    Signaler
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* État vide pour VehiculeUser */
                <div className="flex flex-col items-center justify-center px-4 py-12 text-center sm:px-6 sm:py-16">
                    <div className="mb-4 rounded-full bg-gray-700 p-4 sm:p-6">
                        <Car className="h-8 w-8 text-gray-400 sm:h-12 sm:w-12" />
                    </div>
                    <h3 className="mb-2 text-base font-semibold text-white sm:text-lg">Aucun véhicule trouvé</h3>
                    <p className="max-w-md text-sm text-gray-400 sm:text-base">
                        {searchTerm
                            ? `Aucun véhicule ne correspond à "${searchTerm}"`
                            : 'Aucun véhicule ne correspond aux critères de filtrage'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default VehiculeUser;