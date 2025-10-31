// components/CarDetails.jsx
import { Button } from '@/components/ui/button';
import { Link, useForm } from '@inertiajs/react';
import { AlertTriangle, Calendar, Car, Eye, Fuel, Gauge, SquarePen, Trash2 } from 'lucide-react';
import React from 'react';
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
};

const VehiculeUser: React.FC<VehiculeUserProps> = ({ vehicules, marques, carburants, typeVehicules, intervention, entretien }) => {
    const { processing, delete: destroy } = useForm();

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
            {vehicules.map((vehicule) => {
                const marque = marques.find((m) => m.id === vehicule.marque_id);
                const carburant = carburants.find((c) => c.id === vehicule.carburant_id);
                const typeVehicule = typeVehicules.find((t) => t.id === vehicule.typeVehicule_id);
                // const entretienFilter = entretien.filter((e) => e.vehicule_id === vehicule.id);

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
                        <div className="overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-300 hover:shadow-2xl">
                            <div className="flex flex-col lg:flex-row">
                                {/* Section Image */}
                                <div className="relative lg:w-2/5">
                                    <div className="aspect-video h-64 w-full lg:h-full">
                                        <img
                                            src={vehicule.photo ? `/storage/${vehicule.photo}` : '/images/default-car.png'}
                                            alt={`Photo de ${marque?.nom || vehicule.marque_id} ${vehicule.model}`}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    {/* Badge d'état */}
                                    <div className="absolute top-4 left-4">
                                        <div
                                            className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                                                hasAlerts ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                            }`}
                                        >
                                            {hasAlerts && <AlertTriangle className="h-3 w-3" />}
                                            {vehicule.etat || 'Disponible'}
                                        </div>
                                    </div>
                                </div>

                                {/* Section Informations */}
                                <div className="flex flex-1 flex-col p-6 lg:p-8">
                                    {/* En-tête */}
                                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                                        <div className="flex-1">
                                            <div className="mb-1 flex items-center gap-2 text-sm text-gray-500">
                                                <Car className="h-4 w-4" />
                                                {typeVehicule?.nom || vehicule.typeVehicule_id}
                                            </div>
                                            <h2 className="text-2xl font-bold text-gray-900">
                                                {marque?.nom || vehicule.marque_id} {vehicule.model}
                                            </h2>
                                            <p className="mt-1 font-mono text-lg font-semibold text-blue-600">{vehicule.immatriculation}</p>
                                        </div>

                                        {/* Compteur d'alertes */}
                                        {hasAlerts && (
                                            <div className="flex items-center gap-2">
                                                <div className="relative">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white">
                                                        <AlertTriangle className="h-5 w-5" />
                                                    </div>
                                                    {alertes > 0 && (
                                                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
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
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                                                <Fuel className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Carburant</p>
                                                <p className="font-semibold text-gray-900">{carburant?.type || vehicule.carburant_id}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                                <Gauge className="h-5 w-5 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Kilométrage</p>
                                                <p className="font-semibold text-gray-900">{vehicule.kilometrique?.toLocaleString() || '0'} km</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                                                <Calendar className="h-5 w-5 text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Acquisition</p>
                                                <p className="font-semibold text-gray-900">{formatDate(vehicule.dateAcquisition)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Informations supplémentaires */}
                                    <div className="mt-6 grid grid-cols-1 gap-100 border-t border-gray-100 pt-6 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Couleur</span>
                                                <span className="font-medium text-gray-900">{vehicule.couleur}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">N° de série</span>
                                                <span className="font-mono text-sm text-gray-900">{vehicule.numSerie}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Année</span>
                                                <span className="font-medium text-gray-900">{vehicule.anneeFabrication}</span>
                                            </div>
                                            {vehicule.assurance && (
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-500">Assurance</span>
                                                    <span
                                                        className={`text-sm font-medium ${
                                                            assuranceDaysRemaining < 0
                                                                ? 'text-red-600'
                                                                : assuranceDaysRemaining <= 7
                                                                  ? 'text-yellow-600'
                                                                  : 'text-green-600'
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
                                                className="flex items-center gap-2 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                                            >
                                                <SquarePen className="h-4 w-4" />
                                                Modifier
                                            </Button>
                                        </Link>

                                        <Button
                                            variant="outline"
                                            disabled={processing}
                                            onClick={() => handleDelete(vehicule.id, vehicule.immatriculation)}
                                            className="flex items-center gap-2 border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Supprimer
                                        </Button>

                                        {vehicule.assurance ? (
                                            <Link href={route('assurances.byVehicule', vehicule.id)}>
                                                <Button className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700">
                                                    <Eye className="h-4 w-4" />
                                                    Voir l'assurance
                                                </Button>
                                            </Link>
                                        ) : (
                                            <span className="rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-400">
                                                Aucune assurance
                                            </span>
                                        )}

                                        <Button
                                            variant="outline"
                                            className="flex items-center gap-2 border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100"
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
    );
};

export default VehiculeUser;
