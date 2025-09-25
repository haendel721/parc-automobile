import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Link, usePage } from '@inertiajs/react';
import { BellDot, SquarePen } from 'lucide-react';
import React from 'react';
import { route } from 'ziggy-js';

type assurances = {
    id: number;
    assurance_id: number;
    NomCompagnie: string;
    NumContrat: string;
    cout: number;
    dateDebut: string;
    dateFin: string;
    duree_jours: number;
};

type AssuranceProps = {
    assurances: assurances[];
};

const IndexUser: React.FC<AssuranceProps> = ({ assurances }) => {
    // ⚡️ récupérer flash uniquement depuis Inertia
    const { flash } = usePage().props as { flash: { message?: string } };

    console.log('assurances reçues :', assurances);

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

            {assurances?.map((assurance, index) => (
                <div key={assurance.id} className="container mx-auto max-w-7xl space-y-6">
                    <div className="justify flex gap-2">
                        <div className="mb-2 text-lg font-bold text-blue-500">Assurance n°{index + 1}</div>
                        <div className="mb-2 text-lg font-bold text-blue-500">
                            <Link href={route('assurances.edit', assurance.id)}>
                                <Button className="bg-black-75 text-color hover:bg-slate-700">
                                    <SquarePen /> modifier
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="m-6 flex flex-col rounded-lg bg-zinc-900 p-6 shadow-sm md:flex-row">
                        <div className="w-full gap-5 space-y-4 md:w-3/5">
                            <h2 className="text-xl font-bold text-white">Identifiant du contrat : {assurance.NumContrat}</h2>
                            <div className="grid grid-cols-1 gap-4 text-sm text-white sm:grid-cols-2 md:grid-cols-3">
                                <div>
                                    <span className="font-semibold">Compagnie : </span> {assurance.NomCompagnie}
                                </div>
                                <div >
                                    <div>
                                        <span className="font-semibold">Coût :</span> {assurance.cout}
                                    </div>
                                </div>
                                <div>
                                    <span className="font-semibold">Date de début :</span> {assurance.dateDebut}
                                </div>
                                <div>
                                    <span className="font-semibold">Date de fin :</span> {assurance.dateFin}
                                </div>
                            </div>
                        </div>
                        <div className="items w-full justify-items-center space-y-2 pt-4 md:w-1/5 md:pt-0 md:text-center">
                            <span>Reste </span>
                            {assurance.duree_jours} jours
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};

export default IndexUser;
