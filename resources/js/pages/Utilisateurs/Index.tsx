import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { BellDot, SquarePen, Trash2 } from 'lucide-react';
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
    const [searchField, setSearchField] = useState<'nom' | 'prenom' | 'statut' | 'fonction' | 'role'>('nom');

    // 🔍 Filtrage des utilisateurs
    const filteredUtilisateurs = utilisateurs.filter((u) => {
        const search = searchTerm.toLowerCase().trim();
        if (searchField === 'nom') {
            return u.name.toLowerCase().includes(search);
        } else if (searchField === 'prenom') {
            return u.prenom.toLowerCase().includes(search);
        } else if (searchField === 'statut') {
            return u.statut.toLowerCase().includes(search);
        } else if (searchField === 'fonction') {
            return u.fonction.toLowerCase().includes(search);
        } else if (searchField === 'role') {
            return u.role.toLowerCase().includes(search);
        }
        return true;
    });
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Accueil', href: '/dashboard' },
                { title: 'Utilisateurs', href: '/utilisateurs' },
            ]}
        >
            <Head title="utilisateurs" />
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
            {utilisateurs.length > 0 && (
                <div className="p-2">
                    {/* HEADER + BARRE DE RECHERCHE */}
                    <div className="mb-5 rounded-2xl bg-white p-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            {/* Titre */}
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-blue-50 p-2">
                                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Liste des utilisateurs</h2>
                                    <p className="text-sm text-gray-500">Consultez et gérer les utilisateurs</p>
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
                                        <option value="nom">Nom</option>
                                        <option value="prenom">Prénom</option>
                                        <option value="role">Rôle</option>
                                        <option value="statut">Statut</option>
                                        <option value="fonction">Fonction</option>
                                    </select>
                                    <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 transform">
                                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Champ de recherche */}
                                <div className="min-w-[280px] flex-1">
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
            )}
        </AppLayout>
    );
}
