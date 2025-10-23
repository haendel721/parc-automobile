import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Link, usePage } from '@inertiajs/react';
import { BellDot, CalendarDays, DollarSign, ShieldCheck, SquarePen } from 'lucide-react';
import React from 'react';
import { route } from 'ziggy-js';

type assurances = {
    id: number;
    assurance_id: number;
    vehicule_id: number;
    NomCompagnie: string;
    NumContrat: string;
    cout: number;
    dateDebut: string;
    dateFin: string;
    duree_jours: number;
    jour_restant: number;
};
type vehicule = {
    id: number;
    immatriculation: string;
};
type AssuranceProps = {
    assurances: assurances[];
    flash: { message?: string };
    vehicule: vehicule[];
};

const IndexUser: React.FC<AssuranceProps> = ({ assurances }) => {
    const { flash, vehicule } = usePage<AssuranceProps>().props;
    return (
        <div className="mx-auto max-w-6xl px-4 py-8">
            {/* 🔔 Notification */}
            {flash?.message && (
                <div className="mb-6">
                    <Alert className="border-l-4 border-blue-500 bg-blue-50">
                        <BellDot className="text-blue-500" />
                        <AlertTitle className="font-semibold text-blue-800">Notification</AlertTitle>
                        <AlertDescription className="text-gray-700">{flash.message}</AlertDescription>
                    </Alert>
                </div>
            )}

            {/* 🧾 Liste des assurances */}

            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                {assurances?.map((assurance, index) => (
                    <div
                        key={assurance.id}
                        className="group relative overflow-hidden rounded-2xl bg-gray-500 from-slate-900 via-slate-800 to-slate-700 p-6 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                    >
                        {/* Bandeau supérieur */}
                        <div className="mb-4 flex items-center justify-between border-b border-slate-600 pb-3">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-blue-600/20 p-2">
                                    <ShieldCheck className="h-6 w-6 text-blue-400" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p>
                                            <span className="font-semibold text-gray-200">Assurance de </span>
                                            {vehicule.find((v) => v.id === assurance.vehicule_id)?.immatriculation || 'Inconnu'}
                                        </p>
                                    </div>
                                    <p className="text-sm text-gray-400">Contrat : {assurance.NumContrat}</p>
                                </div>
                            </div>
                        </div>

                        {/* Détails principaux */}
                        <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-blue-400" />
                                <p>
                                    <span className="font-semibold text-gray-200">Compagnie : </span>
                                    {assurance.NomCompagnie}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-green-400" />
                                <p>
                                    <span className="font-semibold text-gray-200">Coût : </span>
                                    {assurance.cout.toLocaleString()} MGA
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <CalendarDays className="h-4 w-4 text-yellow-400" />
                                <p>
                                    <span className="font-semibold text-gray-200">Début : </span>
                                    {assurance.dateDebut}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <CalendarDays className="h-4 w-4 text-red-400" />
                                <p>
                                    <span className="font-semibold text-gray-200">Fin : </span>
                                    {assurance.dateFin}
                                </p>
                            </div>
                        </div>

                        {/* Badge durée restante */}
                        <div className="absolute top-6 right-4 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white backdrop-blur-md">
                            ⏳ {assurance.jour_restant === -1 ? "Expiré" : (assurance.jour_restant === 0 ? 0 : assurance.jour_restant + " Jour(s)")}
                        </div>
                        <div className="mt-6 flex justify-center space-x-3">
                            {/* Bouton Modifier */}
                            <Link href={route('assurances.edit', assurance.id)}>
                                <Button className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-white transition hover:bg-blue-700">
                                    <SquarePen className="h-4 w-4" />
                                    <span className="text-sm">Modifier</span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IndexUser;
