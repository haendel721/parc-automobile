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
        title: 'Fournisseurs',
        href: '/fournisseurs',
    },
];

type fournisseurs = {
    id: number;
    nom: string;
    type: string;
    addresse: string;
    phone: string;
    email: string;
    siteWeb: string;
};

type PageProps = {
    flash: {
        message?: string;
    };
    fournisseurs: fournisseurs[];
}

export default function Index() {
    const { fournisseurs, flash } = usePage<PageProps>().props;
    const { processing, delete: destroy } = useForm();
    const handleDelete = (id: number, nom: string) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer le fournisseur : ${nom} ?`)) {
            destroy(route('fournisseurs.destroy', id));
        }
    };

    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="fournisseurs" />

                <div className="m-4">
                    <Link href={route('fournisseurs.create')}>
                        <Button>Créer un nouvelle fournisseur</Button>
                    </Link>
                </div>
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
                {fournisseurs.length > 0 && (
                    <div className="m-4">
                        <Table>
                            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Id</TableHead>
                                    <TableHead>nom</TableHead>
                                    <TableHead>type</TableHead>
                                    <TableHead>addresse</TableHead>
                                    <TableHead>phone</TableHead>
                                    <TableHead>email</TableHead>
                                    <TableHead>site web</TableHead>
                                    <TableHead className="text-center">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {fournisseurs.map((fournisseur) => {
                                    {console.log(fournisseur.siteWeb)}
                                     return (
                                        <TableRow key={fournisseur.id}>
                                            <TableCell className="font-medium">{fournisseur.id}</TableCell>
                                            <TableCell>{fournisseur.nom}</TableCell>
                                            <TableCell>{fournisseur.type}</TableCell>
                                            <TableCell>{fournisseur.addresse}</TableCell>
                                            <TableCell>{fournisseur.phone}</TableCell>
                                            <TableCell>{fournisseur.email}</TableCell>
                                            <TableCell>{fournisseur.siteWeb}</TableCell>

                                            <TableCell className="text-center">
                                                <div className="flex justify-center gap-2">
                                                    <Link href={route('fournisseurs.edit', fournisseur.id)}>
                                                        <Button className="bg-slate-600 hover:bg-slate-700">
                                                            <SquarePen />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        disabled={processing}
                                                        onClick={() => handleDelete(fournisseur.id, fournisseur.nom)}
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
            </AppLayout>
        </>
    );
}
