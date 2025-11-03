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
        title: 'Accueil',
        href: '/dashboard',
    },
    {
        title: 'Plein Carburant',
        href: '/pleinCarburants',
    },
];

type pleinCarburant = {
    id: number;
    vehicule_id: number;
    user_id: number;
    date_plein: string;
    quantite: number;
    prix_unitaire: number;
    montant_total: number;
    station: string;
};
type Vehicules = {
    id: number;
    immatriculation: string;
    marque_id: number;
    modele: string;
    typeVehicule_id: number;
    couleur: string;
    carburant_id: number;
    numSerie: string;
    anneeFabrication: number;
    dateAcquisition: string;
    photo: string;
    user_id: number;
    kilometrique: number;
};
type PageProps = {
    flash: {
        message?: string;
    };
    pleinCarburant: pleinCarburant[];
    user: {
        id: number;
        role: string;
        name: string;
    };
    T_user: {
        id: number;
        role: string;
        name: string;
    }[];
    vehicules: Vehicules[];
};

export default function Index() {
    const { user, pleinCarburant, flash, vehicules, T_user, montantTotal, Quantite } = usePage<PageProps>().props;
    const { processing, delete: destroy } = useForm();
    const handleDelete = (id: number) => {
        if (confirm(`Êtes-vous sûr de vouloir le supprimer ?`)) {
            console.log('id ', id);
            destroy(route('pleinCarburant.destroy', id));
        }
    };
    // État pour la recherche
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState<'utilisateur' | 'immatriculation' | 'station' | 'quantite' | 'montant' | 'date'>(
        'immatriculation',
    );

    const [searchTermTotal, setSearchTermTotal] = useState('');
    const [searchFieldTotal, setSearchFieldTotal] = useState<'immatriculation'>('immatriculation');
    const [quantityOperator, setQuantityOperator] = useState<'>' | '<'>('>');
    const [quantityValue, setQuantityValue] = useState<number | ''>('');
    const [weekStart, setWeekStart] = useState<string>(''); // date début semaine YYYY-MM-DD
    const [weekEnd, setWeekEnd] = useState<string>(''); // date fin semaine YYYY-MM-DD

    // Filtrage combiné : station OU immatriculation du véhicule
    const filteredPleinCarburant = pleinCarburant.filter((pc) => {
        const pcDate = new Date(pc.date_plein);

        let matchesWeek = true;
        if (weekStart && weekEnd) {
            const start = new Date(weekStart);
            const end = new Date(weekEnd);
            matchesWeek = pcDate >= start && pcDate <= end;
        }

        // Applique les autres filtres existants
        const search = searchTerm.toLowerCase().trim();
        let matchesSearch = true;
        if (searchField === 'station') {
            matchesSearch = pc.station.toLowerCase().includes(search);
        } else if (searchField === 'immatriculation') {
            matchesSearch = vehicules.some((v) => v.id === pc.vehicule_id && v.immatriculation.toLowerCase().includes(search));
        } else if (searchField === 'utilisateur') {
            matchesSearch = T_user.some((u) => u.id === pc.user_id && u.name.toLowerCase().includes(search));
        } else if (searchField === 'quantite') {
            if (quantityValue !== '') {
                matchesSearch = quantityOperator === '>' ? pc.quantite > quantityValue : pc.quantite < quantityValue;
            }
        } else if (searchField === 'montant') {
            if (quantityValue !== '') {
                matchesSearch = quantityOperator === '>' ? pc.montant_total > quantityValue : pc.montant_total < quantityValue;
            }
        }

        return matchesWeek && matchesSearch;
    });
    const getActiveFilterText = () => {
        if (searchField === 'date' && weekStart && weekEnd) {
            return `Période : ${new Date(weekStart).toLocaleDateString('fr-FR')} - ${new Date(weekEnd).toLocaleDateString('fr-FR')}`;
        }
        if (searchField === 'quantite' && quantityValue) {
            return `Quantité ${quantityOperator === '>' ? 'supérieure à' : 'inférieure à'} ${quantityValue}L`;
        }
        if (searchField === 'montant' && quantityValue) {
            return `Montant ${quantityOperator === '>' ? 'supérieur à' : 'inférieur à'} ${quantityValue} Ar`;
        }
        if (searchTerm) {
            return `${searchField} : ${searchTerm}`;
        }
        return '';
    };

    // recherche dans le tableau top
    const filteredVehicules = vehicules.filter((v) => {
        // const search = searchTermTotal.toLowerCase().trim();
        if (searchFieldTotal === 'immatriculation') {
            return v.immatriculation.toLowerCase().includes(searchTermTotal.toLowerCase());
        }

        return true;
    });

    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Plein Carburant" />
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
                    <div className="">
                        {/* HEADER + BARRE DE RECHERCHE */}
                        <div className="mb-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                {/* Titre */}
                                <div className="flex items-center gap-3">
                                    <div>
                                        <Link href={route('pleinCarburant.create')}>
                                            <Button className="bg-blue-500 hover:bg-blue-600">
                                                <CirclePlus className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">Liste des véhicules avec dépenses de carburant</h2>
                                    </div>
                                </div>

                                {/* Contrôles de recherche */}
                                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                                    {/* Sélecteur de champ */}
                                    <div className="relative min-w-[160px]">
                                        <select
                                            value={searchFieldTotal}
                                            onChange={(e) => setSearchFieldTotal(e.target.value as any)}
                                            className="w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm text-gray-700 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        >
                                            <option value="immatriculation">Immatriculation</option>
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
                                                placeholder={`${searchFieldTotal}...`}
                                                value={searchTermTotal}
                                                onChange={(e) => setSearchTermTotal(e.target.value)}
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
                            {searchTermTotal && (
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
                                        Filtre actif : Recherche par {searchFieldTotal} - "{searchTermTotal}"
                                    </div>
                                    <button
                                        onClick={() => setSearchTermTotal('')}
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
                                        <TableHead>
                                            <div className="flex items-center gap-2">
                                                <svg className="h-4 w-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                                                    />
                                                </svg>
                                                Immatriculation
                                            </div>
                                        </TableHead>
                                        {user.role === 'admin' && (
                                            <TableHead>
                                                <div className="flex items-center gap-2">
                                                    <svg className="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                        />
                                                    </svg>
                                                    Utilisateur
                                                </div>
                                            </TableHead>
                                        )}
                                        <TableHead>
                                            <div className="flex items-center gap-2">
                                                <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                                                    />
                                                </svg>
                                                Quantité totale
                                            </div>
                                        </TableHead>
                                        <TableHead>
                                            <div className="flex items-center gap-2">
                                                <svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                                    />
                                                </svg>
                                                Montant total
                                            </div>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {filteredVehicules.length > 0 ? (
                                        filteredVehicules.map((v, i) => {
                                            const item = montantTotal.find((mt) => mt.vehicule_id === v.id);
                                            const itemQ = Quantite.find((q) => q.vehicule_id === v.id);
                                            return (
                                                <TableRow
                                                    key={v.id}
                                                    className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} transition hover:bg-blue-50`}
                                                >
                                                    <TableCell className="font-medium">{v.immatriculation}</TableCell>
                                                    {user.role === 'admin' && (
                                                        <TableCell>{T_user.map((Tu) => (Tu.id === v.user_id ? Tu.name : ''))}</TableCell>
                                                    )}
                                                    <TableCell>{itemQ ? itemQ.Quantite : '0'} L</TableCell>
                                                    <TableCell>{item ? item.totalMontant.toLocaleString('fr-FR') : '0'} Ar</TableCell>
                                                </TableRow>
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={user.role === 'admin' ? 5 : 4} className="py-8 text-center">
                                                <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                                                    <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                        />
                                                    </svg>
                                                    <p className="text-lg font-medium">Aucun véhicule trouvé</p>
                                                    <p className="text-sm">Aucun résultat ne correspond à votre recherche</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
                <div className="p-2">
                    <div className="">
                        {/* HEADER + BARRE DE RECHERCHE */}
                        <div className="mb-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
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
                                        <h2 className="text-xl font-bold text-gray-900">Historique de pleins carburants</h2>
                                        <p className="text-sm text-gray-500">Gérez et consultez les données de consommation</p>
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
                                            <option value="immatriculation">Immatriculation</option>
                                            <option value="utilisateur">Utilisateur</option>
                                            <option value="station">Station</option>
                                            <option value="quantite">Quantité</option>
                                            <option value="montant">Montant</option>
                                            <option value="date">Date</option>
                                        </select>
                                        <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 transform">
                                            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Champ de recherche dynamique */}
                                    <div className="min-w-[280px] flex-1">
                                        {searchField === 'quantite' || searchField === 'montant' ? (
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
                                        ) : searchField === 'date' ? (
                                            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
                                                <div className="flex flex-1 items-center gap-2">
                                                    <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                    <input
                                                        type="date"
                                                        value={weekStart}
                                                        onChange={(e) => setWeekStart(e.target.value)}
                                                        className="flex-1 border-0 bg-transparent text-sm focus:ring-0 focus:outline-none"
                                                    />
                                                </div>
                                                <span className="text-sm text-gray-400">à</span>
                                                <div className="flex flex-1 items-center gap-2">
                                                    <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                    <input
                                                        type="date"
                                                        value={weekEnd}
                                                        onChange={(e) => setWeekEnd(e.target.value)}
                                                        className="flex-1 border-0 bg-transparent text-sm focus:ring-0 focus:outline-none"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder={` ${searchField}...`}
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
                            {(searchTerm || quantityValue || weekStart) && (
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
                                        Filtre actif : {getActiveFilterText()}
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setQuantityValue(0);
                                            setWeekStart('');
                                            setWeekEnd('');
                                        }}
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
                                        <TableHead>id</TableHead>
                                        <TableHead>
                                            <div className="flex items-center gap-2">
                                                <svg className="h-4 w-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                                                    />
                                                </svg>
                                                Véhicule
                                            </div>
                                        </TableHead>
                                        <TableHead>
                                            <div className="flex items-center gap-2">
                                                <svg className="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                    />
                                                </svg>
                                                Utilisateur
                                            </div>
                                        </TableHead>
                                        <TableHead>
                                            <div className="flex items-center gap-2">
                                                <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                                Date
                                            </div>
                                        </TableHead>
                                        <TableHead>
                                            <div className="flex items-center gap-2">
                                                <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                                                    />
                                                </svg>
                                                Quantité
                                            </div>
                                        </TableHead>
                                        <TableHead>
                                            <div className="flex items-center gap-2">
                                                <svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                                Prix par litre{' '}
                                            </div>
                                        </TableHead>
                                        <TableHead>
                                            <div className="flex items-center gap-2">
                                                <svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                                    />
                                                </svg>
                                                Montant (Ar/L)
                                            </div>
                                        </TableHead>
                                        <TableHead>
                                            <div className="flex items-center">
                                                <svg className="h-4 w-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                </svg>
                                                Station
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-center">Action</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {filteredPleinCarburant.length > 0 ? (
                                        filteredPleinCarburant.map((pc, i) => (
                                            <TableRow
                                                key={pc.id}
                                                className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} transition hover:bg-blue-50`}
                                            >
                                                <TableCell className="font-medium">{pc.id}</TableCell>
                                                <TableCell>{vehicules.map((v) => (v.id === pc.vehicule_id ? v.immatriculation : ''))}</TableCell>

                                                <TableCell>{T_user.map((users) => (users.id === pc.user_id ? users.name : ''))}</TableCell>
                                                <TableCell>{pc.date_plein}</TableCell>
                                                <TableCell>{pc.quantite}</TableCell>
                                                <TableCell>{pc.prix_unitaire}</TableCell>
                                                <TableCell>{pc.montant_total}</TableCell>
                                                <TableCell>{pc.station}</TableCell>

                                                <TableCell className="text-center">
                                                    <div className="flex justify-center gap-2">
                                                        <Button
                                                            disabled={processing}
                                                            onClick={() => handleDelete(pc.id)}
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
                                            <TableCell colSpan={user.role === 'admin' ? 5 : 4} className="flex items-center py-8 text-center">
                                                <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                                                    <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                        />
                                                    </svg>
                                                    <p className="text-lg font-medium">Aucun véhicule trouvé</p>
                                                    <p className="text-sm">Aucun résultat ne correspond à votre recherche</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
