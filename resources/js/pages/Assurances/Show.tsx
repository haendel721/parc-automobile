import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { CalendarDays, DollarSign, FileText, ShieldCheck, ArrowLeft } from 'lucide-react';

type Assurance = {
    id: number;
    vehicule_id: number;
    NomCompagnie: string;
    NumContrat: string;
    dateDebut: string;
    dateFin: string;
    cout: number;
};

type Vehicule = {
    id: number;
    immatriculation: string;
    marque: string;
    photo?: string;
};

export default function Show() {
    const { assurance, vehicule } = usePage<{ assurance: Assurance; vehicule: Vehicule }>().props;

    const bgImage = vehicule.photo
        ? `/storage/${vehicule.photo}`
        : '/images/default-car.png';

    // Vérifier si l'assurance est expirée
    const isExpired = new Date(assurance.dateFin) < new Date();
    const isActive = !isExpired;

    return (
        <AppLayout>
            <Head title="Assurance du véhicule" />

            <div className="min-h-screen ">
                {/* Header avec navigation */}
                <div className="relative overflow-hidden">
                    
                    {/* Contenu header */}
                    <div className="relative z-10 px-4 pt-8 pb-16 sm:px-6 lg:px-8">
                        <Button
                            variant="ghost"
                            className="mb-6 text-gray-300 hover:text-white hover:bg-white/10 backdrop-blur-sm"
                            onClick={() => history.back()}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Retour
                        </Button>

                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-white mb-2">
                                Assurance Véhicule
                            </h1>
                            <div className="flex items-center justify-center gap-3 text-gray-300">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-lg">{vehicule.immatriculation}</span>
                                <span className="text-gray-500">•</span>
                                <span className="text-gray-400">{vehicule.marque}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Carte principale */}
                <div className="relative z-20 -mt-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
                            {/* En-tête avec statut */}
                            <div className="p-6 border-b border-gray-700">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="rounded-xl bg-blue-500/20 p-3">
                                            <ShieldCheck className="h-8 w-8 text-blue-400" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white">
                                                {assurance.NomCompagnie}
                                            </h2>
                                            <p className="text-gray-400">
                                                Contrat n° {assurance.NumContrat}
                                            </p>
                                        </div>
                                    </div>

                                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                                        isActive 
                                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    }`}>
                                        <div className={`w-2 h-2 rounded-full ${
                                            isActive ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                                        }`}></div>
                                        <span className="font-medium">
                                            {isActive ? 'Actif' : 'Expiré'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Informations principales */}
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Date de début */}
                                    <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600/50 hover:border-blue-500/30 transition-all duration-300">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="rounded-lg bg-blue-500/20 p-2">
                                                <CalendarDays className="h-5 w-5 text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-400">Date de début</p>
                                                <p className="font-semibold text-white text-lg">
                                                    {assurance.dateDebut}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Date d'expiration */}
                                    <div className={`rounded-xl p-4 border transition-all duration-300 ${
                                        isExpired 
                                            ? 'bg-red-500/10 border-red-500/30 hover:border-red-400/50' 
                                            : 'bg-gray-700/50 border-gray-600/50 hover:border-green-500/30'
                                    }`}>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={`rounded-lg p-2 ${
                                                isExpired ? 'bg-red-500/20' : 'bg-green-500/20'
                                            }`}>
                                                <CalendarDays className={`h-5 w-5 ${
                                                    isExpired ? 'text-red-400' : 'text-green-400'
                                                }`} />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-400">Date d'expiration</p>
                                                <p className={`font-semibold text-lg ${
                                                    isExpired ? 'text-red-300' : 'text-white'
                                                }`}>
                                                    {assurance.dateFin}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Numéro de contrat */}
                                    <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600/50 hover:border-purple-500/30 transition-all duration-300">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="rounded-lg bg-purple-500/20 p-2">
                                                <FileText className="h-5 w-5 text-purple-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-400">N° du contrat</p>
                                                <p className="font-semibold text-white text-lg">
                                                    {assurance.NumContrat}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Coût */}
                                    <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600/50 hover:border-emerald-500/30 transition-all duration-300">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="rounded-lg bg-emerald-500/20 p-2">
                                                <DollarSign className="h-5 w-5 text-emerald-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-400">Coût de l'assurance</p>
                                                <p className="font-bold text-emerald-400 text-xl">
                                                    {assurance.cout.toLocaleString()} MGA
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Barre de progression (optionnelle) */}
                                <div className="mt-8">
                                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                                        <span>Début: {assurance.dateDebut}</span>
                                        <span>Fin: {assurance.dateFin}</span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                        <div 
                                            className={`h-2 rounded-full transition-all duration-1000 ${
                                                isExpired 
                                                    ? 'bg-red-500 w-full' 
                                                    : 'bg-gradient-to-r from-blue-500 to-green-500'
                                            }`}
                                            style={{
                                                width: isExpired ? '100%' : '50%' // Ajuster selon la progression réelle
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="p-6 border-t border-gray-700 bg-gray-900/50">
                                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                                    <Button
                                        variant="outline"
                                        className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                                        onClick={() => history.back()}
                                    >
                                        Retour
                                    </Button>
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                                        Télécharger le contrat
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}