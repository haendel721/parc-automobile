import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link, useForm, usePage } from '@inertiajs/react';
import { BellDot, Search, SquarePen, Trash2 } from 'lucide-react';
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
};

type AssuranceProps = {
    assurances: assurances[];
    flash: {
        message?: string;
    };
};

const AssuranceAdmin: React.FC<AssuranceProps> = ({ assurances }) => {
    const { flash } = usePage<AssuranceProps>().props;
    const { delete: destroy } = useForm();
    const handleDelete = (id: number, NumContrat: string) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer l'assurance qui a un numéro de contrat : ${NumContrat} ?`)) {
            destroy(route('assurances.destroy', id));
        }
    };
    const [searchTerm, setSearchTerm] = useState('');

    // 🔍 Filtrage dynamique
    const filteredAssurances = assurances.filter(
        (v) => v.NomCompagnie.toLowerCase().includes(searchTerm.toLowerCase()) || v.NumContrat.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    return (
        <>
            <div className="m-4">
                {flash?.message && (
                    <Alert>
                        <BellDot />
                        <AlertTitle>Notification !</AlertTitle>
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                )}
            </div>

            <div className="m-4">
                {assurances && assurances.length > 0 ? (
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-xl">
                        {/* HEADER + BARRE DE RECHERCHE */}
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-800">Liste des assurances</h2>
                            <div className="relative w-64">
                                <Search className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher une assurance..."
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
                                        <TableHead>Immatricule</TableHead>
                                        <TableHead>Compagnie</TableHead>
                                        <TableHead>Contrat</TableHead>
                                        <TableHead>Coût (Ar)</TableHead>
                                        <TableHead>Début</TableHead>
                                        <TableHead>Fin</TableHead>
                                        <TableHead>Durée</TableHead>
                                        <TableHead>Jour restant</TableHead>
                                        <TableHead className="text-center">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {filteredAssurances.length > 0 ? (
                                        filteredAssurances.map((assurance, i) => (
                                            <TableRow
                                                key={assurance.id}
                                                className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} transition hover:bg-blue-50`}
                                            >
                                                <TableCell>{assurance.id}</TableCell>
                                                <TableCell className="font-medium">{assurance.vehicule?.immatriculation || '-'}</TableCell>
                                                <TableCell>{assurance.NomCompagnie}</TableCell>
                                                <TableCell>{assurance.NumContrat}</TableCell>
                                                <TableCell>{assurance.cout}</TableCell>
                                                <TableCell>{assurance.dateDebut}</TableCell>
                                                <TableCell>{assurance.dateFin}</TableCell>
                                                <TableCell>
                                                    <span
                                                        // className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                                        //     assurance.duree_jours < 8 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                                        // }`}
                                                    >
                                                        {assurance.duree_jours} jours
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                                            assurance.jour_restant < 8 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                                        }`}
                                                    >
                                                        {assurance.jour_restant} jours
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
                                            <TableCell colSpan={9} className="py-6 text-center text-gray-500">
                                                Aucune assurance trouvée
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                ) : (
                    <p className="m-4 text-gray-500">Aucune assurance trouvée.</p>
                )}
            </div>
        </>
    );
};

export default AssuranceAdmin;
