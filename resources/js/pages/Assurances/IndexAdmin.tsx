import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link, usePage , useForm } from '@inertiajs/react';
import { BellDot, SquarePen, Trash2 } from 'lucide-react';
import React from 'react';
import { route } from 'ziggy-js';

type assurances = {
    id: number;
    vehicule_id: number;
    NomCompagnie: string;
    NumContrat: string;
    cout: number;
    dateDebut: string;
    dateFin: string;
    duree_jours: number
};

type AssuranceProps = {
    assurances: assurances[];
    flash: {
        message?: string;
    };
};


const AssuranceAdmin: React.FC<AssuranceProps> = ({ assurances }) => {
    const { flash } = usePage().props as AssuranceProps;
    const { delete: destroy } = useForm();
    const handleDelete = (id: number, NumContrat: string) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer l'assurance qui a un numéro de contrat : ${NumContrat} ?`)) {
            destroy(route('assurances.destroy', id));
        }
    };
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

            {assurances && assurances.length > 0 ? (
                <div className="m-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Id</TableHead>
                                <TableHead>Immatricule du Véhicule </TableHead>
                                <TableHead>Compagnie</TableHead>
                                <TableHead>Identifiant du Contrat</TableHead>
                                <TableHead>Coût (Ar)</TableHead>
                                <TableHead>Date début</TableHead>
                                <TableHead>Date fin</TableHead>
                                <TableHead>Durée (jours)</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {assurances.map((assurance) => (
                                <TableRow key={assurance.id}>
                                    <TableCell>{assurance.id}</TableCell>
                                    <TableCell>{assurance.vehicule?.immatriculation||'-'}</TableCell>
                                    <TableCell>{assurance.NomCompagnie}</TableCell>
                                    <TableCell>{assurance.NumContrat}</TableCell>
                                    <TableCell>{assurance.cout}</TableCell>
                                    <TableCell>{assurance.dateDebut}</TableCell>
                                    <TableCell>{assurance.dateFin}</TableCell>
                                    <TableCell>{assurance.duree_jours} jours</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center gap-2">
                                            <Link href={route('assurances.edit', assurance.id)}>
                                                <Button className="bg-slate-600 hover:bg-slate-700">
                                                    <SquarePen />
                                                </Button>
                                            </Link>
                                            <Button onClick={() => handleDelete(assurance.id , assurance.NumContrat)} className="bg-red-500 hover:bg-red-700">
                                                <Trash2 />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <p className="m-4 text-gray-500">Aucune assurance trouvée.</p>
            )}
        </>
    );
};

export default AssuranceAdmin;
