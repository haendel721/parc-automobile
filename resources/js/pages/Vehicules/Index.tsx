import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { BellDot, CirclePlus, Eye, SquarePen, Trash2 } from 'lucide-react';
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
    const filteredVehicules = vehicules.filter((v) => {
        const proprietaire = userNames[v.user_id]?.toLowerCase() || '';
        const immatriculation = v.immatriculation?.toLowerCase() || '';
        const term = searchTerm.toLowerCase();

        return immatriculation.includes(term) || proprietaire.includes(term);
    });

    console.log("Km " +filteredVehicules.map(v=>v.kilometrique));
    // console.log("intervention " + intervention.map(e=>e.entretien_id))
    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Vehicules" />
                <div className="m-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    

                    {/* Bouton à gauche (ou en dessous sur mobile) */}
                    <Link href={route('vehicules.create')}>
                        <Button className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-white shadow-md transition duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-lg sm:w-auto">
                            <CirclePlus />
                            <span>Créer un véhicule</span>
                        </Button>
                    </Link>
                    {/* Titre à droite */}
                    <input
                        type="text"
                        placeholder="Rechercher par immatriculation ou propriétaire..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="focus:ring-opacity-50 w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 sm:w-1/3"
                    />
                </div>

                {roleUser.role === 'admin' ? (
                    <>
                        <div className="m-4">
                            <div>
                                {flash.message && (
                                    <Alert>
                                        <BellDot />
                                        <AlertTitle>Notification !</AlertTitle>
                                        <AlertDescription>{flash.message}</AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        </div>
                        {filteredVehicules.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {filteredVehicules.map((vehicule) => {
                                    const marque = marques.find((m) => m.id === vehicule.marque_id);
                                    const carburant = carburants.find((c) => c.id === vehicule.carburant_id);
                                    const typeVehicule = typeVehicules.find((t) => t.id === vehicule.typeVehicule_id);

                                    return (
                                        <div
                                            key={vehicule.id}
                                            className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md transition-all duration-300 hover:shadow-xl"
                                        >
                                            {/* Image du véhicule */}
                                            <div className="flex h-36 w-full items-center justify-center bg-gray-100">
                                                <img
                                                    src={vehicule.photo ? `/storage/${vehicule.photo}` : `/storage/photos_voitures/automoblie.png`}
                                                    alt={vehicule.modele}
                                                    className="h-full object-contain"
                                                />
                                            </div>

                                            {/* Contenu principal */}
                                            <div className="p-4">
                                                <div className="mt-3 flex justify-between text-sm text-gray-700">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {marque ? marque.nom : '—'} {vehicule.modele}
                                                    </h3>
                                                    <p className="mb-2 text-sm text-gray-500">{vehicule.immatriculation}</p>
                                                </div>

                                                <div className="mt-3 flex justify-between text-sm text-gray-700">
                                                    <div className="flex flex-col items-center">
                                                        <span className="font-medium">{vehicule.couleur}</span>
                                                        <span className="text-xs text-gray-400">Couleur</span>
                                                    </div>
                                                    <div className="flex flex-col items-center">
                                                        <span className="font-medium">{vehicule.kilometrique ?? '—'} km</span>
                                                        <span className="text-xs text-gray-400">Kilométrage</span>
                                                    </div>
                                                    <div className="flex flex-col items-center">
                                                        <span className="font-medium">{carburant ? carburant.type : '—'}</span>
                                                        <span className="text-xs text-gray-400">Carburant</span>
                                                    </div>
                                                </div>

                                                <div className="mt-5 flex items-center justify-between">
                                                    <span className="text-xs text-gray-500">
                                                        {vehicule.anneeFabrication} • {vehicule.dateAcquisition}
                                                    </span>

                                                    <div className="flex gap-2">
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="mt-10 text-center text-gray-500">Aucun véhicule ne correspond à votre recherche.</p>
                        )}
                    </>
                ) : (
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
