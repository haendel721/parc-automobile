import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { BellDot, CirclePlus, SquarePen, Trash2 } from 'lucide-react';
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
    const [searchField, setSearchField] = useState<'nom' | 'type' | 'addresse'>('nom');
    // 🔍 Filtrage dynamique
    const filteredFournisseurs = fournisseurs.filter((f) => {
        const search = searchTerm.toLowerCase().trim();
        let matchesSearch = true;
        if (searchField === 'nom') {
            matchesSearch = f.nom.toLowerCase().includes(search);
        } else if (searchField === 'type') {
            matchesSearch = f.type.toLowerCase().includes(search);
        } else if (searchField === 'addresse') {
            matchesSearch = f.addresse.toLowerCase().includes(search);
        }

        return matchesSearch;
    });
    return (
        <>
            <AppLayout
                breadcrumbs={[
                    { title: 'Accueil', href: '/dashboard' },
                    { title: 'fournisseur', href: '/fournisseurs' },
                ]}
            >
                <Head title="fournisseurs" />
                <div className="p-2">
                    <div>
                        {flash.message && (
                            <Alert className="bg-blue-900/20 border-blue-800 text-blue-200">
                                <BellDot className="text-blue-300" />
                                <AlertTitle className="text-blue-100">Notification !</AlertTitle>
                                <AlertDescription>{flash.message}</AlertDescription>
                            </Alert>
                        )}
                    </div>
                </div>
                <div className="p-2">
                    {fournisseurs.length > 0 && (
                        <div className="">
                            {/* HEADER + BARRE DE RECHERCHE */}
                            <div className="mb-4 rounded-2xl border border-gray-700 bg-gray-800 p-6 shadow-sm">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                    {/* Titre */}
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-blue-900/20 p-2">
                                            <Link href={route('fournisseurs.create')}>
                                                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                                    <CirclePlus className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-white">Liste des fournisseurs</h2>
                                            <p className="text-sm text-gray-400">Gérez et consultez les fournisseurs</p>
                                        </div>
                                    </div>

                                    {/* Contrôles de recherche */}
                                    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                                        {/* Sélecteur de champ */}
                                        <div className="relative min-w-[160px]">
                                            <select
                                                value={searchField}
                                                onChange={(e) => setSearchField(e.target.value as any)}
                                                className="w-full cursor-pointer appearance-none rounded-xl border border-gray-600 bg-gray-700 px-4 py-2.5 pr-10 text-sm text-white transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            >
                                                <option value="nom">Nom</option>
                                                <option value="type">Type</option>
                                                <option value="addresse">Adresse</option>
                                            </select>
                                            <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 transform">
                                                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Champ de recherche dynamique */}
                                        <div className="min-w-[280px] flex-1">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder={`${searchField}...`}
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="w-full rounded-xl border border-gray-600 bg-gray-700 px-4 py-2.5 pl-10 text-sm text-white transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                                    <div className="mt-4 flex items-center justify-between rounded-lg border border-blue-800 bg-blue-900/20 p-3">
                                        <div className="flex items-center gap-2 text-sm text-blue-300">
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
                                            className="flex items-center gap-1 text-sm font-medium text-blue-400 hover:text-blue-300"
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
                                <Table className="min-w-full rounded-xl border border-gray-700 bg-gray-800">
                                    <TableHeader className="bg-blue-900/20 text-blue-300">
                                        <TableRow>
                                            <TableHead className="text-blue-200">Id</TableHead>
                                            <TableHead className="text-blue-200">Nom</TableHead>
                                            <TableHead className="text-blue-200">Type</TableHead>
                                            <TableHead className="text-blue-200">Adresse</TableHead>
                                            <TableHead className="text-blue-200">Phone</TableHead>
                                            <TableHead className="text-blue-200">Email</TableHead>
                                            <TableHead className="text-blue-200">Site web</TableHead>
                                            <TableHead className="text-center text-blue-200">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {filteredFournisseurs.length > 0 ? (
                                            filteredFournisseurs.map((f, i) => (
                                                <TableRow
                                                    key={f.id}
                                                    className={`${i % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700/50'} transition hover:bg-blue-900/20`}
                                                >
                                                    <TableCell className="font-medium text-white">{f.id}</TableCell>
                                                    <TableCell className="text-white">{f.nom}</TableCell>
                                                    <TableCell className="text-white">{f.type}</TableCell>
                                                    <TableCell className="text-white">{f.addresse}</TableCell>
                                                    <TableCell className="text-white">{f.phone}</TableCell>
                                                    <TableCell className="text-white">{f.email}</TableCell>
                                                    <TableCell>
                                                        {f.siteWeb ? (
                                                            <a href={f.siteWeb} target="_blank" className="text-blue-400 hover:text-blue-300 hover:underline">
                                                                {f.siteWeb}
                                                            </a>
                                                        ) : (
                                                            <span className="text-gray-400">-</span>
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
                                                                className="rounded-full bg-red-600 p-2 text-white hover:bg-red-700"
                                                            >
                                                                <Trash2 size={16} />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={8} className="py-6 text-center text-gray-400">
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