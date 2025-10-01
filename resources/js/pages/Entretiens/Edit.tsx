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

export default function Edit({ entretien, fournisseurs , vehicules }: Props) {
    const { processing, data, setData, post, errors } = useForm({
        id: entretien.id,
        vehicule_id: entretien.vehicule_id ?? '',
        type: entretien.type ?? '',
        cout: entretien.cout ?? '',
        piece_remplacee: entretien.piece_remplacee ?? '',
        probleme: entretien.probleme ?? '',
        recommandation: entretien.recommandation ?? '',
        description: entretien.description ?? '',
        prochaine_visite: entretien.prochaine_visite ?? '',
        dernier_visite: entretien.dernier_visite ?? '',
        derniere_vidange: entretien.derniere_vidange ?? '',
        fournisseur_id: entretien.fournisseur_id ?? '',
    });

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

                    {/* Fournisseur */}
                    <div className="gap-1.5">
                        <Label>Fournisseur</Label>
                        <select
                            value={data.fournisseur_id}
                            onChange={(e) => setData('fournisseur_id', Number(e.target.value))}
                            className="w-full rounded border border-gray-300 px-3 py-2"
                        >
                            <option value="">-- Choisir un fournisseur --</option>
                            {fournisseurs.map((f) => (
                                <option key={f.id} value={f.id} className="bg-white text-black">
                                    {f.nom}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Vehicule */}
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

                    {/* Type */}
                    <div className="gap-1.5">
                        <Label>Type d’entretien</Label>
                        <Input type="text" value={data.type} onChange={(e) => setData('type', e.target.value)} />
                    </div>

                    {/* Coût */}
                    <div className="gap-1.5">
                        <Label>Coût</Label>
                        <Input type="number" value={data.cout} onChange={(e) => setData('cout', Number(e.target.value))} />
                    </div>

                    {/* Pièce remplacée */}
                    <div className="gap-1.5">
                        <Label>Pièce remplacée</Label>
                        <Input type="text" value={data.piece_remplacee} onChange={(e) => setData('piece_remplacee', e.target.value)} />
                    </div>

                    {/* Problème */}
                    <div className="gap-1.5">
                        <Label>Problème</Label>
                        <Textarea value={data.probleme} onChange={(e) => setData('probleme', e.target.value)} />
                    </div>

                    {/* Recommandation */}
                    <div className="gap-1.5">
                        <Label>Recommandation</Label>
                        <Textarea value={data.recommandation} onChange={(e) => setData('recommandation', e.target.value)} />
                    </div>

                    {/* Description */}
                    <div className="gap-1.5">
                        <Label>Description</Label>
                        <Textarea value={data.description} onChange={(e) => setData('description', e.target.value)} />
                    </div>

                    {/* Dates */}
                    <div className="gap-1.5">
                        <Label>Prochaine visite</Label>
                        <Input type="date" value={data.prochaine_visite} onChange={(e) => setData('prochaine_visite', e.target.value)} />
                    </div>

                    <div className="gap-1.5">
                        <Label>Dernière visite</Label>
                        <Input type="date" value={data.dernier_visite} onChange={(e) => setData('dernier_visite', e.target.value)} />
                    </div>

                    <div className="gap-1.5">
                        <Label>Dernière vidange</Label>
                        <Input type="date" value={data.derniere_vidange} onChange={(e) => setData('derniere_vidange', e.target.value)} />
                    </div>

                    <Button disabled={processing} className="t-4" type="submit">
                        Mettre à jour l’entretien
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
