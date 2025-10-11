import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { CircleAlert } from 'lucide-react';
import { route } from 'ziggy-js';

type Entretien = {
    id: number;
    vehicule_id: number;
    type: string;
    cout: number;
    piece_remplacee: string;
    probleme: string;
    recommandation: string;
    description: string;
    prochaine_visite: string;
    dernier_visite: string;
    derniere_vidange: string;
    fournisseur_id: number;
    fournisseur?: { id: number; nom: string };
};

interface Props {
    entretien: Entretien;
    fournisseurs: { id: number; nom: string }[];
    vehicules: { id: number; immatriculation: string }[];
}

export default function Edit({ entretien, fournisseurs, vehicules, userConnecter }: Props) {
    const formatDatetimeLocal = (dateStr: string) => {
        if (!dateStr) return '';
        const dt = new Date(dateStr);
        const year = dt.getFullYear();
        const month = String(dt.getMonth() + 1).padStart(2, '0');
        const day = String(dt.getDate()).padStart(2, '0');
        const hours = String(dt.getHours()).padStart(2, '0');
        const minutes = String(dt.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };
    const { processing, data, setData, post, errors } = useForm({
        vehicule_id: entretien.vehicule_id ?? '',
        probleme: entretien.probleme ?? '',
        description: entretien.description ?? '',
        prochaine_visite: formatDatetimeLocal(entretien.prochaine_visite) ?? '',
    });
    console.log(data);
    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('entretiens.update', entretien.id), {
            forceFormData: true,
            method: 'put',
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Modifier un entretien', href: `/entretiens/${entretien.id}/edit` }]}>
            <Head title="Mise à jour d'un entretien" />

            <div className="w-8/12 p-4">
                <form onSubmit={handleUpdate} className="flex flex-col space-y-4">
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
                    {/* userConnecter === 'admin'  */}
                    <>
                        <div className="gap-1.5">
                            <Label>Immatriculation du vehicule</Label>
                            <select
                                value={data.vehicule_id}
                                onChange={(e) => setData('vehicule_id', Number(e.target.value))}
                                className="w-full rounded border border-gray-300 px-3 py-2"
                            >
                                <option value="">-- Choisir un fournisseur --</option>
                                {vehicules.map((v) => (
                                    <option key={v.id} value={v.id} className="bg-white text-black">
                                        {v.immatriculation}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="gap-1.5">
                            <Label>Problème</Label>
                            <Textarea value={data.probleme} onChange={(e) => setData('probleme', e.target.value)} />
                        </div>
                        <div className="gap-1.5">
                            <Label>Description</Label>
                            <Textarea value={data.description} onChange={(e) => setData('description', e.target.value)} />
                        </div>
                        <div className="gap-1.5">
                            <Label>Prochaine visite</Label>
                            <Input type="datetime-local" value={data.prochaine_visite} onChange={(e) => setData('prochaine_visite', e.target.value)} />
                        </div>
                    </>

                    <Button disabled={processing} className="t-4" type="submit">
                        Mettre à jour l’entretien
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
