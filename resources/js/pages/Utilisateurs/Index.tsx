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
        title: 'Utilisateurs',
        href: '/utilisateurs',
    },
];

interface users {
    id: number;
    name: string;
    prenom: string;
    phone: number;
    statut: string;
    fonction: string;
    email: string;
    role: string;
}

type PageProps = {
    flash: {
        message?: string;
    };
    utilisateurs: users[];
}

export default function Index() {
    const { utilisateurs, flash } = usePage<PageProps>().props;
    const { processing, delete: destroy } = useForm();
    const handleDelete = (id: number, name: string) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer cette utilisateur: ${name} ?`)) {
            destroy(route('utilisateurs.destroy', id));
        }
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="utilisateurs" />
            {/*<div className="m-4">
                 <Link href={route('utilisateurs.create')}>
                    <Button>Créer un nouveau utilisateur</Button>
                </Link> 
            </div>*/}
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
            {utilisateurs.length > 0 && (
                <div className="m-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Id</TableHead>
                                <TableHead>Nom</TableHead>
                                <TableHead>Prénom</TableHead>
                                <TableHead>Téléphone</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Fonction</TableHead>
                                <TableHead>E-Mail</TableHead>
                                <TableHead>Rôle</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {utilisateurs.map((utilisateur) => (
                                <TableRow key={utilisateur.id}>
                                    <TableCell className="font-medium">{utilisateur.id}</TableCell>
                                    <TableCell>{utilisateur.name}</TableCell>
                                    <TableCell>{utilisateur.prenom}</TableCell>
                                    <TableCell>0{utilisateur.phone}</TableCell>
                                    <TableCell>{utilisateur.statut}</TableCell>
                                    <TableCell>{utilisateur.fonction}</TableCell>
                                    <TableCell>{utilisateur.email}</TableCell>
                                    <TableCell>{utilisateur.role}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center gap-2">
                                            <Link href={route('utilisateurs.edit', utilisateur.id)}>
                                                <Button className="bg-slate-600 hover:bg-slate-700">
                                                    <SquarePen />
                                                </Button>
                                            </Link>
                                            <Button
                                                disabled={processing}
                                                onClick={() => handleDelete(utilisateur.id, utilisateur.name)}
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
        </AppLayout>
    );
}
