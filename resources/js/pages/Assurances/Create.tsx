import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { CircleAlert } from 'lucide-react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Nouvelle Assurance', href: '/assurances/create' },
];

interface vehicules {
    id:number;
    immatriculation: string;
    user_id: number
}

interface user {
    id: number;
    role: string;
}

type AssuranceProps = {
    vehicules: vehicules[];
    user:user;
}
export default function Create() {
    const { vehicules , user } = usePage<AssuranceProps>().props;

    const userRole = user?.role || 'utilisateur';
    const userId = user?.id || null;

    const filteredVehicules = userRole === 'admin'
        ? vehicules
        : vehicules.filter((v) => v.user_id === userId);

    const { data, setData, post, processing, errors } = useForm({
        vehicule_id: '',
        NomCompagnie: '',
        NumContrat: '',
        cout: '',
        dateDebut: '',
        dateFin: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('assurances.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nouvelle Assurance" />
            <div className="w-8/12 p-4 m-10" >
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    {Object.keys(errors).length > 0 && (
                        <Alert>
                            <CircleAlert />
                            <AlertTitle>Erreurs !</AlertTitle>
                            <AlertDescription>
                                <ul>
                                    {Object.entries(errors).map(([key, message]) => (
                                        <li key={key}>{message as string}</li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}

                    <div>
                        <Label htmlFor="vehicule_id">Véhicule</Label>
                        <select
                            id="vehicule_id"
                            value={data.vehicule_id}
                            onChange={(e) => setData('vehicule_id', e.target.value)}
                            className="w-full rounded border border-gray-300 px-3 py-2"
                        >
                            <option value="">--Choisit l'immatricule du véhicule--</option>
                            {filteredVehicules.map((v) => (
                                <option key={v.id} value={v.id} className='text-black'>
                                    {v.immatriculation}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <Label htmlFor="NomCompagnie">Nom de l'entreprise</Label>
                        <Input
                            type="text"
                            value={data.NomCompagnie}
                            onChange={(e) => setData('NomCompagnie', e.target.value)}
                        />
                    </div>

                    <div>
                        <Label htmlFor="NumContrat">Numéro du contrat</Label>
                        <Input
                            type="text"
                            value={data.NumContrat}
                            onChange={(e) => setData('NumContrat', e.target.value)}
                        />
                    </div>

                    <div>
                        <Label htmlFor="cout">Coût (Ar)</Label>
                        <Input
                            type="text"
                            value={data.cout}
                            onChange={(e) => setData('cout', e.target.value)}
                        />
                    </div>

                    <div>
                        <Label htmlFor="dateDebut">Date de début</Label>
                        <Input
                            type="date"
                            value={data.dateDebut}
                            onChange={(e) => setData('dateDebut', e.target.value)}
                        />
                    </div>

                    <div>
                        <Label htmlFor="dateFin">Date de fin</Label>
                        <Input
                            type="date"
                            value={data.dateFin}
                            onChange={(e) => setData('dateFin', e.target.value)}
                        />
                    </div>

                    <Button disabled={processing} type="submit">Valider</Button>
                </form>
            </div>
        </AppLayout>
    );
}
