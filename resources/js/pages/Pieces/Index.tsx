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
        title: 'Pieces',
        href: '/pieces',
    },
];

type pieces = {
    id: number;
    nom: string;
    prix: number;
    quantite: number;
    fournisseur_id: string;
    user: string;
    user_id: number;
};

interface PageProps {
    flash: {
        message?: string;
    };
    pieces: pieces[];
    user: {
        id: number;
        role: string;
        name: string;
    };
}

export default function Index() {
    const { user, pieces, flash } = usePage().props as PageProps;
    const { processing, delete: destroy } = useForm();
    console.log('Role utilisateur :', user.role);
    const handleDelete = (id: number, nom: string) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer le piece : ${nom} ?`)) {
            destroy(route('pieces.destroy', id));
        }
    };

    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="pieces" />

                <div className="m-4">
                    <Link href={route('pieces.create')}>
                        <Button>Créer un nouvelle piece</Button>
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
                {pieces.length > 0 && (
                    <div className="m-4">
                        <Table>
                            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Id</TableHead>
                                    <TableHead>nom</TableHead>
                                    <TableHead>Prix</TableHead>
                                    <TableHead>Quantité</TableHead>
                                    <TableHead>Fournisseur</TableHead>
                                    {user.role === 'admin' ? <TableHead>Utilisateur</TableHead> : ''}

                                    <TableHead className="text-center">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pieces.map((piece) => {
                                    return (
                                        <TableRow key={piece.id}>
                                            <TableCell className="font-medium">{piece.id}</TableCell>
                                            <TableCell>{piece.nom}</TableCell>
                                            <TableCell>{piece.prix}</TableCell>
                                            <TableCell>{piece.quantite}</TableCell>
                                            <TableCell>{piece.fournisseur_id}</TableCell>
                                            {user.role === 'admin' ? <TableCell>{piece.user ? piece.user.name : 'Inconnu'}</TableCell> : ''}

                                            <TableCell className="text-center">
                                                <div className="flex justify-center gap-2">
                                                    <Link href={route('pieces.edit', piece.id)}>
                                                        <Button className="bg-slate-600 hover:bg-slate-700">
                                                            <SquarePen />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        disabled={processing}
                                                        onClick={() => handleDelete(piece.id, piece.nom)}
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
