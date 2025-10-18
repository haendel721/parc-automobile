import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { BellDot, Search, SquarePen, Trash2 } from 'lucide-react';
import { useState } from 'react';
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
};

export default function Index() {
    const { utilisateurs, flash } = usePage<PageProps>().props;
    const { processing, delete: destroy } = useForm();
    const handleDelete = (id: number, name: string) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer cette utilisateur: ${name} ?`)) {
            destroy(route('utilisateurs.destroy', id));
        }
    };
    const [searchTerm, setSearchTerm] = useState('');

    // 🔍 Filtrage des utilisateurs
    const filteredUtilisateurs = utilisateurs.filter((u) =>
        `${u.name} ${u.prenom} ${u.email} ${u.role}`.toLowerCase().includes(searchTerm.toLowerCase()),
    );
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
                <div className='m-4'>
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-xl">
                        {/* HEADER + BARRE DE RECHERCHE */}
                        <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
                            <h2 className="text-xl font-semibold text-gray-800">Liste des utilisateurs</h2>
                            <div className="relative w-full sm:w-72">
                                <Search className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="par nom, prénom, e-mail, rôle..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full rounded-xl border border-gray-300 py-2 pr-4 pl-10 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* TABLEAU */}
                        <div className="overflow-x-auto rounded-lg">
                            <Table className="min-w-full rounded-xl border border-gray-200 bg-white">
                                <TableHeader className="bg-blue-50 text-blue-700">
                                    <TableRow>
                                        <TableHead>Id</TableHead>
                                        <TableHead>Nom</TableHead>
                                        <TableHead>Prénom</TableHead>
                                        <TableHead>Téléphone</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead>Fonction</TableHead>
                                        <TableHead>E-mail</TableHead>
                                        <TableHead>Rôle</TableHead>
                                        <TableHead className="text-center">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {filteredUtilisateurs.length > 0 ? (
                                        filteredUtilisateurs.map((u, i) => (
                                            <TableRow key={u.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} transition hover:bg-blue-50`}>
                                                <TableCell className="font-medium">{u.id}</TableCell>
                                                <TableCell>{u.name}</TableCell>
                                                <TableCell>{u.prenom}</TableCell>
                                                <TableCell>0{u.phone}</TableCell>
                                                <TableCell>{u.statut}</TableCell>
                                                <TableCell>{u.fonction}</TableCell>
                                                <TableCell>{u.email}</TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                            u.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                                                        }`}
                                                    >
                                                        {u.role}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex justify-center gap-2">
                                                        <Link href={route('utilisateurs.edit', u.id)}>
                                                            <Button className="bg-blue-600 text-white hover:bg-blue-700">
                                                                <SquarePen size={16} />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            disabled={processing}
                                                            onClick={() => handleDelete(u.id, u.name)}
                                                            className="bg-red-500 text-white hover:bg-red-600"
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={9} className="py-6 text-center text-gray-500">
                                                Aucun utilisateur trouvé
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
