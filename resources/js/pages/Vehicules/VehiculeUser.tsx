// components/VehiculeUser.tsx - Version corrigée

import { Button } from '@/components/ui/button';
import { Link, useForm, usePage } from '@inertiajs/react';
import { AlertTriangle, Badge, Calendar, CalendarDays, Car, Eye, Fuel, Gauge, ShieldOff, SquarePen, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { route } from 'ziggy-js';
import KilometrageModal from './KilometrageModal';

// ... vos types existants ...

const VehiculeUser: React.FC<VehiculeUserProps> = ({
    vehicules,
    marques,
    carburants,
    typeVehicules,
    searchTerm = '',
}) => {
    const { processing, delete: destroy } = useForm();
    const [showFilters, setShowFilters] = useState(false);

    // ✅ CORRECTION : Récupération sécurisée de l'utilisateur
    const { auth } = usePage().props as any;
    const currentUser = auth?.user || { id: 0, name: 'Utilisateur' };

    const [isKilometrageModalOpen, setIsKilometrageModalOpen] = useState(false);
    const [selectedVehicule, setSelectedVehicule] = useState<Vehicules | null>(null);

    // ✅ CORRECTION : Ajout de dernierReleve dans les props ou état local
    const [dernierReleve, setDernierReleve] = useState<any>(null);

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

    // ✅ CORRECTION : Fonction pour ouvrir le modal avec chargement du dernier relevé
    const handleOpenKilometrageModal = async (vehicule: Vehicules) => {
        setSelectedVehicule(vehicule);

        try {
            // Charger le dernier relevé depuis l'API
            const response = await fetch(route('vehicules.dernier-releve', { vehicule: vehicule.id }));
            const data = await response.json();
            setDernierReleve(data);
        } catch (error) {
            console.error('Erreur chargement dernier relevé:', error);
            setDernierReleve(null);
        }

        setIsKilometrageModalOpen(true);
    };

    // ✅ CORRECTION : Fonction pour extraire les données d'assurance sécurisée
    const getAssuranceData = (vehicule: Vehicules) => {
        if (!vehicule.assurance) return null;

        // Si assurance est un objet
        if (typeof vehicule.assurance === 'object' && vehicule.assurance !== null) {
            return vehicule.assurance;
        }

        // Si assurance est un array, prendre le premier élément
        if (Array.isArray(vehicule.assurance) && vehicule.assurance.length > 0) {
            return vehicule.assurance[0];
        }

        return null;
    };

    return (
        <div className="space-y-6 p-4">
            {/* Panneau de filtres avancés */}
            {showFilters && (
                <div className="mt-6 rounded-xl border border-gray-700 bg-gray-800 p-4 backdrop-blur-sm sm:p-6">
                    {/* ... reste du code des filtres inchangé ... */}
                </div>
            )}

            {/* Liste des véhicules */}
            {vehicules.length > 0 ? (
                <div className="space-y-6">
                    {vehicules.map((vehicule) => {
                        const marque = marques.find((m) => m.id === vehicule.marque_id);
                        const carburant = carburants.find((c) => c.id === vehicule.carburant_id);
                        const typeVehicule = typeVehicules.find((t) => t.id === vehicule.typeVehicule_id);

                        // ✅ CORRECTION : Récupération sécurisée de l'assurance
                        const assurance = getAssuranceData(vehicule);

                        // Calcul dynamique des alertes
                        let alertes = vehicule.nbAlertes || 0;
                        let assuranceDaysRemaining = 0;

                        if (assurance && assurance.dateFin) {
                            assuranceDaysRemaining = getDaysRemaining(assurance.dateFin);
                            if (assuranceDaysRemaining <= 7) {
                                alertes += 1;
                            }
                        }

                        const hasAlerts = alertes > 0;

                        return (
                            <div key={vehicule.id} className="group">
                                {/* Carte principale */}
                                <div className="hover:bg-gray-750 overflow-hidden rounded-2xl border border-gray-700 bg-gray-800 shadow-2xl transition-all duration-300 hover:shadow-2xl">
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
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Caractéristiques principales */}
                                            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-blue-800/50 bg-blue-900/30">
                                                        <Fuel className="h-5 w-5 text-blue-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-400">Carburant</p>
                                                        <p className="font-semibold text-white">{carburant?.type || vehicule.carburant_id}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-purple-800/50 bg-purple-900/30">
                                                        <Calendar className="h-5 w-5 text-purple-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-400">Acquisition</p>
                                                        <p className="font-semibold text-white">{formatDate(vehicule.dateAcquisition)}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Informations supplémentaires */}
                                            <div className="mt-8">
                                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                                    {/* Carte 2: Caractéristiques techniques */}
                                                    <div className="group relative overflow-hidden rounded-2xl border border-gray-700/50 bg-gray-800/30 p-6 backdrop-blur-xl transition-all duration-500 hover:border-emerald-500/30 hover:bg-emerald-500/5">
                                                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                                        <div className="relative z-10">
                                                            <div className="space-y-4">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-sm font-medium text-gray-400">Année</span>
                                                                    <div className="flex items-center gap-2">
                                                                        <CalendarDays className="h-4 w-4 text-emerald-400" />
                                                                        <span className="font-medium text-white">{vehicule.anneeFabrication}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-sm font-medium text-gray-400">Réservoir</span>
                                                                    <div className="flex items-center gap-2">
                                                                        <Fuel className="h-4 w-4 text-emerald-400" />
                                                                        <span className="font-medium text-white">
                                                                            {vehicule.capacite_reservoir} L
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Carte 3: Statut assurance */}
                                                    <div className="group relative overflow-hidden rounded-2xl border border-gray-700/50 bg-gray-800/30 p-6 backdrop-blur-xl transition-all duration-500 hover:border-orange-500/30 hover:bg-orange-500/5">
                                                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                                        <div className="relative z-10">
                                                            {assurance ? (
                                                                <div className="space-y-4">
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-sm font-medium text-gray-400">Statut</span>
                                                                        <Badge
                                                                            variant={
                                                                                assuranceDaysRemaining < 0
                                                                                    ? 'destructive'
                                                                                    : assuranceDaysRemaining <= 14
                                                                                      ? 'secondary'
                                                                                      : 'default'
                                                                            }
                                                                            className={
                                                                                assuranceDaysRemaining < 0
                                                                                    ? 'border-red-500/30 bg-red-500/20 text-red-300'
                                                                                    : assuranceDaysRemaining <= 14
                                                                                      ? 'border-yellow-500/30 bg-yellow-500/20 text-yellow-300'
                                                                                      : 'border-green-500/30 bg-green-500/20 text-green-300'
                                                                            }
                                                                        >
                                                                            {assuranceDaysRemaining > 0
                                                                                ? `${assuranceDaysRemaining} jour(s)`
                                                                                : 'Expirée'}
                                                                        </Badge>
                                                                    </div>
                                                                    <span
                                                                        className={`text-sm font-medium ${
                                                                            assuranceDaysRemaining < 0
                                                                                ? 'text-red-400'
                                                                                : assuranceDaysRemaining <= 14
                                                                                  ? 'text-yellow-400'
                                                                                  : 'text-green-400'
                                                                        }`}
                                                                    >
                                                                        {assuranceDaysRemaining > 0
                                                                            ? `${assuranceDaysRemaining} jour(s) restant`
                                                                            : 'Expirée'}
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <div className="flex flex-col items-center justify-center py-4 text-center">
                                                                    <ShieldOff className="mb-2 h-4 w-4 text-gray-500" />
                                                                    <p className="text-sm text-gray-400">Aucune assurance</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="mt-8 flex flex-wrap items-center gap-3">
                                                <Link href={route('vehicules.edit', vehicule.id)}>
                                                    <Button
                                                        variant="outline"
                                                        className="flex items-center gap-2 border-blue-500 bg-blue-800/20 text-blue-400 transition-all duration-200 hover:bg-blue-700/50 hover:text-white"
                                                    >
                                                        <SquarePen className="h-4 w-4" />
                                                        Modifier
                                                    </Button>
                                                </Link>

                                                <Button
                                                    variant="outline"
                                                    disabled={processing}
                                                    onClick={() => handleDelete(vehicule.id, vehicule.immatriculation)}
                                                    className="flex items-center gap-2 border-red-600 bg-red-900/20 text-red-400 transition-all duration-200 hover:bg-red-800/50 hover:text-white"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Supprimer
                                                </Button>

                                                <Link
                                                    href={route('vehicules.show', vehicule.id)}
                                                    className="group relative inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition-all duration-300 hover:gap-3 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                                >
                                                    <Button
                                                        variant="outline"
                                                        className="flex items-center gap-2 border-blue-900 bg-blue-900/20 text-blue-400 transition-all duration-200 hover:bg-blue-900/50 hover:text-white"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        Détails
                                                    </Button>
                                                </Link>

                                                {/* ✅ CORRIGÉ : Bouton Kilométrage */}
                                                <Button
                                                    onClick={() => handleOpenKilometrageModal(vehicule)}
                                                    variant="outline"
                                                    className="flex items-center gap-2 border-orange-500 bg-orange-800/20 text-orange-400 transition-all duration-200 hover:bg-orange-700/50 hover:text-white"
                                                >
                                                    <Gauge className="h-5 w-5 text-orange-400" />
                                                    Kilométrage
                                                </Button>

                                                {/* Bouton Assurance */}
                                                {assurance ? (
                                                    <Link href={route('assurances.byVehicule', vehicule.id)}>
                                                        <Button className="flex items-center gap-2 border border-green-500 bg-green-800/20 text-green-400 transition-all duration-200 hover:bg-green-700/50 hover:text-white">
                                                            <Eye className="h-4 w-4" />
                                                            Assurance
                                                        </Button>
                                                    </Link>
                                                ) : (
                                                    <span className="rounded-lg border border-dashed border-gray-600 px-3 py-2 text-sm text-gray-500">
                                                        Aucune assurance
                                                    </span>
                                                )}
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
                        {searchTerm ? `Aucun véhicule ne correspond à "${searchTerm}"` : 'Aucun véhicule ne correspond aux critères de filtrage'}
                    </p>
                </div>
            )}

            {/* ✅ CORRECTION : Modal Kilometrage avec données sécurisées */}
            {selectedVehicule && (
                <KilometrageModal
                    isOpen={isKilometrageModalOpen}
                    onClose={() => {
                        setIsKilometrageModalOpen(false);
                        setSelectedVehicule(null);
                        setDernierReleve(null);
                    }}
                    vehiculeId={selectedVehicule.id}
                    vehiculeData={{
                        immatriculation: selectedVehicule.immatriculation,
                        model: selectedVehicule.model,
                        kilometrique: selectedVehicule.kilometrique || 0,
                        releve_km_cumule: selectedVehicule.releve_km_cumule || 0,
                    }}
                    dernierReleve={dernierReleve}
                />
            )}
        </div>
    );
};

export default VehiculeUser;
