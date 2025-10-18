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

type PageProps = {
    flash: {
        message?: string;
    };
    pieces: pieces[];
    user: {
        id: number;
        role: string;
        name: string;
    };
};

export default function Index() {
    const { user, pieces, flash } = usePage<PageProps>().props;
    const { processing, delete: destroy } = useForm();
    console.log('Role utilisateur :', user.role);
    const handleDelete = (id: number, nom: string) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer le piece : ${nom} ?`)) {
            destroy(route('pieces.destroy', id));
        }
    };
const [searchTerm, setSearchTerm] = useState('');

    // 🔍 Filtrage dynamique
    const filteredPieces = pieces.filter(
        (v) =>
            v.nom.toLowerCase().includes(searchTerm.toLowerCase()) 
    );
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
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-xl">
                        {/* HEADER + BARRE DE RECHERCHE */}
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-800">Liste des pièces</h2>
                            <div className="relative w-64">
                                <Search className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher une pièce..."
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
                                        <TableHead>Prix</TableHead>
                                        <TableHead>Quantité</TableHead>
                                        <TableHead>Fournisseur</TableHead>
                                        {user.role === 'admin' && <TableHead>Utilisateur</TableHead>}
                                        <TableHead className="text-center">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {filteredPieces.length > 0 ? (
                                        filteredPieces.map((piece, i) => (
                                            <TableRow
                                                key={piece.id}
                                                className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} transition hover:bg-blue-50`}
                                            >
                                                <TableCell className="font-medium">{piece.id}</TableCell>
                                                <TableCell>{piece.nom}</TableCell>
                                                <TableCell>{piece.prix}</TableCell>
                                                <TableCell>{piece.quantite}</TableCell>
                                                <TableCell>{piece.fournisseur_id}</TableCell>
                                                {user.role === 'admin' && <TableCell>{piece.user ? piece.user.name : 'Inconnu'}</TableCell>}

                                                <TableCell className="text-center">
                                                    <div className="flex justify-center gap-2">
                                                        <Link href={route('pieces.edit', piece.id)}>
                                                            <Button className="rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700">
                                                                <SquarePen size={16} />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            disabled={processing}
                                                            onClick={() => handleDelete(piece.id, piece.nom)}
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
                                            <TableCell colSpan={user.role === 'admin' ? 7 : 6} className="py-6 text-center text-gray-500">
                                                Aucune pièce trouvée
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}
            </AppLayout>
        </>
    );
}
