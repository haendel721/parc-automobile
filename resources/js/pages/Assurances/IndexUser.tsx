import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Link, usePage } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, BellDot, CalendarDays, Car, CirclePlus, Clock, DollarSign, ShieldCheck, SquarePen } from 'lucide-react';
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

    const getStatusColor = (joursRestants: number) => {
        if (joursRestants === -1) return 'destructive';
        if (joursRestants <= 7) return 'secondary';
        if (joursRestants <= 30) return 'secondary';
        return 'success';
    };

    const getStatusIcon = (joursRestants: number) => {
        if (joursRestants === -1) return <AlertTriangle className="h-3 w-3" />;
        if (joursRestants <= 7) return <Clock className="h-3 w-3" />;
        return <ShieldCheck className="h-3 w-3" />;
    };

    const getStatusText = (joursRestants: number) => {
        if (joursRestants === -1) return 'Expiré';
        if (joursRestants === 0) return 'Dernier jour';
        if (joursRestants === 1) return '1 jour restant';
        return `${joursRestants} jours restants`;
    };

    return (
        <div className="min-h-screen  px-4 py-8">
            <div className="mx-auto max-w-7xl">
                {/* 🔔 Notification */}
                {flash?.message && (
                    <div className="mb-8">
                        <Alert className="border-blue-500/30 bg-blue-900/20 backdrop-blur-xl">
                            <BellDot className="h-5 w-5 text-blue-400" />
                            <AlertTitle className="font-semibold text-blue-200">Notification</AlertTitle>
                            <AlertDescription className="text-blue-100">{flash.message}</AlertDescription>
                        </Alert>
                    </div>
                )}

                {/* En-tête avec statistiques */}
                <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Gestion des Assurances</h1>
                        <p className="text-gray-400">Suivez et gérez toutes vos polices d'assurance</p>
                    </div>
                    
                    {assurances?.length > 0 && (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:w-auto lg:flex-1 lg:max-w-md">
                            <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-green-900/30 p-2">
                                            <ShieldCheck className="h-5 w-5 text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-400">Total des assurances</p>
                                            <p className="text-2xl font-bold text-white">{assurances.length}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-blue-900/30 p-2">
                                            <Car className="h-5 w-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-400">Véhicules assurés</p>
                                            <p className="text-2xl font-bold text-white">{new Set(assurances.map((a) => a.vehicule_id)).size}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-amber-900/30 p-2">
                                            <Clock className="h-5 w-5 text-amber-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-400">Bientôt expirées</p>
                                            <p className="text-2xl font-bold text-white">
                                                {assurances.filter((a) => a.jour_restant <= 14 && a.jour_restant > 0).length}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>

                {/* 🧾 Liste des assurances */}
                <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                    {assurances?.length > 0 ? (
                        assurances.map((assurance) => {
                            const vehiculeInfo = vehicule.find((v) => v.id === assurance.vehicule_id);
                            return (
                                <Card
                                    key={assurance.id}
                                    className="group relative overflow-hidden border-gray-700 bg-gray-800/50 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-gray-600"
                                >
                                    {/* Gradient accent */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    
                                    <CardHeader className="pb-4 relative z-10">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-xl bg-blue-900/30 p-2 backdrop-blur-sm">
                                                    <ShieldCheck className="h-6 w-6 text-blue-400" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-white">
                                                        {vehiculeInfo?.immatriculation || 'Véhicule inconnu'}
                                                    </h3>
                                                    <p className="text-sm text-gray-400">Contrat: {assurance.NumContrat}</p>
                                                </div>
                                            </div>

                                            {/* Badge statut */}
                                            <Badge variant={getStatusColor(assurance.jour_restant)} className="flex items-center gap-1 backdrop-blur-sm">
                                                {getStatusIcon(assurance.jour_restant)}
                                                {getStatusText(assurance.jour_restant)}
                                            </Badge>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-4 relative z-10">
                                        {/* Informations principales */}
                                        <div className="grid grid-cols-1 gap-3">
                                            <div className="flex items-center gap-3 rounded-lg bg-gray-700/50 p-3 backdrop-blur-sm border border-gray-600/50">
                                                <div className="rounded-lg bg-purple-900/30 p-1.5">
                                                    <ShieldCheck className="h-4 w-4 text-purple-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-medium text-gray-400">Compagnie</p>
                                                    <p className="font-medium text-white">{assurance.NomCompagnie}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 rounded-lg bg-gray-700/50 p-3 backdrop-blur-sm border border-gray-600/50">
                                                <div className="rounded-lg bg-green-900/30 p-1.5">
                                                    <DollarSign className="h-4 w-4 text-green-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-medium text-gray-400">Coût</p>
                                                    <p className="font-medium text-white">{assurance.cout.toLocaleString()} MGA</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div className="flex items-center gap-3 rounded-lg bg-gray-700/50 p-3 backdrop-blur-sm border border-gray-600/50">
                                                    <div className="rounded-lg bg-blue-900/30 p-1.5">
                                                        <CalendarDays className="h-4 w-4 text-blue-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-medium text-gray-400">Début</p>
                                                        <p className="text-sm font-medium text-white">{assurance.dateDebut}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 rounded-lg bg-gray-700/50 p-3 backdrop-blur-sm border border-gray-600/50">
                                                    <div className="rounded-lg bg-red-900/30 p-1.5">
                                                        <CalendarDays className="h-4 w-4 text-red-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-medium text-gray-400">Fin</p>
                                                        <p className="text-sm font-medium text-white">{assurance.dateFin}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex justify-end pt-2">
                                            <Link href={route('assurances.edit', assurance.id)}>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex items-center gap-2 border-gray-600 bg-gray-700/50 text-white hover:bg-gray-600 hover:text-white backdrop-blur-sm"
                                                >
                                                    <SquarePen className="h-4 w-4" />
                                                    Modifier
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    ) : (
                        <div className="col-span-full">
                            <Card className="border-dashed border-gray-600 bg-gray-800/30 backdrop-blur-xl">
                                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="rounded-full bg-gray-700/50 p-6 mb-6 backdrop-blur-sm">
                                        <ShieldCheck className="h-12 w-12 text-gray-500" />
                                    </div>
                                    <h3 className="mb-3 text-xl font-semibold text-gray-300">Aucune assurance trouvée</h3>
                                    <p className="text-gray-500 mb-6 max-w-sm">Commencez par ajouter votre première police d'assurance.</p>
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                        <CirclePlus className="h-4 w-4 mr-2" />
                                        Ajouter une assurance
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IndexUser;