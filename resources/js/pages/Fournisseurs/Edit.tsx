import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { CircleAlert } from 'lucide-react';
import { route } from 'ziggy-js';

interface fournisseur {
    id: number;
    nom: string;
    type: string;
    addresse: string;
    phone: string;
    email: string;
    siteWeb: string;
};

interface Props {
    fournisseur: fournisseur;
}

export default function Edit({ fournisseur }: Props) {
    console.log(fournisseur)
    const { processing, data, setData, post, errors } = useForm({
        id: fournisseur.id,
        nom: fournisseur.nom ?? '',
        type: fournisseur.type ?? '',
        addresse: fournisseur.addresse ?? '',
        phone: fournisseur.phone ?? '',
        email: fournisseur.email ?? '',
        siteWeb: fournisseur.siteWeb ?? '',
    });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('fournisseurs.update', fournisseur.id), {
            forceFormData: true, // 👈 obligatoire pour que l'image + les autres champs passent
            method: 'put', // car update
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Modifier un Fournisseur', href: `/fournisseurs/${fournisseur.id}/edit` }]}>
            <Head title="Mise à jour d'un fournisseur" />
            <div className="w-8/12 p-4">
                <form onSubmit={handleUpdate} className="flex flex-col space-y-4">
                    {/* Erreurs */}
                    {Object.keys(errors).length > 0 && (
                        <Alert>
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

                    <div className="gap-1.5">
                        <Label>Nom</Label>
                        <Input type="text" value={data.nom} onChange={(e) => setData('nom', e.target.value)} />
                    </div>

                    <div className="gap-1.5">
                        <Label>Type</Label>
                        <Input type="text" value={data.type} onChange={(e) => setData('type', e.target.value)} />
                    </div>

                    <div className="gap-1.5">
                        <Label>Addresse</Label>
                        <Input type="text" value={data.addresse} onChange={(e) => setData('addresse', e.target.value)} />
                    </div>

                    <div className="gap-1.5">
                        <Label>Téléphone</Label>
                        <Input type="text" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                    </div>

                    <div className="gap-1.5">
                        <Label>E-Mail</Label>
                        <Input type="text" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                    </div>

                    <div className="gap-1.5">
                        <Label>Site web</Label>
                        <Input type="text" value={data.siteWeb} onChange={(e) => setData('siteWeb', e.target.value)} />
                    </div>

                    <Button disabled={processing} className="t-4" type="submit">
                        Mettre à jour le fournisseur
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
