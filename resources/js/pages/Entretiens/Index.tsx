import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { BellDot, Calendar, Car, Eye, Filter, Plus, Search, SquarePen, Users, Wrench } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Accueil',
        href: '/dashboard',
    },
    {
        title: 'entretien',
        href: '/entretiens',
    },
];

interface vehicule {
    id: string;
    immatriculation: string;
}
interface fournisseur {
    nom: string;
}
interface user {
    id: number;
    name: string;
    role: string;
}
interface pieces {
    id: number;
    nom: string;
    quantite: number;
    prix: number;
    vehicule_id: number;
    entretien_id: number;
}
interface frais {
    id: number;
    vehicule_id: number;
    entretien_id: number;
    user_id: number;
    type_frais: string;
    montant: number;
}
interface interventions {
    id: number;
    main_oeuvre: number;
    user_id: number;
    user: number;
    entretien_id: number;
    vehicule_id: number;
}
interface entretien {
    id: number;
    vehicule_id: number;
    fournisseur_id: number;
    user_id: number;
    type: string;
    cout: number;
    piece_remplacee: string;
    probleme: string;
    recommandation: string;
    prochaine_visite: string;
    description: string;
    statut: string;
    mecanicien_id: number;
    vehicule: vehicule;
    fournisseur: fournisseur;
    user: user;
}

type PageProps = {
    flash: { message?: string };
    user: user;
    entretiens: entretien[];
    T_user: user[];
    pieces: pieces[];
    interventions: interventions[];
    frais: frais[];
};

export default function Index() {
    const { flash, entretiens, T_user, user, frais, pieces } = usePage<PageProps>().props;

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

    // Fonction pour trouver le nom du mécanicien correspondant
    const getMecanicienName = (id: number) => T_user.find((u) => u.id === id)?.name || 'Non assigné';

    // Filtrage des entretiens selon le rôle
    const entretiensFiltres = entretiens.filter((e) => {
        if (user.role === 'admin') return true;
        if (user.role === 'mecanicien') return e.mecanicien_id === user.id;
        return e.user_id === user.id;
    });

    // 🔍 Filtrage avancé
    const filteredEntretiens = entretiensFiltres.filter((e) => {
        const matchesSearch =
            e.statut.toLowerCase().includes(searchTerm.toLowerCase()) || e.vehicule?.immatriculation.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || e.statut === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Calcul du coût total pour un entretien
    const getTotalCost = (entretienId: number) => {
        return frais.filter((f) => f.entretien_id === entretienId).reduce((total, f) => total + f.montant, 0);
    };

    // Stats pour le header
    const stats = {
        total: entretiens.length,
        enAttente: entretiens.filter((e) => e.statut === 'En attente').length,
        valide: entretiens.filter((e) => e.statut === 'Validé').length,
        termine: entretiens.filter((e) => e.statut === 'Terminé').length,
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Entretiens" />

            <div className="space-y-6 p-6">
                {/* Header avec statistiques */}
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Gestion des Entretiens</h1>
                        <p className="mt-2 text-gray-400">Suivez et gérez tous les entretiens de votre flotte automobile</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href={route('entretiens.create')}>
                            <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
                                <Plus className="h-4 w-4" />
                                Nouvelle Demande
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Cartes de statistiques */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 border border-blue-800/30">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-400">Total Entretiens</p>
                                    <p className="text-2xl font-bold text-white">{stats.total}</p>
                                </div>
                                <div className="rounded-lg bg-blue-600 p-3">
                                    <Wrench className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-yellow-900/50 to-yellow-900/50 border border-yellow-900/50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-yellow-400">En Attente</p>
                                    <p className="text-2xl font-bold text-white">{stats.enAttente}</p>
                                </div>
                                <div className="rounded-lg bg-yellow-600 p-3">
                                    <Calendar className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-900/50 to-green-900/50 border border-green-900/50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-400">Validés</p>
                                    <p className="text-2xl font-bold text-white">{stats.valide}</p>
                                </div>
                                <div className="rounded-lg bg-green-600 p-3">
                                    <Users className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-900/50 to-purple-900/50 border border-purple-800/30">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-purple-400">Terminés</p>
                                    <p className="text-2xl font-bold text-white">{stats.termine}</p>
                                </div>
                                <div className="rounded-lg bg-purple-600 p-3">
                                    <Car className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Message flash */}
                {flash.message && (
                    <Alert className="border-l-4 border-l-blue-500 bg-blue-900/20 text-blue-200">
                        <BellDot className="h-5 w-5 text-blue-400" />
                        <AlertTitle className="text-blue-100">Notification</AlertTitle>
                        <AlertDescription className="text-blue-300">{flash.message}</AlertDescription>
                    </Alert>
                )}

                {/* Carte principale */}
                <Card className="shadow-2xl border border-gray-700 bg-gray-900/90 backdrop-blur-sm">
                    <CardHeader className="border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
                        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                            <div>
                                <CardTitle className="text-xl text-white">Liste des Entretiens</CardTitle>
                                <CardDescription className="text-gray-400">{filteredEntretiens.length} entretien(s) trouvé(s)</CardDescription>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                {/* Sélecteur de vue */}
                                {user.role === 'admin' && (
                                    <div className="flex rounded-lg border border-gray-600 bg-gray-700 p-1">
                                        <button
                                            onClick={() => setViewMode('table')}
                                            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                                                viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                                            }`}
                                        >
                                            Tableau
                                        </button>
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                                                viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                                            }`}
                                        >
                                            Grille
                                        </button>
                                    </div>
                                )}

                                {/* Filtre par statut */}
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-[180px] border-gray-600 bg-gray-700 text-white">
                                        <Filter className="h-4 w-4 text-gray-400" />
                                        <SelectValue placeholder="Filtrer par statut" />
                                    </SelectTrigger>
                                    <SelectContent className="border-gray-600 bg-gray-700 text-white">
                                        <SelectItem value="all">Tous les statuts</SelectItem>
                                        <SelectItem value="En attente">En attente</SelectItem>
                                        <SelectItem value="Validé">Validé</SelectItem>
                                        <SelectItem value="Terminé">Terminé</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* Barre de recherche */}
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="immatriculation"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 border-gray-600 bg-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        {/* Vue Tableau (Admin) */}
                        {user.role === 'admin' && viewMode === 'table' ? (
                            <div className="overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-gradient-to-r from-blue-900/30 to-blue-800/20">
                                        <TableRow>
                                            <TableHead className="font-semibold text-blue-300">#Id</TableHead>
                                            <TableHead className="font-semibold text-blue-300">Véhicule</TableHead>
                                            <TableHead className="font-semibold text-blue-300">Conducteur</TableHead>
                                            <TableHead className="font-semibold text-blue-300">Mécanicien</TableHead>
                                            <TableHead className="font-semibold text-blue-300">Problème</TableHead>
                                            <TableHead className="font-semibold text-blue-300">Prochaine visite</TableHead>
                                            <TableHead className="font-semibold text-blue-300">Coût total</TableHead>
                                            <TableHead className="font-semibold text-blue-300">Statut</TableHead>
                                            <TableHead className="text-center font-semibold text-blue-300">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredEntretiens.length > 0 ? (
                                            filteredEntretiens.map((e, index) => (
                                                <TableRow 
                                                    key={e.id} 
                                                    className={`group transition-all hover:bg-blue-900/10 ${
                                                        index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/50'
                                                    }`}
                                                >
                                                    <TableCell className="font-medium">
                                                        <div className="flex items-center gap-2">
                                                            <Car className="h-4 w-4 text-gray-400" />
                                                            <span className="text-white">{e.vehicule?.id ?? '-'}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        <div className="flex items-center gap-2">
                                                            <Car className="h-4 w-4 text-gray-400" />
                                                            <span className="text-white">{e.vehicule?.immatriculation ?? '-'}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-gray-300">{e.user?.name ?? 'Utilisateur inconnu'}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Users className="h-4 w-4 text-gray-400" />
                                                            <span className="text-gray-300">{getMecanicienName(e.mecanicien_id)}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="max-w-xs truncate text-gray-300" title={e.probleme}>
                                                        {e.probleme}
                                                    </TableCell>
                                                    <TableCell>
                                                        {e.prochaine_visite ? (
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                                <span className="text-gray-300">{e.prochaine_visite}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-500">-</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="font-semibold text-white">
                                                        {getTotalCost(e.id).toLocaleString('fr-FR')} MGA
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={
                                                                e.statut === 'Validé'
                                                                    ? 'default'
                                                                    : e.statut === 'En attente'
                                                                      ? 'secondary'
                                                                      : 'outline'
                                                            }
                                                            className={
                                                                e.statut === 'Validé'
                                                                    ? 'bg-green-900/40 text-green-300 border border-green-800/50'
                                                                    : e.statut === 'En attente'
                                                                      ? 'bg-yellow-900/40 text-yellow-300 border border-yellow-800/50'
                                                                      : 'bg-blue-900/40 text-blue-300 border border-blue-800/50'
                                                            }
                                                        >
                                                            {e.statut}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex justify-center gap-2">
                                                            <Link href={route('entretiens.show', e.id)}>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="border-blue-600 bg-blue-900/20 text-blue-400 hover:bg-blue-800 hover:text-white"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                            {e.statut === 'En attente' && (
                                                                <Link href={route('entretiens.edit', e.id)}>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="border-green-600 bg-green-900/20 text-green-400 hover:bg-green-800 hover:text-white"
                                                                    >
                                                                        <SquarePen className="h-4 w-4" />
                                                                    </Button>
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={9} className="py-12 text-center">
                                                    <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                                                        <Wrench className="h-12 w-12 text-gray-600" />
                                                        <p className="text-lg font-medium text-white">Aucun entretien trouvé</p>
                                                        <p className="text-sm">Ajustez vos filtres ou créez un nouvel entretien</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            /* Vue Grille (Tous les utilisateurs) */
                            <div className="p-6">
                                {filteredEntretiens.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                                        {filteredEntretiens.map((e) => {
                                            const totalCout = getTotalCost(e.id);

                                            return (
                                                <Card key={e.id} className="group transition-all duration-300 hover:shadow-2xl border border-gray-700 bg-gray-800/80 backdrop-blur-sm hover:bg-gray-750">
                                                    <CardHeader className="pb-4">
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <CardTitle className="flex items-center gap-2 text-lg text-white">
                                                                    <Car className="h-5 w-5 text-blue-400" />
                                                                    {e.vehicule?.immatriculation ?? '-'}
                                                                </CardTitle>
                                                                <CardDescription className="mt-1 text-gray-400">
                                                                    Par {e.user?.name ?? 'Utilisateur inconnu'}
                                                                </CardDescription>
                                                            </div>
                                                            <Badge
                                                                variant={
                                                                    e.statut === 'Validé'
                                                                        ? 'default'
                                                                        : e.statut === 'En attente'
                                                                          ? 'secondary'
                                                                          : 'outline'
                                                                }
                                                                className={
                                                                    e.statut === 'Validé'
                                                                        ? 'bg-green-900/40 text-green-300 border border-green-800/50'
                                                                        : e.statut === 'En attente'
                                                                          ? 'bg-yellow-900/40 text-yellow-300 border border-yellow-800/50'
                                                                          : 'bg-blue-900/40 text-blue-300 border border-blue-800/50'
                                                                }
                                                            >
                                                                {e.statut}
                                                            </Badge>
                                                        </div>
                                                    </CardHeader>

                                                    <CardContent className="space-y-4">
                                                        <div>
                                                            <h4 className="font-medium text-gray-300">Problème</h4>
                                                            <p className="mt-1 line-clamp-2 text-sm text-gray-400">{e.probleme}</p>
                                                        </div>

                                                        {e.prochaine_visite && (
                                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                                <Calendar className="h-4 w-4" />
                                                                Prochaine visite: {e.prochaine_visite}
                                                            </div>
                                                        )}

                                                        <div className="flex items-center justify-between border-t border-gray-700 pt-4">
                                                            <div>
                                                                <p className="text-sm text-gray-400">Coût total</p>
                                                                <p className="text-lg font-bold text-white">
                                                                    {totalCout.toLocaleString('fr-FR')} MGA
                                                                </p>
                                                            </div>

                                                            {(user.role === 'admin' || user.role === 'mecanicien') && (
                                                                <Link href={route('entretiens.show', e.id)}>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="border-blue-600 bg-blue-900/20 text-blue-400 hover:bg-blue-800 hover:text-white"
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <Wrench className="h-16 w-16 text-gray-600" />
                                        <h3 className="mt-4 text-lg font-medium text-white">Aucun entretien trouvé</h3>
                                        <p className="mt-2 text-gray-400">Aucun entretien ne correspond à vos critères de recherche.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}