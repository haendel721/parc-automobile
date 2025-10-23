import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { CircleAlert } from 'lucide-react';
import { combineDomainOfAllAppliedNumericalValuesIncludingErrorValues } from 'recharts/types/state/selectors/axisSelectors';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Entretien',
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
            <div className="m-5 w-8/12 p-4">
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    {Object.keys(errors).length > 0 && (
                        <Alert>
                            <CircleAlert />
                            <AlertTitle>Errors !</AlertTitle>
                            <AlertDescription>
                                <ul>
                                    {Object.entries(errors).map(([key, message]) => (
                                        <li key={key}>{message as string}</li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="gap-1.5">
                        <Label htmlFor="vehicule_id">Véhicule</Label>
                        <select
                            id="vehicule_id"
                            value={data.vehicule_id}
                            onChange={(e) => setData('vehicule_id', e.target.value)}
                            className="w-full rounded border border-gray-300 px-3 py-2"
                        >
                            <option value="">--Choisir un véhicule--</option>
                            {vehicules.map((v) => (
                                <option key={v.id} value={v.id} className="text-black">
                                    {v.immatriculation}
                                </option>
                            ))}
                        </select>
                    </div>
                    <>
                        <div className="gap-1.5">
                            <Label htmlFor="probleme">Problème</Label>
                            <Input value={data.probleme} onChange={(e) => setData('probleme', e.target.value)} />
                        </div>

                        <div className="gap-1.5">
                            <Label htmlFor="description">Description</Label>
                            <Input value={data.description} onChange={(e) => setData('description', e.target.value)} />
                        </div>
                        <div className="gap-1.5">
                            <Label htmlFor="prochaine_visite">Date de la prochaine visite</Label>
                            <Input
                                type="datetime-local"
                                value={data.prochaine_visite}
                                onChange={(e) => setData('prochaine_visite', e.target.value)}
                            />
                        </div>
                    </>

                    <Button disabled={processing} type="submit">
                        Envoyer
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
