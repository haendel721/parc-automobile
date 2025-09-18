import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { BellDot, SquarePen, Trash2 } from 'lucide-react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Vehicules',
        href: '/vehicules',
    },
];

interface Vehicules {
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
}

interface roleUser {   
    role: string;
}

interface PageProps {
    flash: {
        message?: string;
    };
    vehicules: Vehicules[];
    roleUser: roleUser;
}

export default function Index() {
    const { roleUser, vehicules, flash } = usePage().props as PageProps;
    const { processing, delete: destroy } = useForm();
    const handleDelete = (id: number, immatriculation: string) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer le véhicule: ${immatriculation} ?`)) {
            destroy(route('vehicules.destroy', id));
        }
    };
    console.log(roleUser.role);
    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Vehicules" />
                
                
                <div className="m-4">
                    <Link href={route('vehicules.create')}>
                        <Button>Créer un nouveau vehicule</Button>
                    </Link>
                </div>
                {roleUser.role === 'admin' ? 
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
                                    <TableHead>Marque_Id</TableHead>
                                    <TableHead>Model</TableHead>
                                    <TableHead>TypeVehicule_id</TableHead>
                                    <TableHead>Couleur</TableHead>
                                    <TableHead>Carbrant_Id</TableHead>
                                    <TableHead>Numéro de série</TableHead>
                                    <TableHead>Année de fabrication</TableHead>
                                    <TableHead>Date d'acquisition</TableHead>
                                    <TableHead className="text-center">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {vehicules.map((vehicule) => (
                                    <TableRow key={vehicule.id}>
                                        <TableCell className="font-medium">{vehicule.id}</TableCell>
                                        <TableCell>{vehicule.immatriculation}</TableCell>
                                        <TableCell>{vehicule.marque_id}</TableCell>
                                        <TableCell>{vehicule.model}</TableCell>
                                        <TableCell>{vehicule.typeVehicule_id}</TableCell>
                                        <TableCell>{vehicule.couleur}</TableCell>
                                        <TableCell>{vehicule.carburant_id}</TableCell>
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
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
                </>
                : <h1>Utilisateur</h1>}
                
            </AppLayout>
        </>
    );
}
