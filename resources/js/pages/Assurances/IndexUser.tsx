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
        if (joursRestants <= 7) return 'warning';
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8">
            <div className="mx-auto max-w-7xl">
                {/* 🔔 Notification */}
                {flash?.message && (
                    <div className="mb-8">
                        <Alert className="border-blue-200 bg-blue-50/80 backdrop-blur-sm">
                            <BellDot className="h-5 w-5 text-blue-600" />
                            <AlertTitle className="font-semibold text-blue-800">Notification</AlertTitle>
                            <AlertDescription className="text-blue-700">{flash.message}</AlertDescription>
                        </Alert>
                    </div>
                )}

                {/* Statistiques rapides */}
                {assurances?.length > 0 && (
                    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <Card className="bg-white/80 backdrop-blur-sm">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-green-100 p-2">
                                        <ShieldCheck className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-600">Total des assurances</p>
                                        <p className="text-2xl font-bold text-slate-800">{assurances.length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 backdrop-blur-sm">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-blue-100 p-2">
                                        <Car className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-600">Véhicules assurés</p>
                                        <p className="text-2xl font-bold text-slate-800">{new Set(assurances.map((a) => a.vehicule_id)).size}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 backdrop-blur-sm">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-amber-100 p-2">
                                        <Clock className="h-5 w-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-600">Bientôt expirés</p>
                                        <p className="text-2xl font-bold text-slate-800">
                                            {assurances.filter((a) => a.jour_restant <= 14 && a.jour_restant > 0).length}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* 🧾 Liste des assurances */}
                <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                    {assurances?.length > 0 ? (
                        assurances.map((assurance) => {
                            const vehiculeInfo = vehicule.find((v) => v.id === assurance.vehicule_id);
                            return (
                                <Card
                                    key={assurance.id}
                                    className="group relative overflow-hidden border-slate-200 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50"
                                >
                                    <CardHeader className="pb-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-xl bg-blue-50 p-2">
                                                    <ShieldCheck className="h-6 w-6 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-slate-800">
                                                        {vehiculeInfo?.immatriculation || 'Véhicule inconnu'}
                                                    </h3>
                                                    <p className="text-sm text-slate-500">Contrat: {assurance.NumContrat}</p>
                                                </div>
                                            </div>

                                            {/* Badge statut */}
                                            <Badge variant={getStatusColor(assurance.jour_restant)} className="flex items-center gap-1">
                                                {getStatusIcon(assurance.jour_restant)}
                                                {getStatusText(assurance.jour_restant)}
                                            </Badge>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        {/* Informations principales */}
                                        <div className="grid grid-cols-1 gap-3">
                                            <div className="flex items-center gap-3 rounded-lg bg-slate-50/80 p-3">
                                                <div className="rounded-lg bg-purple-100 p-1.5">
                                                    <ShieldCheck className="h-4 w-4 text-purple-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-medium text-slate-500">Compagnie</p>
                                                    <p className="font-medium text-slate-800">{assurance.NomCompagnie}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 rounded-lg bg-slate-50/80 p-3">
                                                <div className="rounded-lg bg-green-100 p-1.5">
                                                    <DollarSign className="h-4 w-4 text-green-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-medium text-slate-500">Coût</p>
                                                    <p className="font-medium text-slate-800">{assurance.cout.toLocaleString()} MGA</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="flex items-center gap-3 rounded-lg bg-slate-50/80 p-3">
                                                    <div className="rounded-lg bg-blue-100 p-1.5">
                                                        <CalendarDays className="h-4 w-4 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-medium text-slate-500">Début</p>
                                                        <p className="text-sm font-medium text-slate-800">{assurance.dateDebut}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 rounded-lg bg-slate-50/80 p-3">
                                                    <div className="rounded-lg bg-red-100 p-1.5">
                                                        <CalendarDays className="h-4 w-4 text-red-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-medium text-slate-500">Fin</p>
                                                        <p className="text-sm font-medium text-slate-800">{assurance.dateFin}</p>
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
                                                    className="flex items-center gap-2 border-slate-300 hover:bg-slate-50"
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
                            <Card className="border-dashed border-slate-300 bg-white/50">
                                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                    <ShieldCheck className="mb-4 h-12 w-12 text-slate-400" />
                                    <h3 className="mb-2 text-lg font-semibold text-slate-600">Aucune assurance trouvée</h3>
                                    <p className="text-slate-500">Commencez par ajouter votre première police d'assurance.</p>
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
