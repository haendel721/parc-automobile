import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { BellDot, CirclePlus, SquarePen, Trash2 } from 'lucide-react';
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
};

interface roleUser {
    role: string;
}

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
};

export default function Index() {
    const { roleUser, vehicules, flash, marques, carburants, typeVehicules, userNames } = usePage<PageProps>().props;
    const { processing, delete: destroy } = useForm();
    const handleDelete = (id: number, immatriculation: string) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer le véhicule: ${immatriculation} ?`)) {
            destroy(route('vehicules.destroy', id));
        }
    };

    console.log(roleUser);
    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Vehicules" />
                <div className="m-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Titre à gauche */}
                    <h1 className="text-center text-2xl font-bold text-gray-800 sm:text-left">Liste des véhicules</h1>

                    {/* Bouton à droite (ou en dessous sur mobile) */}
                    <Link href={route('vehicules.create')}>
                        <Button className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-white shadow-md transition duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-lg sm:w-auto">
                            <CirclePlus />
                            <span>Créer un véhicule</span>
                        </Button>
                    </Link>
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
                        {vehicules.length > 0 && (
                            <div className="m-4">
                                <Table>
                                    {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">Id</TableHead>
                                            <TableHead>Immatriculation</TableHead>
                                            <TableHead>Propriétaire</TableHead>
                                            <TableHead>Marque</TableHead>
                                            <TableHead>Model</TableHead>
                                            <TableHead>TypeVehicule_id</TableHead>
                                            <TableHead>Couleur</TableHead>
                                            <TableHead>Carbrant</TableHead>
                                            <TableHead>Numéro de série</TableHead>
                                            <TableHead>Année de fabrication</TableHead>
                                            <TableHead>Date d'acquisition</TableHead>
                                            <TableHead className="text-center">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {vehicules.map((vehicule) => {
                                            const marque = marques.find((m) => m.id === vehicule.marque_id);
                                            const carburant = carburants.find((c) => c.id === vehicule.carburant_id);
                                            const typeVehicule = typeVehicules.find((t) => t.id === vehicule.typeVehicule_id);
                                            // const utilisateur = userName.find((u) => u.id === vehicule.user_id) ;
                                            // console.log(utilisateur);
                                            return (
                                                <TableRow key={vehicule.id}>
                                                    <TableCell className="font-medium">{vehicule.id}</TableCell>
                                                    <TableCell>{vehicule.immatriculation}</TableCell>
                                                    <TableCell>{userNames[vehicule.user_id] ?? 'Non identifié'}</TableCell>
                                                    <TableCell>{marque ? marque.nom : marque}</TableCell>
                                                    <TableCell>{vehicule.modele}</TableCell>
                                                    <TableCell>{typeVehicule ? typeVehicule.nom : typeVehicule}</TableCell>
                                                    <TableCell>{vehicule.couleur}</TableCell>
                                                    <TableCell>{carburant ? carburant.type : carburant}</TableCell>
                                                    <TableCell>{vehicule.numSerie}</TableCell>
                                                    <TableCell>{vehicule.anneeFabrication}</TableCell>
                                                    <TableCell>{vehicule.dateAcquisition}</TableCell>

                                                    <TableCell className="text-center">
                                                        <div className="flex justify-center gap-2">
                                                            <Link href={route('vehicules.edit', vehicule.id)}>
                                                                <Button className="bg-slate-600 hover:bg-slate-700">
                                                                    <SquarePen />
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                disabled={processing}
                                                                onClick={() => handleDelete(vehicule.id, vehicule.immatriculation)}
                                                                className="bg-red-500 hover:bg-red-700"
                                                            >
                                                                <Trash2 />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        {roleUser.role !== 'admin' && (
                            <VehiculeUser vehicules={vehicules} marques={marques} carburants={carburants} typeVehicules={typeVehicules} />
                        )}
                    </>
                )}
            </AppLayout>
        </>
    );
}
