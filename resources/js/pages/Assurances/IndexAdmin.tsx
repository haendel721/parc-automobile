import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import vehicules from '@/routes/vehicules';
import { Link, useForm, usePage } from '@inertiajs/react';
import { BellDot, CirclePlus, SquarePen, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { route } from 'ziggy-js';

type assurances = {
    id: number;
    vehicule_id: number;
    NomCompagnie: string;
    NumContrat: string;
    cout: number;
    dateDebut: string;
    dateFin: string;
    duree_jours: number;
    jour_restant: number;
    statut: string;
};
type vehicules = {
    id: number;
    immatriculation: string;
};
type AssuranceProps = {
    assurances: assurances[];
    vehicules: vehicules[];
    flash: {
        message?: string;
    };
};

const AssuranceAdmin: React.FC<AssuranceProps> = ({ assurances, vehicules }) => {
    const { flash } = usePage<AssuranceProps>().props;
    const { delete: destroy } = useForm();
    const handleDelete = (id: number, NumContrat: string) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer l'assurance qui a un numéro de contrat : ${NumContrat} ?`)) {
            destroy(route('assurances.destroy', id));
        }
    };
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState<'compagnie' | 'immatriculation' | 'cout' | 'jour restant' | 'dure'>('immatriculation');
    const [quantityOperator, setQuantityOperator] = useState<'>' | '<'>('>');
    const [quantityValue, setQuantityValue] = useState<number | ''>('');
    // États pour les filtres avancés
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedCompagnie, setSelectedCompagnie] = useState('');
    // 🔍 Filtrage dynamique
    const filteredAssurances = assurances.filter((a) => {
        const search = searchTerm.toLowerCase().trim();
        let matchesSearch = true;
        if (searchField === 'compagnie') {
            matchesSearch = a.NomCompagnie.toLowerCase().includes(search);
        } else if (searchField === 'immatriculation') {
            matchesSearch = vehicules.some((v) => v.id === a.vehicule_id && v.immatriculation.toLowerCase().includes(search));
        } else if (searchField === 'cout') {
            if (quantityValue !== '') {
                matchesSearch = quantityOperator === '>' ? a.cout > quantityValue : a.cout < quantityValue;
            }
        } else if (searchField === 'jour restant') {
            if (quantityValue !== '') {
                matchesSearch = quantityOperator === '>' ? a.jour_restant > quantityValue : a.jour_restant < quantityValue;
            }
        } else if (searchField === 'dure') {
            if (quantityValue !== '') {
                matchesSearch = quantityOperator === '>' ? a.duree_jours > quantityValue : a.duree_jours < quantityValue;
            }
        } else if (selectedStatus && a.statut === selectedStatus) {
            return true;
        }
        //  Filtre avancé : Statut
        let matchesStatus = true;
        if (selectedStatus) {
            matchesStatus = a.statut === selectedStatus;
        }

        //  Filtre avancé : Compagnie
        let matchesCompagnie = true;
        if (selectedCompagnie) {
            matchesCompagnie = a.NomCompagnie === selectedCompagnie;
        }

        // ✅ Retourner vrai seulement si toutes les conditions sont remplies
        return matchesSearch && matchesStatus && matchesCompagnie;
    });
    return (
        <>
            <div className="p-2">
                {flash?.message && (
                    <Alert className="bg-blue-900/20 border-blue-800 text-blue-200">
                        <BellDot className="text-blue-300" />
                        <AlertTitle className="text-blue-100">Notification !</AlertTitle>
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                )}
            </div>

            <div className="p-2">
                {assurances && assurances.length > 0 ? (
                    <div className="">
                        {/* HEADER + BARRE DE RECHERCHE */}
                        <div className="mb-4 rounded-2xl bg-gray-800 p-6 border border-gray-700">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                {/* Titre */}
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-blue-900/20 p-2">
                                        <Link href={route('assurances.create')}>
                                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                                <CirclePlus className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Liste des assurances</h2>
                                        <p className="text-sm text-gray-400">Gérez et consultez vos assurances</p>
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
                                            <option value="immatriculation">Immatriculation</option>
                                            <option value="compagnie">Compagnie</option>
                                            <option value="cout">Coût</option>
                                            <option value="jour restant">Jour restant</option>
                                            <option value="dure">Duré</option>
                                        </select>
                                        <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 transform">
                                            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Champ de recherche dynamique */}
                                    <div className="min-w-[280px] flex-1">
                                        {searchField === 'jour restant' || searchField === 'cout' || searchField === 'dure' ? (
                                            <div className="flex items-center gap-2 rounded-xl border border-gray-600 bg-gray-700 p-1">
                                                <select
                                                    value={quantityOperator}
                                                    onChange={(e) => setQuantityOperator(e.target.value as any)}
                                                    className="flex-1 cursor-pointer rounded-lg border-0 bg-transparent px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                                >
                                                    <option value=">">Supérieur à</option>
                                                    <option value="<">Inférieur à</option>
                                                    <option value="=">Égal à</option>
                                                    <option value="between">Entre</option>
                                                </select>
                                                <div className="h-6 w-px bg-gray-600"></div>
                                                <input
                                                    type="number"
                                                    placeholder="Valeur"
                                                    value={quantityValue}
                                                    onChange={(e) => setQuantityValue(Number(e.target.value))}
                                                    className="flex-1 rounded-lg border-0 bg-transparent px-3 py-2 text-sm text-white placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                                />
                                            </div>
                                        ) : (
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder={`${searchField}...`}
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="w-full rounded-xl border border-gray-600 bg-gray-700 px-4 py-2.5 pl-10 text-sm text-white transition-all duration-200 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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

                                    {/* Bouton filtre avancé */}
                                    <button
                                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                        className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                                            showAdvancedFilters || selectedStatus || selectedCompagnie
                                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                : 'border border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                                            />
                                        </svg>
                                        Filtres Avancés
                                        {(selectedStatus || selectedCompagnie) && (
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                                                {(selectedStatus ? 1 : 0) + (selectedCompagnie ? 1 : 0)}
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Indicateur de filtre actif */}
                            {(searchTerm || quantityValue || selectedStatus || selectedCompagnie) && (
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
                                        <span>Filtres actifs :</span>
                                        <div className="flex flex-wrap gap-2">
                                            {searchTerm && (
                                                <span className="rounded-full bg-blue-800/50 px-2 py-1 text-xs font-medium text-blue-200">
                                                    {searchField} : "{searchTerm}"
                                                </span>
                                            )}
                                            {quantityValue && (
                                                <span className="rounded-full bg-blue-800/50 px-2 py-1 text-xs font-medium text-blue-200">
                                                    {searchField} {quantityOperator} {quantityValue}
                                                </span>
                                            )}
                                            {selectedStatus && (
                                                <span className="rounded-full bg-green-800/50 px-2 py-1 text-xs font-medium text-green-300">
                                                    Statut : {selectedStatus}
                                                </span>
                                            )}
                                            {selectedCompagnie && (
                                                <span className="rounded-full bg-purple-800/50 px-2 py-1 text-xs font-medium text-purple-300">
                                                    Compagnie : {selectedCompagnie}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setSelectedStatus('');
                                            setSelectedCompagnie('');
                                        }}
                                        className="flex items-center gap-1 text-sm font-medium text-blue-400 hover:text-blue-300"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Tout effacer
                                    </button>
                                </div>
                            )}

                            {/* Panneau de filtres avancés */}
                            {showAdvancedFilters && (
                                <div className="mt-6 rounded-xl border border-gray-600 bg-gray-700 p-6">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-white">Filtres Avancés</h3>
                                        <button
                                            onClick={() => setShowAdvancedFilters(false)}
                                            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-600 hover:text-gray-200"
                                        >
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                                        {/* Filtre par statut */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-300">Statut de l'assurance</label>
                                            <select
                                                value={selectedStatus}
                                                onChange={(e) => setSelectedStatus(e.target.value)}
                                                className="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2.5 text-sm text-white transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            >
                                                <option value="">Tous les statuts</option>
                                                <option value="assure">Active</option>
                                                <option value="expire">Expirée</option>
                                                <option value="aucun">Pas de statut</option>
                                            </select>
                                        </div>

                                        {/* Filtre par compagnie */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-300">Compagnie d'assurance</label>
                                            <select
                                                value={selectedCompagnie}
                                                onChange={(e) => setSelectedCompagnie(e.target.value)}
                                                className="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2.5 text-sm text-white transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            >
                                                <option value="">Toutes les compagnies</option>
                                                {assurances.map((a: any) => (
                                                    <option key={a.id} value={a.NomCompagnie} className="bg-gray-800 text-white">
                                                        {a.NomCompagnie}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="mt-6 flex justify-end gap-3">
                                            <button
                                                onClick={() => {
                                                    setSelectedStatus('');
                                                    setSelectedCompagnie('');
                                                }}
                                                className="rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                                            >
                                                Réinitialiser
                                            </button>
                                            <button
                                                onClick={() => setShowAdvancedFilters(false)}
                                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            >
                                                Appliquer les filtres
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="overflow-x-auto rounded-lg">
                            <Table className="min-w-full rounded-xl border border-gray-700 bg-gray-800">
                                <TableHeader className="bg-blue-900/20 text-blue-300">
                                    <TableRow>
                                        <TableHead className="text-blue-200">Id</TableHead>
                                        <TableHead className="text-blue-200">Immatricule</TableHead>
                                        <TableHead className="text-blue-200">Compagnie</TableHead>
                                        <TableHead className="text-blue-200">Contrat</TableHead>
                                        <TableHead className="text-blue-200">Coût (Ar)</TableHead>
                                        <TableHead className="text-blue-200">Début</TableHead>
                                        <TableHead className="text-blue-200">Fin</TableHead>
                                        <TableHead className="text-blue-200">Durée</TableHead>
                                        <TableHead className="text-blue-200">Jour restant</TableHead>
                                        <TableHead className="text-center text-blue-200">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {filteredAssurances.length > 0 ? (
                                        filteredAssurances.map((assurance, i) => (
                                            <TableRow
                                                key={assurance.id}
                                                className={`${i % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700/50'} transition hover:bg-blue-900/20`}
                                            >
                                                <TableCell className="text-white">{assurance.id}</TableCell>
                                                <TableCell className="font-medium text-white">{assurance.vehicule?.immatriculation || '-'}</TableCell>
                                                <TableCell className="text-white">{assurance.NomCompagnie}</TableCell>
                                                <TableCell className="text-white">{assurance.NumContrat}</TableCell>
                                                <TableCell className="text-white">{assurance.cout}</TableCell>
                                                <TableCell className="text-white">{assurance.dateDebut}</TableCell>
                                                <TableCell className="text-white">{assurance.dateFin}</TableCell>
                                                <TableCell>
                                                    <span className="text-white">
                                                        {assurance.duree_jours} jours
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                                            assurance.jour_restant === 0
                                                                ? 'bg-red-900/50 text-red-300'
                                                                : assurance.jour_restant < 8
                                                                  ? 'bg-yellow-900/50 text-yellow-300'
                                                                  : 'bg-green-900/50 text-green-300'
                                                        }`}
                                                    >
                                                        {assurance.jour_restant === -1
                                                            ? 'Expiré'
                                                            : assurance.jour_restant === 0
                                                              ? 0
                                                              : assurance.jour_restant + ' Jour(s)'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex justify-center gap-2">
                                                        <Link href={route('assurances.edit', assurance.id)}>
                                                            <Button className="rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700">
                                                                <SquarePen size={16} />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            onClick={() => handleDelete(assurance.id, assurance.NumContrat)}
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
                                            <TableCell colSpan={9} className="py-6 text-center text-gray-400">
                                                Aucune assurance trouvée
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                ) : (
                    <p className="m-4 text-gray-400">Aucune assurance trouvée.</p>
                )}
            </div>
        </>
    );
};

export default AssuranceAdmin;