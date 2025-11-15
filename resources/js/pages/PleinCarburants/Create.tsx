import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { CalendarClock, CarFront, CircleAlert, CreditCard, Fuel, MapPin } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Accueil', href: '/dashboard' },
    { title: 'Enregistrer un plein carburant', href: '/pleinCarburants/create' },
];

interface Vehicule {
    id: number;
    immatriculation: string;
    carburant_id: number;
    kilometrique: number;
    capacite_reservoir: number; // Ajout important
}

type PleinCarburantProps = {
    vehicules: Vehicule[];
    user: { id: number; role: string; nom: string };
    carburants: { id: number; type: string; prix: number }[];
};

export default function Index() {
    const { vehicules, user, carburants } = usePage<PleinCarburantProps>().props;
    const [dernierKm, setDernierKm] = useState<number>(0);
    const [selectedVehicule, setSelectedVehicule] = useState<Vehicule | null>(null);
    const [apiError, setApiError] = useState<string>('');
    // Récupère la date actuelle à Madagascar (UTC+3)
    const madagascarDate = new Date(new Date().getTime() + 3 * 60 * 60 * 1000).toISOString().slice(0, 16);
    const [ViderInput, setViderInput] = useState(false);
    // Utiliser un seul formulaire pour toutes les données
    const { data, setData, post, processing, errors, reset } = useForm({
        // Données pour le plein carburant
        vehicule_id: '',
        user_id: user.id,
        date_plein: madagascarDate,
        quantite: '',
        prix_unitaire: '',
        montant_total: '',
        station: '',

        // Données pour le kilométrage
        date_releve: madagascarDate,
        kilometrage: '',
        kmCarburant: '',
    });

    useEffect(() => {
        if (!data.vehicule_id) {
            setSelectedVehicule(null);
            setDernierKm(0);
            return;
        }

        // Trouver le véhicule sélectionné
        const vehicule = vehicules.find((v) => v.id === Number(data.vehicule_id));
        setSelectedVehicule(vehicule || null);
        console.log('vehicule :', vehicule);
        if (vehicule && vehicule.kilometrique) {
            setDernierKm(vehicule.kilometrique);
        }
    }, [data.vehicule_id, data.kilometrage]);
    useEffect(() => {
        if (!data.vehicule_id) {
            setSelectedVehicule(null);
            setDernierKm(0);
            return;
        }
        const vehicule = vehicules.find((v) => v.id === Number(data.vehicule_id));
        setSelectedVehicule(vehicule || null);
        if (vehicule) {
            setData('quantite', '');
            setData('kilometrage', '');
            setData('kmCarburant', '');
            setData('station', '');
        }
    },[data.vehicule_id]);
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
        const quantite = Number(data.quantite) || 0;
        const prixUnitaire = Number(data.prix_unitaire) || 0;
        const total = quantite * prixUnitaire;
        setData('montant_total', total.toString());
    }, [data.quantite, data.prix_unitaire, setData]);

    // Vérification capacité réservoir
    useEffect(() => {
        if (selectedVehicule && data.quantite) {
            const quantite = Number(data.quantite);
            const capacite = selectedVehicule.capacite_reservoir;

            if (quantite > capacite) {
                // Vous pouvez gérer cette erreur localement ou via le backend
                console.warn(`Quantité (${quantite}L) dépasse la capacité (${capacite}L)`);
            }
        }
    }, [data.quantite, selectedVehicule]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Synchroniser kmCarburant avec kilometrage
        if (data.kilometrage && !data.kmCarburant) {
            setData('kmCarburant', data.kilometrage);
        }

        console.log('Données envoyées:', data);

        // Utiliser la nouvelle route unique
        post(route('kilometrages.carburantStore'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Enregistrer un plein carburant" />

            <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl">
                    {/* Header Card */}
                    <div className="mb-8 text-center">
                        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
                            <Fuel className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="mb-2 text-3xl font-bold text-white">Nouveau Plein Carburant</h1>
                        <p className="text-lg text-gray-400">Enregistrez les détails du remplissage de carburant</p>
                    </div>

                    {/* Main Form Card */}
                    <div className="overflow-hidden rounded-2xl border border-gray-700 bg-gray-800/80 shadow-2xl backdrop-blur-sm">
                        {/* Form Header */}
                        <div className="border-b border-gray-700 bg-gradient-to-r from-blue-900/30 to-blue-800/20 px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-2 rounded-full bg-blue-500"></div>
                                <div>
                                    <h2 className="text-xl font-semibold text-white">Informations du plein</h2>
                                    <p className="text-sm text-gray-400">Renseignez tous les champs requis</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 sm:p-8">
                            {/* Message d'erreur global */}
                            {Object.keys(errors).length > 0 && (
                                <Alert variant="destructive" className="mb-6 border-red-800 bg-red-900/20 text-red-200">
                                    <CircleAlert className="h-4 w-4" />
                                    <AlertTitle className="text-red-100">Erreurs de validation</AlertTitle>
                                    <AlertDescription>
                                        <ul className="list-inside list-disc space-y-1">
                                            {Object.entries(errors).map(([key, message]) => (
                                                <li key={key} className="text-sm">
                                                    <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span> {message as string}
                                                </li>
                                            ))}
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            )}

                            {/* Avertissement capacité réservoir */}
                            {selectedVehicule && data.quantite && Number(data.quantite) > selectedVehicule.capacite_reservoir && (
                                <Alert variant="destructive" className="mb-6 border-orange-800 bg-orange-900/20 text-orange-200">
                                    <CircleAlert className="h-4 w-4" />
                                    <AlertTitle className="text-orange-100">Attention</AlertTitle>
                                    <AlertDescription>
                                        La quantité saisie ({data.quantite} L) dépasse la capacité du réservoir ({selectedVehicule.capacite_reservoir}{' '}
                                        L).
                                    </AlertDescription>
                                </Alert>
                            )}
                            {selectedVehicule && data.quantite && Number(data.quantite) <= 0 && (
                                <Alert variant="destructive" className="mb-6 border-orange-800 bg-orange-900/20 text-orange-200">
                                    <CircleAlert className="h-4 w-4" />
                                    <AlertTitle className="text-orange-100">Attention</AlertTitle>
                                    <AlertDescription>La quantité saisie ne doit pas être inférieur ou égal à 0.</AlertDescription>
                                </Alert>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Grid responsive */}
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    {/* Véhicule */}
                                    <div className="space-y-2">
                                        <Label htmlFor="vehicule_id" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                            <CarFront className="h-4 w-4 text-blue-400" />
                                            Véhicule *
                                        </Label>
                                        <select
                                            id="vehicule_id"
                                            value={data.vehicule_id}
                                            onChange={(e) => {
                                                setData('vehicule_id', e.target.value);
                                            }}
                                            className="w-full rounded-xl border border-gray-600 bg-gray-700 px-4 py-3 text-white transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        >
                                            <option value="" className="bg-gray-700 text-gray-300">
                                                -- Choisir un véhicule --
                                            </option>
                                            {vehicules.map((v) => (
                                                <option key={v.id} value={v.id} className="bg-gray-700 text-white">
                                                    {v.immatriculation}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.vehicule_id && <p className="text-sm text-red-400">{errors.vehicule_id}</p>}
                                    </div>

                                    {/* Quantité */}
                                    <div className="space-y-2">
                                        <Label htmlFor="quantite" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                            <Fuel className="h-4 w-4 text-green-400" />
                                            Quantité (L) *
                                        </Label>
                                        <Input
                                            id="quantite"
                                            type="number"
                                            step="0.01"
                                            value={data.quantite}
                                            onChange={(e) => {
                                                setData('quantite', e.target.value);
                                            }}
                                            className="w-full border-gray-600 bg-gray-700 text-white placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                                            placeholder="0.00"
                                        />
                                        {/* {errors.quantite && <p className="text-sm text-red-400">{errors.quantite}</p>} */}
                                        {selectedVehicule && (
                                            <p className="text-xs text-gray-400">Capacité max: {selectedVehicule.capacite_reservoir} L</p>
                                        )}
                                    </div>

                                    {/* Station */}
                                    <div className="space-y-2">
                                        <Label htmlFor="station" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                            <MapPin className="h-4 w-4 text-orange-400" />
                                            Station
                                        </Label>
                                        <Input
                                            id="station"
                                            type="text"
                                            value={data.station}
                                            onChange={(e) => setData('station', e.target.value)}
                                            placeholder="Ex: Galana Ankorondrano"
                                            className="w-full border-gray-600 bg-gray-700 text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
                                        />
                                        {errors.station && <p className="text-sm text-red-400">{errors.station}</p>}
                                    </div>

                                    {/* Kilométrage */}
                                    <div className="space-y-2">
                                        <Label htmlFor="kilometrage" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                            <Fuel className="h-4 w-4 text-green-400" />
                                            Kilométrage (km) *
                                        </Label>
                                        <Input
                                            id="kilometrage"
                                            type="number"
                                            required
                                            value={data.kilometrage}
                                            onChange={(e) => {
                                                setData('kilometrage', e.target.value);
                                                setData('kmCarburant', e.target.value);
                                                setApiError('');
                                            }}
                                            min={dernierKm + 1}
                                            placeholder={dernierKm ? `Dernier relevé : ${dernierKm} km` : 'Entrez le kilométrage'}
                                            className="w-full border-gray-600 bg-gray-700 text-white placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                                        />
                                        {errors.kilometrage && <p className="text-sm text-red-400">{errors.kilometrage}</p>}
                                        {errors.kmCarburant && <p className="text-sm text-red-400">{errors.kmCarburant}</p>}
                                        {dernierKm > 0 && <p className="text-xs text-gray-400">Dernier relevé: {dernierKm} km</p>}
                                    </div>

                                    {/* Date plein */}
                                    <div className="space-y-2">
                                        <Label htmlFor="date_plein" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                            <CalendarClock className="h-4 w-4 text-purple-400" />
                                            Date et heure *
                                        </Label>
                                        <Input
                                            id="date_plein"
                                            type="datetime-local"
                                            value={data.date_plein}
                                            disabled
                                            onChange={(e) => {
                                                setData('date_plein', e.target.value);
                                                setData('date_releve', e.target.value); // Synchroniser les dates
                                            }}
                                            className="w-full border-gray-600 bg-gray-700 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                                        />
                                        {errors.date_plein && <p className="text-sm text-red-400">{errors.date_plein}</p>}
                                    </div>

                                    {/* Prix unitaire */}
                                    <div className="space-y-2">
                                        <Label htmlFor="prix_unitaire" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                            <CreditCard className="h-4 w-4 text-yellow-400" />
                                            Prix unitaire (Ar/L) *
                                        </Label>
                                        <Input
                                            id="prix_unitaire"
                                            type="number"
                                            step="0.01"
                                            disabled
                                            value={data.prix_unitaire}
                                            onChange={(e) => setData('prix_unitaire', e.target.value)}
                                            className="w-full border-gray-600 bg-gray-700 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500"
                                        />
                                        {errors.prix_unitaire && <p className="text-sm text-red-400">{errors.prix_unitaire}</p>}
                                    </div>

                                    {/* Montant total */}
                                    <div className="space-y-2 sm:col-span-2">
                                        <Label htmlFor="montant_total" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                            <CreditCard className="h-4 w-4 text-emerald-400" />
                                            Montant total (Ar) *
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="montant_total"
                                                type="number"
                                                step="0.01"
                                                disabled
                                                value={data.montant_total}
                                                onChange={(e) => setData('montant_total', e.target.value)}
                                                className="w-full border-gray-600 bg-gray-700 pr-12 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                <span className="text-sm text-gray-500">Ar</span>
                                            </div>
                                        </div>
                                        {errors.montant_total && <p className="text-sm text-red-400">{errors.montant_total}</p>}
                                    </div>
                                </div>

                                {/* Informations complémentaires */}
                                <div className="rounded-lg border border-blue-800/30 bg-blue-900/20 p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/20">
                                            <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                                        </div>
                                        <div className="text-sm text-blue-300">
                                            <p className="font-medium">Calcul automatique</p>
                                            <p className="mt-1 text-blue-400/80">
                                                Le montant total est calculé automatiquement à partir de la quantité et du prix unitaire.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Bouton de soumission */}
                                <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1 border-gray-600 bg-gray-700 text-gray-300 transition-all duration-200 hover:bg-gray-600 hover:text-white"
                                        onClick={() => window.history.back()}
                                    >
                                        Annuler
                                    </Button>
                                    <Button
                                        disabled={processing || !data.vehicule_id || !data.quantite || !data.kilometrage}
                                        type="submit"
                                        className="flex-1 transform rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:from-blue-700 hover:to-blue-800 hover:shadow-xl disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {processing ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
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
