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
    {
        title: 'Nouvel Assaurance',
        href: '/assurances/create',
    },
];

export default function Index() {
    const { props } = usePage();
    const { vehicules } = props; // données envoyées depuis Laravel
    console.log(
        vehicules.map((v) => (
            <option key={v.id} value={v.id} className="bg-white text-black">
                {v.nom}
            </option>
        )),
    );
    const { data, setData, post, processing, errors } = useForm({
        vehicule_id: '',
        NomCompagnie: '',
        NumContrat: '',
        cout: '',
        dateDebut: '',
        dateFin: '',
    });
    
    console.log('Vehicule : ' + data.vehicule_id + '\nNom compagnie : ' + data.NomCompagnie + '\n Cout : ' + data.cout + '\ndate début : ' + data.dateDebut + '\ndate de fin : ' + data.dateFin )
    const handleSubmit = (e: React.FormEvent) => {
        console.log(data);
        e.preventDefault();
        post(route('assurances.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Affecter un nouvelle Assurance à un vehicule" />
            <div className="w-8/12 p-4">
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4" enctype="multipart/form-data">
                    {/* destion d'erreurs */}

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
                        <Label htmlFor="vehicule_id">Id du vehicule</Label>
                        <select
                            id="vehicule_id"
                            value={data.vehicule_id}
                            onChange={(e) => setData('vehicule_id', e.target.value)}
                            className="w-full rounded border border-gray-300 px-3 py-2"
                        >
                            <option value="">--Choisir l'immatriculation du voiture--</option>
                            {vehicules?.map((v: any) => (
                                <option key={v.id} value={v.id} className="bg-white text-black">
                                    {v.immatriculation}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="gap-1.5">
                        <Label htmlFor="NomCompagnie">Nom du l'entreprise</Label>
                        <Input
                            type='text'
                            value={data.NomCompagnie}
                            onChange={(e) => setData('NomCompagnie', e.target.value)}
                            className="w-full rounded border border-gray-300 px-3 py-2"
                        />
                    </div>
                    <div className="gap-1.5">
                        <Label htmlFor="NumContrat">Identification du Contrat</Label>
                        <Input
                            type="text"
                            placeholder="564521315KL51"
                            value={data.NumContrat}
                            onChange={(e) => setData('NumContrat', e.target.value)}
                        />
                    </div>
                    <div className="gap-1.5">
                        <Label htmlFor="cout">cout</Label>
                        <Input type="text" placeholder="cout" value={data.cout} onChange={(e) => setData('cout', e.target.value)} />
                    </div>
                    <div className="gap-1.5">
                        <Label htmlFor="Date de début">Date de début</Label>
                        <Input type="date" value={data.dateDebut} onChange={(e) => setData('dateDebut', e.target.value)} />
                    </div>
                    <div className="gap-1.5">
                        <Label htmlFor="Date de fin">Date de fin</Label>
                        <Input type="date" value={data.dateFin} onChange={(e) => setData('dateFin', e.target.value)} />
                    </div>
                    <Button disabled={processing} className="t-4" type="submit">
                        Ajouter
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
