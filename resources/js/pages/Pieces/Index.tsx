import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { BellDot, CirclePlus, Trash2 } from 'lucide-react';
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
    const [searchField, setSearchField] = useState<'nom' | 'prix' | 'mecanicien'>('nom');
    const [quantityOperator, setQuantityOperator] = useState<'>' | '<'>('>');
    const [quantityValue, setQuantityValue] = useState<number | ''>('');
    // 🔍 Filtrage dynamique
    const filteredPieces = pieces.filter((p) => {
        const search = searchTerm.toLowerCase().trim();
        if (searchField === 'nom') {
            return p.nom.toLowerCase().includes(search);
        } else if (searchField === 'prix') {
            if (quantityValue !== '') {
                return quantityOperator === '>' ? p.prix > quantityValue : p.prix < quantityValue;
            }
        }
        // else if (searchField === 'mecanicien') {
        //     return user.some((u) => u.id === pc.vehicule_id && v.immatriculation.toLowerCase().includes(search));
        // }
        return true;
    });
    return (
        <>
            <AppLayout
                breadcrumbs={[
                    { title: 'Accueil', href: '/dashboard' },
                    { title: 'piece', href: '/pieces' },
                ]}
            >
                <Head title="pieces" />
                <div className="p-2">
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
                <div className="p-2">
                    {pieces.length > 0 && (
                        <div className="">
                            {/* HEADER + BARRE DE RECHERCHE */}
                            <div className="mb-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                    {/* Titre */}
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-blue-50 p-2">
                                            <Link href={route('pieces.create')}>
                                                <Button className="bg-blue-500 hover:bg-blue-600">
                                                    <CirclePlus className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">Liste des pièces</h2>
                                            <p className="text-sm text-gray-500">Gérez et consultez les pièces</p>
                                        </div>
                                    </div>

                                    {/* Contrôles de recherche */}
                                    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                                        {/* Sélecteur de champ */}
                                        <div className="relative min-w-[160px]">
                                            <select
                                                value={searchField}
                                                onChange={(e) => setSearchField(e.target.value as any)}
                                                className="w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm text-gray-700 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            >
                                                <option value="nom">nom</option>
                                                <option value="prix">prix</option>
                                                {/* <option value="immatriculation">vehicule (immatriculation)</option> */}
                                                {/* <option value="date">Date</option> */}
                                            </select>
                                            <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 transform">
                                                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Champ de recherche dynamique */}
                                        <div className="min-w-[280px] flex-1">
                                            {searchField === 'prix' ? (
                                                <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 p-1">
                                                    <select
                                                        value={quantityOperator}
                                                        onChange={(e) => setQuantityOperator(e.target.value as any)}
                                                        className="flex-1 cursor-pointer rounded-lg border-0 bg-transparent px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                                    >
                                                        <option value=">">Supérieur à</option>
                                                        <option value="<">Inférieur à</option>
                                                    </select>
                                                    <div className="h-6 w-px bg-gray-300"></div>
                                                    <input
                                                        type="number"
                                                        placeholder="Valeur"
                                                        value={quantityValue}
                                                        onChange={(e) => setQuantityValue(Number(e.target.value))}
                                                        className="flex-1 rounded-lg border-0 bg-transparent px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        placeholder={`${searchField}...`}
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 pl-10 text-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                    />
                                                    <div className="absolute top-1/2 left-3 -translate-y-1/2 transform">
                                                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Bouton d'action supplémentaire */}
                                        <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium whitespace-nowrap text-white transition-all duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                                                />
                                            </svg>
                                            Filtrer
                                        </button>
                                    </div>
                                </div>

                                {/* Indicateur de filtre actif */}
                                {searchTerm && (
                                    <div className="mt-4 flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-3">
                                        <div className="flex items-center gap-2 text-sm text-blue-700">
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                                                />
                                            </svg>
                                            Filtre actif : Recherche par {searchField} - "{searchTerm}"
                                        </div>
                                        <button
                                            onClick={() => setSearchTerm('')}
                                            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
                                        >
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Effacer
                                        </button>
                                    </div>
                                )}
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
                                            {user.role === 'admin' && <TableHead>Mécanicien</TableHead>}
                                            <TableHead className="text-center">Action</TableHead>
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
                                                            {/* <Link href={route('pieces.edit', piece.id)}>
                                                                <Button className="rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700">
                                                                    <SquarePen size={16} />
                                                                </Button>
                                                            </Link> */}
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
                </div>
            </AppLayout>
        </>
    );
}
