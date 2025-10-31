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

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Enregistrer un plein carburant', href: '/pleinCarburants/create' }];

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
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="w-full max-w-2xl rounded-2xl border border-gray-100 bg-white p-8 shadow-2xl">
                    <h2 className="mb-6 flex items-center justify-center gap-2 text-center text-2xl font-semibold text-gray-800">
                        <Fuel className="text-blue-600" /> Enregistrer un plein carburant
                    </h2>

                    {/* Message d'erreur */}
                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive" className="mb-4">
                            <CircleAlert />
                            <AlertTitle>Erreur !</AlertTitle>
                            <AlertDescription>
                                <ul>
                                    {Object.entries(errors).map(([key, message]) => (
                                        <li key={key}>{message as string}</li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Véhicule */}
                        <div className="flex flex-col">
                            <Label className="flex items-center gap-2 text-gray-700">
                                <CarFront size={18} /> Véhicule
                            </Label>
                            <select
                                value={data.vehicule_id}
                                onChange={(e) => setData('vehicule_id', e.target.value)}
                                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="">-- Choisir un véhicule --</option>
                                {vehicules.map((v) => (
                                    <option key={v.id} value={v.id}>
                                        {v.immatriculation}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Quantité */}
                        <div className="flex flex-col">
                            <Label className="flex items-center gap-2 text-gray-700">
                                <Fuel size={18} /> Quantité (L)
                            </Label>
                            <Input
                                type="number"
                                value={data.quantite}
                                onChange={(e) => setData('quantite', e.target.value)}
                                placeholder="Ex: 30"
                                className="mt-1"
                            />
                        </div>

                        {/* Station */}
                        <div className="flex flex-col">
                            <Label className="flex items-center gap-2 text-gray-700">
                                <MapPin size={18} /> Station
                            </Label>
                            <Input
                                type="text"
                                value={data.station}
                                onChange={(e) => setData('station', e.target.value)}
                                placeholder="Ex: Galana Ankorondrano"
                                className="mt-1"
                            />
                        </div>

                        {/* Date */}
                        <div className="flex flex-col">
                            <Label className="flex items-center gap-2 text-gray-700">
                                <CalendarClock size={18} /> Date du plein
                            </Label>
                            <Input type="datetime-local" value={data.date_plein} disabled className="mt-1 text-gray-600" />
                        </div>

                        {/* Prix unitaire */}
                        <div className="flex flex-col">
                            <Label className="flex items-center gap-2 text-gray-700">
                                <CreditCard size={18} /> Prix unitaire (Ariary/L)
                            </Label>
                            <Input type="number" value={data.prix_unitaire} disabled className="mt-1 text-gray-600" />
                        </div>

                        {/* Montant total */}
                        <div className="flex flex-col">
                            <Label className="flex items-center gap-2 text-gray-700">
                                <CreditCard size={18} /> Montant total (Ariary)
                            </Label>
                            <Input type="number" value={data.montant_total} disabled className="mt-1 text-gray-600" />
                        </div>

                        {/* Bouton */}
                        <Button
                            disabled={processing}
                            type="submit"
                            className="mt-4 w-full transform bg-blue-600 transition-all duration-300 hover:scale-[1.02] hover:bg-blue-700"
                        >
                            Enregistrer le plein
                        </Button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
