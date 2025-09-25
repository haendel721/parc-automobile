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
        title: 'Créer un nouveaux piece ',
        href: '/pieces/create',
    },
];

export default function Index() {
    const { props } = usePage();
    const { fournisseurs } = props; // données envoyées depuis Laravel
    const { data, setData, post, processing, errors } = useForm({
        nom: '',
        prix: '',
        quantite: '',
        fournisseur_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        console.log(data);
        e.preventDefault();
        post(route('pieces.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Créer un nouveaux piece" />
            <div className="w-8/12 p-4">
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4" enctype="multipart/form-data">
                    {/* display errors */}

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
                        <Label htmlFor="piece nom">Nom</Label>
                        <Input
                            type="text"
                            value={data.nom}
                            onChange={(e) => setData('nom', e.target.value)}
                        />
                    </div>
                    <div className="gap-1.5">
                        <Label htmlFor="fournisseur">Fournisseur</Label>
                        <select
                            value={data.fournisseur_id}
                            onChange={(e) => setData('fournisseur_id', e.target.value)}
                            className="w-full rounded border border-gray-300 px-3 py-2"
                        >
                            <option value="">--Choisir un fournisseur--</option>
                            {fournisseurs.map((f: any) => (
                                <option key={f.id} value={f.id} className="bg-white text-black">
                                    {f.nom}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="gap-1.5">
                        <Label htmlFor="piece prix ">Prix</Label>
                        <Input type="text"  value={data.prix} onChange={(e) => setData('prix', e.target.value)} />
                    </div>
                    <div className="gap-1.5">
                        <Label htmlFor="piece quantité ">Quantité</Label>
                        <Input type="text" value={data.quantite} onChange={(e) => setData('quantite', e.target.value)} />
                    </div>
                    <Button disabled={processing} className="t-4" type="submit">
                        Ajouter
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
