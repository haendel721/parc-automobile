import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { BellDot, CirclePlus, Filter, Search, SquarePen, Trash2, Users, X } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import {register} from "@/routes";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Utilisateurs',
        href: '/utilisateurs',
    },
];

interface User {
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
    utilisateurs: User[];
};

export default function Index() {
    const { utilisateurs, flash } = usePage<PageProps>().props;
    const { processing, delete: destroy } = useForm();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState<'nom' | 'prenom' | 'statut' | 'fonction' | 'role'>('nom');
    const [activeFilters, setActiveFilters] = useState<string[]>([]);

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur : ${name} ?`)) {
            destroy(route('utilisateurs.destroy', id));
        }
    };

    // 🔍 Filtrage des utilisateurs
    const filteredUtilisateurs = utilisateurs.filter((u) => {
        const search = searchTerm.toLowerCase().trim();
        if (!search) return true;

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

    const getRoleBadgeVariant = (role: string) => {
        switch (role.toLowerCase()) {
            case 'admin':
                return 'default';
            case 'moderator':
                return 'secondary';
            case 'user':
                return 'outline';
            default:
                return 'default';
        }
    };

    const getStatusColor = (statut: string) => {
        switch (statut.toLowerCase()) {
            case 'actif':
                return 'bg-emerald-500';
            case 'inactif':
                return 'bg-gray-500';
            case 'en attente':
                return 'bg-amber-500';
            default:
                return 'bg-blue-500';
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Accueil', href: '/dashboard' },
                { title: 'Utilisateurs', href: '/utilisateurs' },
            ]}
        >
            <Head title="Gestion des utilisateurs" />

            <div className="min-h-screen p-4 sm:p-6">
                {/* Notification Flash */}
                {flash.message && (
                    <Alert className="mb-6 border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                        <BellDot className="h-4 w-4" />
                        <AlertTitle>Succès !</AlertTitle>
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                )}

                {utilisateurs.length > 0 && (
                    <div className="space-y-6">
                        {/* Header Card */}
                        <Card className="border-gray-700 bg-gray-800/90 backdrop-blur-sm">
                            <CardHeader className="pb-4">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-4 rounded-2xl bg-blue-500/10 p-3 ">
                                            {/* <Link href={register()}>
                                                <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600">
                                                    <CirclePlus className="h-4 w-4" />
                                                </Button>
                                            </Link> */}
                                            <Users className="h-8 w-8 text-blue-400" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl font-bold text-white">Gestion des Utilisateurs</CardTitle>
                                            <CardDescription className="text-gray-400">
                                                {utilisateurs.length} utilisateur{utilisateurs.length > 1 ? 's' : ''} au total
                                            </CardDescription>
                                        </div>
                                    </div>
                                    {/* Barre de recherche et filtres */}
                                    <div className="flex flex-col gap-2 sm:flex-row">
                                        {/* Sélecteur de champ */}
                                        <div className="flex-1 sm:max-w-xs">
                                            <Select value={searchField} onValueChange={(value: any) => setSearchField(value)}>
                                                <SelectTrigger className="border-gray-600 bg-gray-700 text-white">
                                                    <SelectValue placeholder="Rechercher par..." />
                                                </SelectTrigger>
                                                <SelectContent className="border-gray-600 bg-gray-700">
                                                    <SelectItem value="nom">Nom</SelectItem>
                                                    <SelectItem value="prenom">Prénom</SelectItem>
                                                    <SelectItem value="role">Rôle</SelectItem>
                                                    <SelectItem value="statut">Statut</SelectItem>
                                                    <SelectItem value="fonction">Fonction</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Champ de recherche */}
                                        <div className="flex-1">
                                            <div className="relative">
                                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                                <Input
                                                    type="text"
                                                    placeholder={` ${searchField}...`}
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="border-gray-600 bg-gray-700 pl-10 text-white placeholder:text-gray-400 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>

                                        {/* Bouton filtre */}
                                        <Button variant="outline" className="border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600">
                                            <Filter className="mr-2 h-4 w-4" />
                                            Filtres
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent>
                                {/* Indicateur de filtre actif */}
                                {searchTerm && (
                                    <div className="mt-4 flex items-center justify-between rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
                                        <div className="flex items-center gap-2 text-sm text-blue-400">
                                            <Filter className="h-4 w-4" />
                                            Filtre actif : {searchField} contenant "{searchTerm}"
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setSearchTerm('')}
                                            className="h-8 text-blue-400 hover:text-blue-300"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Tableau */}
                        <Card className="border-gray-700 bg-gray-800/90 backdrop-blur-sm">
                            <CardContent className="p-0">
                                <div className="overflow-hidden rounded-lg">
                                    <Table>
                                        <TableHeader className="border-gray-700 bg-blue-900/20">
                                            <TableRow className="hover:bg-blue-900/10">
                                                <TableHead className="font-semibold text-blue-200">ID</TableHead>
                                                <TableHead className="font-semibold text-blue-200">Nom</TableHead>
                                                <TableHead className="font-semibold text-blue-200">Prénom</TableHead>
                                                <TableHead className="font-semibold text-blue-200">Téléphone</TableHead>
                                                <TableHead className="font-semibold text-blue-200">Statut</TableHead>
                                                <TableHead className="font-semibold text-blue-200">Fonction</TableHead>
                                                <TableHead className="font-semibold text-blue-200">Email</TableHead>
                                                <TableHead className="font-semibold text-blue-200">Rôle</TableHead>
                                                <TableHead className="text-center font-semibold text-blue-200">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredUtilisateurs.length > 0 ? (
                                                filteredUtilisateurs.map((user, index) => (
                                                    <TableRow
                                                        key={user.id}
                                                        className={`border-gray-700 transition-all duration-200 hover:bg-blue-900/20 ${
                                                            index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700/50'
                                                        }`}
                                                    >
                                                        <TableCell className="font-mono text-sm text-gray-300">#{user.id}</TableCell>
                                                        <TableCell className="font-medium text-white">{user.name}</TableCell>
                                                        <TableCell className="text-gray-300">{user.prenom}</TableCell>
                                                        <TableCell className="text-gray-400">0{user.phone}</TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <div className={`h-2 w-2 rounded-full ${getStatusColor(user.statut)}`} />
                                                                <span className="text-gray-300 capitalize">{user.statut}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-gray-300">{user.fonction}</TableCell>
                                                        <TableCell className="text-sm text-gray-400">{user.email}</TableCell>
                                                        <TableCell>
                                                            <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize">
                                                                {user.role}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex justify-center gap-2">
                                                                {/* Bouton Voir */}
                                                                {/* <Link href={route('utilisateurs.show', user.id)}>
                                                                    <Button 
                                                                        variant="ghost" 
                                                                        size="sm"
                                                                        className="h-8 w-8 rounded-lg text-blue-400 hover:bg-blue-500/20 hover:text-blue-300"
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                </Link> */}

                                                                {/* Bouton Modifier */}
                                                                <Link href={route('utilisateurs.edit', user.id)}>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-8 w-8 rounded-lg text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300"
                                                                    >
                                                                        <SquarePen className="h-4 w-4" />
                                                                    </Button>
                                                                </Link>

                                                                {/* Bouton Supprimer */}
                                                                <Button
                                                                    disabled={processing}
                                                                    onClick={() => handleDelete(user.id, user.name)}
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 w-8 rounded-lg text-red-400 hover:bg-red-500/20 hover:text-red-300"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={9} className="h-32 text-center">
                                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                                            <Users className="mb-2 h-8 w-8" />
                                                            <p>Aucun utilisateur trouvé</p>
                                                            <p className="text-sm text-gray-500">Essayez de modifier vos critères de recherche</p>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                            <div className="m-2 text-sm text-gray-400">
                                Affichage de {filteredUtilisateurs.length} sur {utilisateurs.length} utilisateur{utilisateurs.length > 1 ? 's' : ''}
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
