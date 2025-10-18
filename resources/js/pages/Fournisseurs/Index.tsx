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
};

export default function Index() {
    const { fournisseurs, flash } = usePage<PageProps>().props;
    const { processing, delete: destroy } = useForm();
    const handleDelete = (id: number, nom: string) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer le fournisseur : ${nom} ?`)) {
            destroy(route('fournisseurs.destroy', id));
        }
    };
    const [searchTerm, setSearchTerm] = useState('');

    // 🔍 Filtrage dynamique
    const filteredFournisseurs = fournisseurs.filter(
        (v) => v.nom.toLowerCase().includes(searchTerm.toLowerCase()) || v.type.toLowerCase().includes(searchTerm.toLowerCase()),
    );
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
                <div className="m-4">
                    {fournisseurs.length > 0 && (
                        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-xl">
                            {/* HEADER + BARRE DE RECHERCHE */}
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-800">Liste des fournisseurs</h2>
                                <div className="relative w-64">
                                    <Search className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="par nom , type..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full rounded-xl border border-gray-300 py-2 pr-4 pl-10 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto rounded-lg">
                                <Table className="min-w-full rounded-xl border border-gray-200 bg-white">
                                    <TableHeader className="bg-blue-50 text-blue-700">
                                        <TableRow>
                                            <TableHead>Id</TableHead>
                                            <TableHead>Nom</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Adresse</TableHead>
                                            <TableHead>Phone</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Site web</TableHead>
                                            <TableHead className="text-center">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {filteredFournisseurs.length > 0 ? (
                                            filteredFournisseurs.map((f, i) => (
                                                <TableRow
                                                    key={f.id}
                                                    className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} transition hover:bg-blue-50`}
                                                >
                                                    <TableCell className="font-medium">{f.id}</TableCell>
                                                    <TableCell>{f.nom}</TableCell>
                                                    <TableCell>{f.type}</TableCell>
                                                    <TableCell>{f.addresse}</TableCell>
                                                    <TableCell>{f.phone}</TableCell>
                                                    <TableCell>{f.email}</TableCell>
                                                    <TableCell>
                                                        {f.siteWeb ? (
                                                            <a href={f.siteWeb} target="_blank" className="text-blue-600 hover:underline">
                                                                {f.siteWeb}
                                                            </a>
                                                        ) : (
                                                            '-'
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="flex justify-center gap-2">
                                                            <Link href={route('fournisseurs.edit', f.id)}>
                                                                <Button className="rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700">
                                                                    <SquarePen size={16} />
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                disabled={processing}
                                                                onClick={() => handleDelete(f.id, f.nom)}
                                                                className="rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
                                                            >
                                                                <Trash2 size={16} />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={8} className="py-6 text-center text-gray-500">
                                                    Aucun fournisseur trouvé
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}
                </div>
            </AppLayout>
        </>
    );
}
