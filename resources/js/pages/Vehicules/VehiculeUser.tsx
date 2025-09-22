// components/CarDetails.jsx
import { Button } from '@/components/ui/button';
import { SquarePen } from 'lucide-react';
import { Link } from '@inertiajs/react';
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

type VehiculeUserProps = {
    vehicules: Vehicules[];
    marques: Marque[];
    typeVehicules: TypeVehicule[];
    carburants: Carburant[];
};

const VehiculeUser: React.FC<VehiculeUserProps> = ({ vehicules, marques, carburants, typeVehicules }) => {
    return (
        <>
            {vehicules.map((vehicule, index) => {
                const marque = marques.find((m) => m.id === vehicule.marque_id);
                const carburant = carburants.find((c) => c.id === vehicule.carburant_id);
                const typeVehicule = typeVehicules.find((t) => t.id === vehicule.typeVehicule_id);

                return (
                    <div key={vehicule.id} className="container mx-auto max-w-7xl space-y-6">
                        {/* Numéro du véhicule */}
                        <div className="justify flex gap-2">
                            <div className="mb-2 text-lg font-bold text-blue-500">Véhicule n°{index + 1}</div>
                            <div className="mb-2 text-lg font-bold text-blue-500">
                                <Link href={route('vehicules.edit', vehicule.id)}>
                                    <Button className="bg-black-75 text-color hover:bg-slate-700">
                                        <SquarePen /> modifier
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        {/* Carte principale */}
                        <div className="m-6 flex flex-col rounded-lg bg-zinc-900 p-6 shadow-sm md:flex-row">
                            {/* Image du véhicule */}
                            <div className="w-full md:w-2/5">
                                <img
                                    src={vehicule.photo ? `/storage/${vehicule.photo}` : '/images/default-car.png'}
                                    alt={`Photo de ${marque ? marque.nom : vehicule.marque_id} ${vehicule.model}`}
                                    className="h-32 w-32 object-cover"
                                />
                            </div>
                            {/* Informations principales */}
                            <div className="w-full gap-5 space-y-4 md:w-3/5">
                                <h2 className="text-xl font-bold text-white">{vehicule.immatriculation}</h2>
                                <div className="grid grid-cols-1 gap-4 text-sm text-white sm:grid-cols-2 md:grid-cols-3">
                                    <div>
                                        <span className="font-semibold">VOITURE</span> -{marque ? marque.nom : vehicule.marque_id} -{vehicule.model} -
                                        {vehicule.couleur} - {carburant ? carburant.type : vehicule.carburant_id} -
                                    </div>
                                    <div>
                                        <span className="font-semibold">Genre :</span> {typeVehicule ? typeVehicule.nom : vehicule.typeVehicule_id}
                                        <div>
                                            <span className="font-semibold">N° de série :</span> {vehicule.numSerie}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="font-semibold">Acquisition :</span> {vehicule.dateAcquisition}
                                    </div>
                                </div>
                            </div>
                            {/* Alertes */}
                            <div className="items w-full justify-items-center space-y-2 pt-4 md:w-1/5 md:pt-0 md:text-center">
                                <span>Nombre d'alerte</span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default VehiculeUser;
