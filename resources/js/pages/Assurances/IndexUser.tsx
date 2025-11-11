import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Link, usePage } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, BellDot, CalendarDays, CirclePlus, Clock, DollarSign, ShieldCheck, SquarePen, Users, Zap } from 'lucide-react';
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

    const getStatusVariant = (joursRestants: number) => {
        if (joursRestants === -1) return 'destructive';
        if(joursRestants === 0 ) return 'destructive';
        if (joursRestants <= 7) return 'secondary';
        if (joursRestants <= 30) return 'default';
        return 'default';
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-MG', {
            style: 'currency',
            currency: 'MGA',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    // Calcul des statistiques
    const totalCost = assurances.reduce((sum, assurance) => sum + assurance.cout, 0);
    const expiredCount = assurances.filter((a) => a.jour_restant === -1).length;
    const expiringSoonCount = assurances.filter((a) => a.jour_restant <= 14 && a.jour_restant > 0).length;
    const activeCount = assurances.filter((a) => a.jour_restant > 14).length;

    return (
        <div className="min-h-screen px-4 py-8">
            <div className="max-w-9xl mx-auto">
                {/* 🔔 Notification */}
                {flash?.message && (
                    <div className="mb-8">
                        <Alert className="border-emerald-500/20 bg-emerald-500/10 shadow-lg backdrop-blur-xl">
                            <BellDot className="h-5 w-5 text-emerald-400" />
                            <AlertTitle className="font-semibold text-emerald-200">Succès</AlertTitle>
                            <AlertDescription className="text-emerald-100">{flash.message}</AlertDescription>
                        </Alert>
                    </div>
                )}

                {/* En-tête avec statistiques */}
                <div className="mb-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                        {/* Titre et description - Centré */}
                        <div className="flex flex-1 flex-col items-center text-center lg:items-start">
                            <h1 className="mb-3 bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-4xl font-bold text-transparent">
                                Gestion des Assurances
                            </h1>
                            <p className="max-w-2xl text-lg text-gray-400">Surveillance et gestion complète de vos polices d'assurance</p>
                        </div>

                        {/* Bouton Nouvelle assurance - Aligné à droite */}
                        <div className="flex lg:flex-1 lg:justify-end">
                            <Link href={route('assurances.create')}>
                                <Button className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transition-all duration-300 hover:from-blue-500 hover:to-blue-600 hover:shadow-xl">
                                    <CirclePlus className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                                    Nouvelle assurance
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Cartes statistiques */}
                    {assurances?.length > 0 && (
                        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:justify-between">
                            <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-xl">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="mb-2 text-sm font-medium text-blue-300">Total des assurances</p>
                                            <p className="text-3xl font-bold text-white">{assurances.length}</p>
                                        </div>
                                        <div className="rounded-2xl bg-blue-500/20 p-3">
                                            <ShieldCheck className="h-6 w-6 text-blue-400" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 backdrop-blur-xl">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="mb-2 text-sm font-medium text-emerald-300">Actives</p>
                                            <p className="text-3xl font-bold text-white">{activeCount}</p>
                                        </div>
                                        <div className="rounded-2xl bg-emerald-500/20 p-3">
                                            <Zap className="h-6 w-6 text-emerald-400" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-amber-600/10 backdrop-blur-xl">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="mb-2 text-sm font-medium text-amber-300">Bientôt expirées</p>
                                            <p className="text-3xl font-bold text-white">{expiringSoonCount}</p>
                                        </div>
                                        <div className="rounded-2xl bg-amber-500/20 p-3">
                                            <Clock className="h-6 w-6 text-amber-400" />
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
                            const isExpired = assurance.jour_restant === -1;
                            const isExpiringSoon = assurance.jour_restant <= 14 && assurance.jour_restant > 0;
                            const DernierJour = assurance.jour_restant === 0 ;
                            return (
                                <Card
                                    key={assurance.id}
                                    className={`group relative overflow-hidden border-2 backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${
                                        isExpired
                                            ? 'border-red-500/30 bg-red-500/5 hover:shadow-red-500/10'
                                            : isExpiringSoon
                                              ? 'border-amber-500/30 bg-amber-500/5 hover:shadow-amber-500/10'
                                              : DernierJour 
                                                          ? 'border-red-500/50 bg-red-800/20 hover:border-red-500/50 hover:shadow-blue-500/10' 
                                                          : 'border-gray-700/50 bg-gray-800/30 hover:border-gray-600/50 hover:shadow-blue-500/10'
                                    }`}
                                >
                                    {/* Gradient accent */}
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${
                                            isExpired
                                                ? 'from-red-500/10 to-pink-500/10'
                                                : isExpiringSoon
                                                  ? 'from-amber-500/10 to-orange-500/10'
                                                  : 'from-blue-500/10 to-purple-500/10'
                                        }`}
                                    />

                                    <CardHeader className="relative z-10 pb-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`rounded-2xl p-3 backdrop-blur-sm ${
                                                        isExpired ? 'bg-red-500/20' : isExpiringSoon ? 'bg-amber-500/20' : DernierJour 
                                                          ? 'bg-red-500/20 text-red-300' 
                                                          : 'bg-blue-500/20'
                                                    }`}
                                                >
                                                    <ShieldCheck
                                                        className={`h-6 w-6 ${
                                                            isExpired ? 'text-red-400' : isExpiringSoon ? 'text-amber-400' : DernierJour 
                                                          ? 'bg-red-500/20 text-red-300' 
                                                          : 'text-blue-400'
                                                        }`}
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-white">
                                                        {vehiculeInfo?.immatriculation || 'Véhicule inconnu'}
                                                    </h3>
                                                    <p className="text-sm text-gray-400">Contrat: {assurance.NumContrat}</p>
                                                </div>
                                            </div>

                                            {/* Badge statut */}
                                            <Badge
                                                variant={getStatusVariant(assurance.jour_restant)}
                                                className={`flex items-center gap-1.5 border-0 backdrop-blur-sm ${
                                                    isExpired
                                                        ? 'bg-red-500/20 text-red-300'
                                                        : isExpiringSoon
                                                          ? 'bg-amber-500/20 text-amber-300'
                                                          : DernierJour 
                                                          ? 'bg-red-500/20 text-red-300' 
                                                          :'bg-emerald-500/20 text-emerald-300'
                                                }`}
                                            >
                                                {getStatusIcon(assurance.jour_restant)}
                                                {getStatusText(assurance.jour_restant)}
                                            </Badge>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="relative z-10 space-y-4">
                                        {/* Informations principales */}
                                        <div className="grid grid-cols-1 gap-3">
                                            <div className="flex items-center gap-3 rounded-xl border border-gray-600/30 bg-gray-700/30 p-4 backdrop-blur-sm">
                                                <div className="rounded-xl bg-purple-500/20 p-2">
                                                    <Users className="h-4 w-4 text-purple-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">Compagnie</p>
                                                    <p className="font-semibold text-white">{assurance.NomCompagnie}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 rounded-xl border border-gray-600/30 bg-gray-700/30 p-4 backdrop-blur-sm">
                                                <div className="rounded-xl bg-green-500/20 p-2">
                                                    <DollarSign className="h-4 w-4 text-green-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">Coût</p>
                                                    <p className="font-semibold text-white">{formatCurrency(assurance.cout)}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                <div className="flex items-center gap-3 rounded-xl border border-gray-600/30 bg-gray-700/30 p-3 backdrop-blur-sm">
                                                    <div className="rounded-xl bg-blue-500/20 p-2">
                                                        <CalendarDays className="h-4 w-4 text-blue-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">Début</p>
                                                        <p className="text-sm font-semibold text-white">{formatDate(assurance.dateDebut)}</p>
                                                    </div>
                                                </div>

                                                <div
                                                    className={`flex items-center gap-3 rounded-xl border p-3 backdrop-blur-sm ${
                                                        isExpired
                                                            ? 'border-red-500/20 bg-red-500/10'
                                                            : isExpiringSoon
                                                              ? 'border-amber-500/20 bg-amber-500/10'
                                                              : 'border-gray-600/30 bg-gray-700/30'
                                                    }`}
                                                >
                                                    <div
                                                        className={`rounded-xl p-2 ${
                                                            isExpired ? 'bg-red-500/20' : isExpiringSoon ? 'bg-amber-500/20' : 'bg-red-500/20'
                                                        }`}
                                                    >
                                                        <CalendarDays
                                                            className={`h-4 w-4 ${
                                                                isExpired ? 'text-red-400' : isExpiringSoon ? 'text-amber-400' : 'text-red-400'
                                                            }`}
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">Fin</p>
                                                        <p className="text-sm font-semibold text-white">{formatDate(assurance.dateFin)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Barre de progression */}
                                        {assurance.jour_restant > 0 && (
                                            <div className="pt-2">
                                                <div className="mb-1 flex justify-between text-xs text-gray-400">
                                                    <span>Temps restant</span>
                                                    <span>
                                                        {assurance.jour_restant} / {assurance.duree_jours} jours
                                                    </span>
                                                </div>
                                                <div className="h-2 w-full rounded-full bg-gray-700">
                                                    <div
                                                        className={`h-2 rounded-full transition-all duration-1000 ${
                                                            isExpiringSoon ? 'bg-amber-500' : 'bg-emerald-500'
                                                        }`}
                                                        style={{
                                                            width: `${Math.max((assurance.jour_restant / assurance.duree_jours) * 100, 0)}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex justify-end pt-4">
                                            <Link href={route('assurances.edit', assurance.id)}>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex items-center gap-2 border-gray-600 bg-gray-700/50 text-white backdrop-blur-sm transition-all duration-300 hover:bg-gray-600 hover:text-white"
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
                            <Card className="border-2 border-dashed border-gray-600/50 bg-gray-800/20 backdrop-blur-xl">
                                <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="mb-6 rounded-3xl bg-gray-700/50 p-8 backdrop-blur-sm">
                                        <ShieldCheck className="h-16 w-16 text-gray-500" />
                                    </div>
                                    <h3 className="mb-4 text-2xl font-bold text-gray-300">Aucune assurance enregistrée</h3>
                                    <p className="mb-8 max-w-md text-lg text-gray-500">
                                        Commencez par sécuriser vos véhicules avec une police d'assurance.
                                    </p>
                                    {/* <Button className="bg-blue-600 px-8 py-3 text-lg text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700">
                                        <CirclePlus className="mr-3 h-5 w-5" />
                                        Ajouter une assurance
                                    </Button> */}
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
