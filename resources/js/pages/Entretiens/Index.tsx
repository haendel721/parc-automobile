import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import clsx from 'clsx';
import { BellDot, Eye, Search, SquarePen } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Entretien', href: '/entretiens' }];

interface vehicule {
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

    // Fonction pour trouver le nom du mécanicien correspondant
    const getMecanicienName = (id: number) => T_user.find((u) => u.id === id)?.name || 'Non assigné';

    const entretiensFiltres = entretiens.filter((e) => {
        if (user.role === 'admin') return true;
        if (user.role === 'mecanicien') return e.mecanicien_id === user.id;
        return e.user_id === user.id;
    });
    const [searchTerm, setSearchTerm] = useState('');

    // 🔍 Filtrage dynamique
    const filteredEntretiens = entretiens.filter(
        (v) => 
            v.statut.toLowerCase().includes(searchTerm.toLowerCase()) 
    );
    // console.log('entretiens', entretiens.map(e=>e.statut));
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Entretiens" />

            <div className="m-4 flex items-center justify-between">
                <h1 className="text font-bold text-gray-800">Historique des entretiens et des réparations</h1>
                <Link href={route('entretiens.create')}>
                    <Button className="bg-green-600 hover:bg-green-700">+ Nouvel demande</Button>
                </Link>
            </div>

            {/* Message flash */}
            {flash.message && (
                <div className="m-4">
                    <Alert>
                        <BellDot className="h-5 w-5" />
                        <AlertTitle>Notification</AlertTitle>
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                </div>
            )}

            {/* Table des entretiens */}
            {user.role === 'admin' ? (
                <>
                    <div className="m-4">
                        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-xl">
                            {/* HEADER + BARRE DE RECHERCHE */}
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-800">Liste des entretiens</h2>
                                <div className="relative w-64">
                                    <Search className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Recherche par statut..."
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
                                            <TableHead>Véhicule</TableHead>
                                            <TableHead>Conducteur</TableHead>
                                            <TableHead>Mécanicien</TableHead>
                                            <TableHead>Problème</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Prochaine visite</TableHead>
                                            <TableHead>Coût total (MGA)</TableHead>
                                            <TableHead>Statut</TableHead>
                                            <TableHead className="text-center">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {filteredEntretiens.length > 0 ? (
                                            filteredEntretiens.map((e, i) => (
                                                <TableRow
                                                    key={e.id}
                                                    className={clsx(
                                                        'transition-all',
                                                        i % 2 === 0 ? 'bg-white' : 'bg-gray-50',
                                                        e.statut === 'Validé' && 'border-l-4 border-l-green-500',
                                                        e.statut === 'En attente' && 'border-l-4 border-l-yellow-500',
                                                        e.statut === 'Terminé' && 'border-l-4 border-l-blue-500',
                                                        'hover:bg-blue-50',
                                                    )}
                                                >
                                                    <TableCell>{e.vehicule?.immatriculation ?? '-'}</TableCell>
                                                    <TableCell>{e.user?.name ?? 'Utilisateur inconnu'}</TableCell>
                                                    <TableCell>{getMecanicienName(e.mecanicien_id)}</TableCell>
                                                    <TableCell>{e.probleme}</TableCell>
                                                    <TableCell>{e.description}</TableCell>
                                                    <TableCell>{e.prochaine_visite ?? '-'}</TableCell>
                                                    <TableCell>
                                                        {frais
                                                            .filter((f) => f.entretien_id === e.id)
                                                            .map((f, index) => (
                                                                <div key={index}>
                                                                    {f.montant.toLocaleString('fr-FR', { style: 'currency', currency: 'MGA' })}
                                                                </div>
                                                            ))}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            className={clsx(
                                                                'px-2 py-1 text-sm font-semibold',
                                                                e.statut === 'Validé' && 'bg-green-100 text-green-700',
                                                                e.statut === 'En attente' && 'bg-yellow-100 text-yellow-700',
                                                                e.statut === 'Terminé' && 'bg-blue-100 text-blue-700',
                                                            )}
                                                        >
                                                            {e.statut}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="flex justify-center gap-2">
                                                            <Link href={route('entretiens.show', e.id)}>
                                                                <Button className="rounded-full bg-slate-600 p-2 hover:bg-slate-700">
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                            {e.statut === 'En attente' && (
                                                                <Link href={route('entretiens.edit', e.id)}>
                                                                    <Button className="rounded-full bg-blue-600 p-2 hover:bg-blue-700">
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
                                                <TableCell colSpan={9} className="py-6 text-center text-gray-500">
                                                    Aucun entretien trouvé.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="m-4">
                        {entretiensFiltres.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {entretiensFiltres.map((e) => {
                                    // Couleur du badge selon le statut
                                    let statutColor = '';
                                    if (e.statut === 'Validé') statutColor = 'bg-green-100 text-green-800';
                                    else if (e.statut === 'En attente') statutColor = 'bg-yellow-100 text-yellow-800';
                                    else if (e.statut === 'Terminé') statutColor = 'bg-blue-100 text-blue-800';

                                    const totalCout = frais.filter((f) => f.entretien_id === e.id).reduce((total, f) => total + f.montant, 0);
                                    const piecesData = pieces ?? [];
                                    const piecesUtilisees = piecesData.filter((p) => p.entretien_id === e.id);

                                    return (
                                        <div
                                            key={e.id}
                                            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl"
                                        >
                                            <div className="mb-4 flex items-center justify-between">
                                                <h2 className="text-lg font-semibold text-gray-800">{e.vehicule?.immatriculation ?? '-'}</h2>
                                                <span className={`rounded-full px-3 py-1 text-sm font-semibold ${statutColor}`}>{e.statut}</span>
                                            </div>

                                            <div className="mb-4 grid grid-cols-1 gap-2 text-sm text-gray-700">
                                                <div className="flex justify-between">
                                                    <span className="font-medium">Problème :</span>
                                                    <span>{e.probleme}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium">Description :</span>
                                                    <span>{e.description}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium">Prochaine visite :</span>
                                                    <span>{e.prochaine_visite ?? '-'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="font-medium">Coût total :</span>
                                                    <span className="font-semibold text-gray-900">
                                                        {totalCout.toLocaleString('fr-FR', { style: 'currency', currency: 'MGA' })}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Pièces utilisées */}
                                            {piecesUtilisees.length > 0 && (
                                                <div className="mb-4">
                                                    <h3 className="mb-2 font-medium text-gray-800">Pièces utilisées :</h3>
                                                    <ul className="max-h-32 list-inside list-disc overflow-y-auto text-sm text-gray-600">
                                                        {piecesUtilisees.map((p) => (
                                                            <li key={p.id} className="flex justify-between">
                                                                <span>
                                                                    {p.nom} x {p.quantite}
                                                                </span>
                                                                <span>
                                                                    {p.prix.toLocaleString('fr-FR', { style: 'currency', currency: 'MGA' })} MGA
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {user.role !== 'admin' && user.role !== 'mecanicien' ? (
                                                ''
                                            ) : (
                                                <>
                                                    <div className="flex justify-end">
                                                        <Link href={route('entretiens.show', e.id)}>
                                                            <Button className="flex items-center gap-1 bg-sky-600 text-white hover:bg-sky-700">
                                                                Voir <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-center text-lg text-gray-500">Aucun entretien trouvé.</p>
                        )}
                    </div>
                </>
            )}
        </AppLayout>
    );
}
