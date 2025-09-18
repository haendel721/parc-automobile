import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { BellDot, SquarePen, Trash2 } from 'lucide-react';
import { route } from 'ziggy-js';
import image from '../../../images/left.jpg';

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
                ) : (
                    <>
                        <div className="container mx-auto max-w-7xl space-y-6">
                            <div className="m-6 flex flex-col rounded-lg bg-zinc-900 p-6 shadow-sm md:flex-row">
                                <div className="w-full md:w-2/5">
                                    <img className="aspect-square w-50" src={image} alt="Logo" />
                                </div>
                                <div className="w-full gap-5 space-y-4 md:w-3/5">
                                    <h2 className="text-xl font-bold text-white">57036-A-1</h2>
                                    <div className="grid grid-cols-1 gap-4 text-sm text-white sm:grid-cols-2 md:grid-cols-3">
                                        <div>
                                            <span className="font-semibold">VOITURE</span> - <span className="font-semibold">SEAT</span> -{' '}
                                            <span className="font-semibold">LEON</span> - Blanche - DIESEL
                                        </div>
                                        <div>
                                            <span className="font-semibold">Genre:</span> BERLINE
                                        </div>
                                        <div>
                                            <span className="font-semibold">Code:</span> C214/19
                                        </div>
                                        <div>
                                            <span className="font-semibold">Parc:</span> DIGIPARC
                                        </div>
                                        <div>
                                            <span className="font-semibold">Acquisition:</span> ACHAT
                                        </div>
                                        <div>
                                            <span className="font-semibold">Carte grise:</span> C45210012/65
                                        </div>
                                        <div>
                                            <span className="font-semibold">Date mise en circulation:</span> 16/07/2018
                                        </div>
                                        <div>
                                            <span className="font-semibold">Numéro W:</span> WW452820
                                        </div>
                                        <div>
                                            <span className="font-semibold">N° de châssis:</span> WC4521000501
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/5 items justify-items-center space-y-2 pt-4 md:pt-0 md:text-center">
                                    <span>Nombre d'alerte</span>
                                </div>
                            </div>

                            <div className="rounded-lg p-6 shadow-sm">
                                <h3 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-800">Contrats d'achat</h3>
                                <div className="space-y-6">
                                    <div className="rounded-md border border-gray-200 bg-zinc-900 p-6">
                                        <h4 className="text-md mb-4 font-semibold text-gray-700">Informations générales</h4>
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Fournisseur</label>
                                                <input
                                                    type="text"
                                                    id="fournisseur"
                                                    value="SUPER AUTO"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Date d'achat</label>
                                                <input
                                                    type="text"
                                                    id="date_achat"
                                                    value="16/07/2018"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Numéro contrat</label>
                                                <input
                                                    type="text"
                                                    id="numero_contrat"
                                                    value="SA2018/542001"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Garantie</label>
                                                <input
                                                    type="text"
                                                    id="garantie"
                                                    value="5"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="rounded-md border border-gray-200 bg-zinc-900 p-6">
                                        <h4 className="text-md mb-4 font-semibold text-gray-700">Informations financières</h4>
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Montant HT</label>
                                                <input
                                                    type="text"
                                                    id="montant_ht"
                                                    value="189 000,00"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">TVA</label>
                                                <input
                                                    type="text"
                                                    id="tva"
                                                    value="20,00"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Montant TTC</label>
                                                <input
                                                    type="text"
                                                    id="montant_ttc"
                                                    value="226 800,00"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </AppLayout>
        </>
    );
}
