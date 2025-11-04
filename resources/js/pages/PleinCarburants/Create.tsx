import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { CalendarClock, CarFront, CircleAlert, CreditCard, Fuel, MapPin } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Accueil', href: '/dashboard' },
    { title: 'Enregistrer un plein carburant', href: '/pleinCarburants/create' },
];

interface Vehicule {
    id: number;
    immatriculation: string;
    carburant_id: number;
}

type PleinCarburantProps = {
    vehicules: Vehicule[];
    user: { id: number; role: string; nom: string };
    carburants: { id: number; type: string; prix: number }[];
};

export default function Index() {
    const { vehicules, user, carburants } = usePage<PleinCarburantProps>().props;

    // Récupère la date actuelle à Madagascar (UTC+3)
    const madagascarDate = new Date(new Date().getTime() + 3 * 60 * 60 * 1000).toISOString().slice(0, 16);

    console.log(madagascarDate);

    const { data, setData, post, processing, errors } = useForm({
        vehicule_id: '',
        user_id: user.id,
        date_plein: madagascarDate,
        quantite: '',
        prix_unitaire: '',
        montant_total: '',
        station: '',
    });

    const getPrixCarburant = useCallback(
        (vehiculeId: number) => {
            const vehicule = vehicules.find((v) => v.id === vehiculeId);
            if (!vehicule) return 0;
            const carburant = carburants.find((c) => c.id === vehicule.carburant_id);
            return carburant ? carburant.prix : 0;
        },
        [vehicules, carburants],
    );

    useEffect(() => {
        if (data.vehicule_id) {
            const prix = getPrixCarburant(Number(data.vehicule_id));
            setData('prix_unitaire', prix.toString());
        }
    }, [data.vehicule_id, getPrixCarburant, setData]);

    useEffect(() => {
        // Calcul automatique du montant total
        const total = Number(data.quantite) * Number(data.prix_unitaire);
        setData('montant_total', total.toString());
    }, [data.quantite, data.prix_unitaire]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(data);
        post(route('pleinCarburant.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Enregistrer un plein carburant" />
            
            <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                    {/* Header Card */}
                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 mb-4 shadow-lg">
                            <Fuel className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Nouveau Plein Carburant</h1>
                        <p className="text-gray-400 text-lg">Enregistrez les détails du remplissage de carburant</p>
                    </div>

                    {/* Main Form Card */}
                    <div className="rounded-2xl border border-gray-700 bg-gray-800/80 backdrop-blur-sm shadow-2xl overflow-hidden">
                        {/* Form Header */}
                        <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/20 border-b border-gray-700 px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                                <div>
                                    <h2 className="text-xl font-semibold text-white">Informations du plein</h2>
                                    <p className="text-gray-400 text-sm">Renseignez tous les champs requis</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 sm:p-8">
                            {/* Message d'erreur */}
                            {Object.keys(errors).length > 0 && (
                                <Alert variant="destructive" className="mb-6 border-red-800 bg-red-900/20 text-red-200">
                                    <CircleAlert className="h-4 w-4" />
                                    <AlertTitle className="text-red-100">Erreurs de validation</AlertTitle>
                                    <AlertDescription>
                                        <ul className="list-disc list-inside space-y-1">
                                            {Object.entries(errors).map(([key, message]) => (
                                                <li key={key} className="text-sm">{message as string}</li>
                                            ))}
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Grid responsive */}
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    {/* Véhicule */}
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                            <CarFront className="h-4 w-4 text-blue-400" />
                                            Véhicule *
                                        </Label>
                                        <select
                                            value={data.vehicule_id}
                                            onChange={(e) => setData('vehicule_id', e.target.value)}
                                            className="w-full rounded-xl border border-gray-600 bg-gray-700 px-4 py-3 text-white transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        >
                                            <option value="" className="bg-gray-700 text-gray-300">-- Choisir un véhicule --</option>
                                            {vehicules.map((v) => (
                                                <option key={v.id} value={v.id} className="bg-gray-700 text-white">
                                                    {v.immatriculation}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Quantité */}
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                            <Fuel className="h-4 w-4 text-green-400" />
                                            Quantité (L) *
                                        </Label>
                                        <Input
                                            type="number"
                                            value={data.quantite}
                                            onChange={(e) => setData('quantite', e.target.value)}
                                            placeholder="Ex: 30"
                                            className="w-full border-gray-600 bg-gray-700 text-white placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>

                                    {/* Station */}
                                    <div className="space-y-2 sm:col-span-2">
                                        <Label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                            <MapPin className="h-4 w-4 text-orange-400" />
                                            Station *
                                        </Label>
                                        <Input
                                            type="text"
                                            value={data.station}
                                            onChange={(e) => setData('station', e.target.value)}
                                            placeholder="Ex: Galana Ankorondrano"
                                            className="w-full border-gray-600 bg-gray-700 text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>

                                    {/* Date */}
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                            <CalendarClock className="h-4 w-4 text-purple-400" />
                                            Date et heure
                                        </Label>
                                        <Input 
                                            type="datetime-local" 
                                            value={data.date_plein} 
                                            disabled 
                                            className="w-full border-gray-600 bg-gray-600 text-gray-400 cursor-not-allowed" 
                                        />
                                    </div>

                                    {/* Prix unitaire */}
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                            <CreditCard className="h-4 w-4 text-yellow-400" />
                                            Prix unitaire (Ar/L)
                                        </Label>
                                        <Input 
                                            type="number" 
                                            value={data.prix_unitaire} 
                                            disabled 
                                            className="w-full border-gray-600 bg-gray-600 text-gray-400 cursor-not-allowed" 
                                        />
                                    </div>

                                    {/* Montant total */}
                                    <div className="space-y-2 sm:col-span-2">
                                        <Label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                            <CreditCard className="h-4 w-4 text-emerald-400" />
                                            Montant total (Ar)
                                        </Label>
                                        <div className="relative">
                                            <Input 
                                                type="number" 
                                                value={data.montant_total} 
                                                disabled 
                                                className="w-full border-gray-600 bg-gray-600 text-gray-400 cursor-not-allowed pr-12" 
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                <span className="text-gray-500 text-sm">Ar</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Informations complémentaires */}
                                <div className="rounded-lg bg-blue-900/20 border border-blue-800/30 p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
                                            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                        </div>
                                        <div className="text-sm text-blue-300">
                                            <p className="font-medium">Calcul automatique</p>
                                            <p className="text-blue-400/80 mt-1">
                                                Le montant total est calculé automatiquement à partir de la quantité et du prix unitaire.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Bouton de soumission */}
                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1 border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white transition-all duration-200"
                                        onClick={() => window.history.back()}
                                    >
                                        Annuler
                                    </Button>
                                    <Button
                                        disabled={processing}
                                        type="submit"
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        {processing ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Enregistrement...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center gap-2">
                                                <Fuel className="h-4 w-4" />
                                                <span>Enregistrer le plein</span>
                                            </div>
                                        )}
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