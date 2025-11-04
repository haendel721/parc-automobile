import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Calendar, Car, CircleAlert, FileText, Wrench } from 'lucide-react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Accueil',
        href: '/dashboard',
    },
    {
        title: 'Entretiens',
        href: '/entretiens',
    },
    {
        title: 'Nouvel entretien',
        href: '/entretiens/create',
    },
];

type PageProps = {
    vehicules: { id: number; immatriculation: string }[];
    fournisseurs: { id: number; nom: string }[];
    user: { id: number; role: string }[];
};

export default function CreateEntretien() {
    const { vehicules, fournisseurs, user } = usePage<PageProps>().props;

    const { data, setData, post, processing, errors } = useForm({
        vehicule_id: '',
        fournisseur_id: '',
        type: '',
        cout: '',
        piece_remplacee: '',
        probleme: '',
        recommandation: '',
        prochaine_visite: '',
        description: '',
        dernier_visite: '',
        derniere_vidange: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(data);
        post(route('entretiens.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Créer un entretien" />

            <div className="min-h-screen py-8">
                <div className="max-w-10xl container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href={route('entretiens.index')}>
                                <Button
                                    variant="outline"
                                    className="flex items-center gap-2 border-gray-700 bg-gray-800/50 text-gray-300 transition-all duration-300 hover:bg-gray-700/50 hover:text-white"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Retour
                                </Button>
                            </Link>
                        </div>
                        <div className="text-center lg:text-left">
                            <h1 className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-3xl font-bold text-transparent">
                                Nouvel Entretien
                            </h1>
                            <p className="mt-2 text-gray-400">Renseignez les informations pour planifier un nouvel entretien</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
                            <Wrench className="h-6 w-6 text-blue-400" />
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="overflow-hidden rounded-2xl border border-gray-700/50 bg-gray-900/90 shadow-2xl backdrop-blur-xl">
                        <div className="p-6 sm:p-8">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Error Alert */}
                                {Object.keys(errors).length > 0 && (
                                    <Alert
                                        variant="destructive"
                                        className="border-red-500/20 bg-red-500/10 text-red-300 duration-300 animate-in fade-in"
                                    >
                                        <CircleAlert className="h-4 w-4" />
                                        <AlertTitle className="flex items-center gap-2 text-red-200">Erreurs de validation</AlertTitle>
                                        <AlertDescription>
                                            <ul className="mt-2 space-y-1">
                                                {Object.entries(errors).map(([key, message]) => (
                                                    <li key={key} className="text-sm">
                                                        • {message as string}
                                                    </li>
                                                ))}
                                            </ul>
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {/* Grid Layout */}
                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                    {/* Vehicle Selection */}
                                    <div className="space-y-3 lg:col-span-2">
                                        <Label htmlFor="vehicule_id" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                            <Car className="h-4 w-4 text-blue-400" />
                                            Véhicule *
                                        </Label>
                                        <select
                                            id="vehicule_id"
                                            value={data.vehicule_id}
                                            onChange={(e) => setData('vehicule_id', e.target.value)}
                                            className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-3 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="" className="bg-gray-800 text-gray-400">
                                                Sélectionnez un véhicule
                                            </option>
                                            {vehicules.map((v) => (
                                                <option key={v.id} value={v.id} className="bg-gray-800 text-white">
                                                    {v.immatriculation}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Problem Input */}
                                    <div className="space-y-3">
                                        <Label htmlFor="probleme" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                            <FileText className="h-4 w-4 text-blue-400" />
                                            Problème identifié
                                        </Label>
                                        <Input
                                            id="probleme"
                                            value={data.probleme}
                                            onChange={(e) => setData('probleme', e.target.value)}
                                            placeholder="Décrivez le problème rencontré"
                                            className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-3 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Next Visit Date */}
                                    <div className="space-y-3">
                                        <Label htmlFor="prochaine_visite" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                            <Calendar className="h-4 w-4 text-blue-400" />
                                            Prochaine visite
                                        </Label>
                                        <Input
                                            id="prochaine_visite"
                                            type="datetime-local"
                                            value={data.prochaine_visite}
                                            onChange={(e) => setData('prochaine_visite', e.target.value)}
                                            className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-3 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Description - Full Width */}
                                    <div className="space-y-3 lg:col-span-2">
                                        <Label htmlFor="description" className="text-sm font-medium text-gray-300">
                                            Description détaillée
                                        </Label>
                                        <textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            rows={4}
                                            placeholder="Fournissez une description complète de l'entretien..."
                                            className="w-full resize-none rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-3 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Additional Fields - Responsive Grid */}
                                    <div className="grid grid-cols-1 gap-6 space-y-3 md:grid-cols-2 lg:col-span-2">
                                        {/* Cost */}
                                        <div className="space-y-3">
                                            <Label htmlFor="cout" className="text-sm font-medium text-gray-300">
                                                Coût (€)
                                            </Label>
                                            <Input
                                                id="cout"
                                                type="number"
                                                value={data.cout}
                                                onChange={(e) => setData('cout', e.target.value)}
                                                placeholder="0.00"
                                                className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-3 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        {/* Type */}
                                        <div className="space-y-3">
                                            <Label htmlFor="type" className="text-sm font-medium text-gray-300">
                                                Type d'entretien
                                            </Label>
                                            <select
                                                id="type"
                                                value={data.type}
                                                onChange={(e) => setData('type', e.target.value)}
                                                className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-3 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="" className="bg-gray-800 text-gray-400">
                                                    Type d'entretien
                                                </option>
                                                <option value="vidange" className="bg-gray-800 text-white">
                                                    Vidange
                                                </option>
                                                <option value="revision" className="bg-gray-800 text-white">
                                                    Révision
                                                </option>
                                                <option value="reparation" className="bg-gray-800 text-white">
                                                    Réparation
                                                </option>
                                                <option value="controle" className="bg-gray-800 text-white">
                                                    Contrôle
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col justify-end gap-4 border-t border-gray-700/50 pt-8 sm:flex-row">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 transform bg-blue-500 px-8 py-3 font-medium text-white hover:bg-blue-600 sm:flex-none"
                                    >
                                        {processing ? (
                                            <div className="flex items-center justify-center gap-3">
                                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                <span className="animate-pulse">Création en cours...</span>
                                            </div>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <Wrench className="h-4 w-4" />
                                                Envoyer la demande
                                            </span>
                                        )}
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1 border-gray-600 bg-gray-600/50 text-gray-300 transition-all duration-300 hover:border-gray-500 hover:bg-gray-700/50 hover:text-white sm:flex-none"
                                        onClick={() => window.history.back()}
                                    >
                                        Annuler
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
