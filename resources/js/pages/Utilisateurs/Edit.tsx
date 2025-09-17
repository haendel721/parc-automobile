import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { CircleAlert } from 'lucide-react';
import { route } from 'ziggy-js';

interface user {
    id: number;
    name: string;
    prenom: string;
    phone: string;
    statut: string;
    fonction: string;
    email: string;
    role: string;
}

interface Props {
    user: user;
}

export default function Edit({ user}: Props) {
    const { data, setData, put, processing, errors } = useForm({
        id: user.id,
        name: user.name,
        prenom: user.prenom,
        phone: user.phone,
        statut: user.statut,
        fonction: user.fonction,
        email: user.email,
        role: user.role,
    });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('utilisateurs.update', user.id));
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Modifier un véhicule', href: `/utilisateurs/${user.id}/edit` },
            ]}
        >
            <Head title="Mise à jour d'un véhicule" />
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
                        <Label>Id</Label>
                        <Input
                            disabled={true}
                            type="text"
                            value={data.id}
                            onChange={(e) => setData('id', Number(e.target.value))}
                        />
                    </div>

                    <div className="gap-1.5">
                        <Label>Nom</Label>
                        <Input 
                            type='text'
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                    </div>

                    <div className="gap-1.5">
                        <Label>Prénom</Label>
                        <Input
                            type="text"
                            value={data.prenom}
                            onChange={(e) => setData('prenom', e.target.value)}
                        />
                    </div>

                    <div className="gap-1.5">
                        <Label>Téléphone</Label>
                        <Input
                            type="text"
                            id="phone"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            className="w-full rounded border border-gray-300 px-3 py-2"
                        />
                    </div>

                    <div className="gap-1.5">
                        <Label>Statut</Label>
                        <Input
                            type="text"
                            value={data.statut}
                            onChange={(e) => setData('statut', e.target.value)}
                        />
                    </div>

                    <div className="gap-1.5">
                        <Label>Fonction</Label>
                        <Input
                            type="text"
                            id="fonction"
                            value={data.fonction}
                            onChange={(e) => setData('fonction', e.target.value)}
                            className="w-full rounded border border-gray-300 px-3 py-2"
                        />
                    </div>

                    <div className="gap-1.5">
                        <Label>E-Mail</Label>
                        <Input
                            type="text"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </div>

                    <div className="gap-1.5">
                        <Label>Rôle</Label>
                        <Input
                            type="text"
                            value={data.role}
                            onChange={(e) =>
                                setData('role', e.target.value)
                            }
                        />
                    </div>

                    <Button disabled={processing} className="t-4" type="submit">
                        Mettre à jour le véhicule
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
