import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { CircleAlert } from 'lucide-react';
import { route } from 'ziggy-js';

interface piece {
    id: number;
    nom: string;
    prix: number;
    quantite: number;
    fournisseur_id: number;
}

interface Props {
    piece: piece;
    fournisseurs: { id: number; nom: string }[]; 
}

export default function Edit({ piece, fournisseurs }: Props) {
    const { processing, data, setData, post, errors } = useForm({
        id: piece.id,
        nom: piece.nom ?? '',
        prix: piece.prix ?? '',
        quantite: piece.quantite ?? '',
        fournisseur_id: piece.fournisseur_id ?? '',
    });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('pieces.update', piece.id), {
            forceFormData: true, // 👈 obligatoire pour que l'image + les autres champs passent
            method: 'put', // car update
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Modifier une pièce', href: `/pieces/${piece.id}/edit` }]}>
            <Head title="Mise à jour d'une pièce" />
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

                    <div className="gap-1.5">
                        <Label>Nom</Label>
                        <Input type="text" value={data.nom} onChange={(e) => setData('nom', e.target.value)} />
                    </div>

                    <div className="gap-1.5">
                        <Label>Fournisseur</Label>
                        <select
                            value={data.fournisseur_id}
                            onChange={(e) => setData('fournisseur_id', Number(e.target.value))}
                            className="w-full rounded border border-gray-300 px-3 py-2"
                        >
                            {fournisseurs.map((m) => (
                                <option key={m.id} value={m.id} className="bg-white text-black">
                                    {m.nom}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="gap-1.5">
                        <Label>Quantité</Label>
                        <Input type="text" value={data.quantite} onChange={(e) => setData('quantite', Number(e.target.value))} />
                    </div>

                    <Button disabled={processing} className="t-4" type="submit">
                        Mettre à jour le véhicule
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
