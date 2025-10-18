// components/CarDetails.jsx
import { Button } from '@/components/ui/button';
import { Link, useForm } from '@inertiajs/react';
import { Eye, SquarePen, Trash2 } from 'lucide-react';
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

    return (
        <>
            {vehicules.map((vehicule) => {
                const marque = marques.find((m) => m.id === vehicule.marque_id);
                const carburant = carburants.find((c) => c.id === vehicule.carburant_id);
                const typeVehicule = typeVehicules.find((t) => t.id === vehicule.typeVehicule_id);
                // const kiloFilter = intervention.filter((i) => i.id === vehicule.id);

                const entretienFilter = entretien.filter((e) => e.vehicule_id === vehicule.id);
                // console.log("kiloFilter " + kiloFilter.map(k=>k.kilometrage))

                // --- Calcul dynamique des alertes ---
                let alertes = 0;
                const today = new Date();
                // console.log("Assurance du véhicule :", vehicule.assurance);

                // Si le véhicule a une assurance
                if (vehicule.assurance && vehicule.assurance.dateFin) {
                    const dateFin = new Date(vehicule.assurance.dateFin);
                    const diffDays = (dateFin.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
                    // console.log('diffDays' + diffDays);
                    if (diffDays <= 7) {
                        // expiration dans 7 jours ou moins
                        alertes += 1;
                    }
                } // Ajouter d'autres alertes dynamiques si nécessaire
                alertes += vehicule.nbAlertes || 0;
                return (
                    <div key={vehicule.id} className="container mx-auto max-w-7xl space-y-6">
                        {/* Carte principale */}
                        <div className="m-6 flex flex-col overflow-hidden rounded-xl bg-white shadow-lg md:flex-row">
                            {/* Image du véhicule */}
                            <div className="h-64 w-full md:h-auto md:w-2/5">
                                <img
                                    src={vehicule.photo ? `/storage/${vehicule.photo}` : '/images/default-car.png'}
                                    alt={`Photo de ${marque ? marque.nom : vehicule.marque_id} ${vehicule.model}`}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            {/* Informations principales */}
                            <div className="flex w-full flex-col justify-between space-y-4 p-6 md:w-3/5">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">{vehicule.immatriculation}</h2>
                                    <p className="mt-1 text-gray-500">
                                        {marque ? marque.nom : vehicule.marque_id} - {vehicule.model} - {vehicule.couleur} -{' '}
                                        {carburant ? carburant.type : vehicule.carburant_id}
                                    </p>
                                </div>

                                {/* Détails supplémentaires */}
                                <div className="grid grid-cols-1 gap-4 text-sm text-gray-600 sm:grid-cols-2 md:grid-cols-3">
                                    <div>
                                        <span className="font-semibold text-gray-700">Genre :</span>{' '}
                                        {typeVehicule ? typeVehicule.nom : vehicule.typeVehicule_id}
                                        <div>
                                            <span className="font-semibold text-gray-700">N° de série :</span> {vehicule.numSerie}
                                        </div>
                                    </div>
                                    <div>
                                        <div>
                                            <span className="font-semibold text-gray-700">Acquisition :</span> {vehicule.dateAcquisition}
                                        </div>
                                        <div>
                                            <span className="font-semibold text-gray-700">Kilométrage :</span>
                                            {vehicule.kilometrique} km
                                        </div>
                                        {/* <div>
                                            <span className="font-semibold text-gray-700">Prochaine maintenance :</span>{' '}
                                            {entretienFilter.map(e=>e.vehicule_id === vehicule.id && e.statut ==='Validé' ? e.prochaine_visite : '')}
                                        </div> */}
                                    </div>
                                    <div className="flex flex-col items-start sm:items-end">
                                        <span className="font-semibold text-gray-700">Alertes :</span>

                                        <span className="group relative mt-1 inline-block cursor-pointer rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                                            {alertes} alerte(s)
                                            {/* Tooltip avec jours restants */}
                                            {vehicule.assurance?.dateFin &&
                                                (() => {
                                                    const today = new Date();
                                                    const dateFin = new Date(vehicule.assurance.dateFin);
                                                    const diffDays = Math.ceil((dateFin.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                                                    return (
                                                        <span className="absolute bottom-full left-1/2 z-10 mb-2 w-max -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                                            {diffDays} jour(s) restant(s)
                                                        </span>
                                                    );
                                                })()}
                                        </span>
                                    </div>
                                </div>

                                {/* Bouton d'action */}
                                <div className="mt-4 flex flex-wrap items-center gap-4 rounded-xl p-4">
                                    {/* Bouton Modifier */}
                                    <Link href={route('vehicules.edit', vehicule.id)}>
                                        <Button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors duration-300 hover:bg-blue-700">
                                            <SquarePen className="h-4 w-4" /> Modifier
                                        </Button>
                                    </Link>
                                    {/* Bouton Supprimer */}
                                    <Button
                                        disabled={processing}
                                        onClick={() => handleDelete(vehicule.id, vehicule.immatriculation)}
                                        className="bg-red-500 hover:bg-red-700"
                                    >
                                        <Trash2 /> Supprimer
                                    </Button>
                                    {/* Bouton voir assurance */}
                                    {vehicule.assurance ? (
                                        <Link href={route('assurances.byVehicule', vehicule.id)}>
                                            <Button className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors duration-300 hover:bg-green-700">
                                                <Eye className="h-4 w-4" /> Voir l'assurance
                                            </Button>
                                        </Link>
                                    ) : (
                                        <span className="text-sm text-gray-500">Aucune assurance</span>
                                    )}

                                    {/* Bouton Signaler */}
                                    <Button className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-white transition-colors duration-300 hover:bg-red-600">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M18.364 5.636l-1.414-1.414L12 9.172 7.05 4.222 5.636 5.636 10.586 10.586 5.636 15.536l1.414 1.414L12 12.828l4.95 4.95 1.414-1.414-4.95-4.95 4.95-4.95z"
                                            />
                                        </svg>
                                        Signaler
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default VehiculeUser;
