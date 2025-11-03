import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { CircleAlert, Car, Calendar, FileText, Wrench, ArrowLeft } from 'lucide-react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Accueil',
        href: '/dashboard',
    },
    {
        title: 'entretiens',
        href: '/entretiens',
    },
    {
        title: 'envoyer un nouvel entretien',
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
            
            <div className="min-h-screen bg-gray-50/30 py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-10xl">
                    {/* Header */}
                     <div className="mb-8 flex items-center justify-between">
                    <div className="mb-6">
                        <Link href={route('entretiens.index')}>
                            <Button variant="outline" className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" /> Retour à la liste
                            </Button>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div>
                            <h1 className="mb-2 text-3xl font-bold text-gray-900">Nouvel Entretien</h1>
                            {/* <p className="text-gray-600">Renseignez les informations du véhicule à ajouter à votre flotte</p> */}
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg bg-blue-50 px-4 py-3">
                        <Wrench className="w-8 h-8 text-blue-600" />
                    </div>
                </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 sm:p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Error Alert */}
                                {Object.keys(errors).length > 0 && (
                                    <Alert variant="destructive" className="animate-in fade-in duration-300">
                                        <CircleAlert className="h-4 w-4" />
                                        <AlertTitle className="flex items-center gap-2">
                                            Erreurs de validation
                                        </AlertTitle>
                                        <AlertDescription>
                                            <ul className="space-y-1">
                                                {Object.entries(errors).map(([key, message]) => (
                                                    <li key={key} className="text-sm">• {message as string}</li>
                                                ))}
                                            </ul>
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {/* Grid Layout */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Vehicle Selection */}
                                    <div className="space-y-2 lg:col-span-2">
                                        <Label htmlFor="vehicule_id" className="text-sm font-medium flex items-center gap-2">
                                            <Car className="w-4 h-4 text-gray-500" />
                                            Véhicule *
                                        </Label>
                                        <select
                                            id="vehicule_id"
                                            value={data.vehicule_id}
                                            onChange={(e) => setData('vehicule_id', e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        >
                                            <option value="" className="text-gray-400">
                                                Sélectionnez un véhicule
                                            </option>
                                            {vehicules.map((v) => (
                                                <option key={v.id} value={v.id} className="text-gray-900">
                                                    {v.immatriculation}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Problem Input */}
                                    <div className="space-y-2">
                                        <Label htmlFor="probleme" className="text-sm font-medium flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-gray-500" />
                                            Problème identifié
                                        </Label>
                                        <Input
                                            id="probleme"
                                            value={data.probleme}
                                            onChange={(e) => setData('probleme', e.target.value)}
                                            placeholder="Décrivez le problème rencontré"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        />
                                    </div>

                                    {/* Next Visit Date */}
                                    <div className="space-y-2">
                                        <Label htmlFor="prochaine_visite" className="text-sm font-medium flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-500" />
                                            Prochaine visite
                                        </Label>
                                        <Input
                                            id="prochaine_visite"
                                            type="datetime-local"
                                            value={data.prochaine_visite}
                                            onChange={(e) => setData('prochaine_visite', e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        />
                                    </div>

                                    {/* Description - Full Width */}
                                    <div className="space-y-2 lg:col-span-2">
                                        <Label htmlFor="description" className="text-sm font-medium">
                                            Description détaillée
                                        </Label>
                                        <textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            rows={4}
                                            placeholder="Fournissez une description complète ..."
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                                    >
                                        {processing ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Création en cours...
                                            </div>
                                        ) : (
                                            'Envoyer la demande'
                                        )}
                                    </Button>
                                    
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 border-gray-300 hover:bg-gray-50"
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