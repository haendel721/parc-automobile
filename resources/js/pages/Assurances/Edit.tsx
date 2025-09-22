import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { CircleAlert } from 'lucide-react';
import { route } from 'ziggy-js';

interface Vehicule {
    id: number;
    immatriculation: string;
    marque_id: number;
    model: string;
    typeVehicule_id: number;
    couleur: string;
    carburant_id: number;
    numSerie: string;
    anneeFabrication: number;
    dateAcquisition: string; // garder string (format date ISO)
    photo: string;
}
interface assurance {
    id: number;
    vehicule_id: number;
    NomCompagnie: string;
    NumContrat: string;
    cout: number;
    dateDebut: Date;
    dateFin: Date;
}

interface Props {
    Vehicule: Vehicule;
    assurance: assurance;
}

export default function Edit({ assurance , Vehicule }: Props) {
    const { processing, data, setData, post, errors } = useForm({
        id: assurance.id,
        vehicule_id: assurance.vehicule_id,
        NomCompagnie: assurance.NomCompagnie,
        NumContrat: assurance.NumContrat,
        cout: assurance.cout,
        dateDebut: assurance.dateDebut,
        dateFin: assurance.dateFin,
    });
    console.log(data)
    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('assurances.update', assurance.id), {
            forceFormData: true, // 👈 obligatoire pour que l'image + les autres champs passent
            method: 'put', // car update
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Modifier un assurance', href: `/assurances/${assurance.id}/edit` }]}>
            <Head title="Mise à jour d'un Assurance" />
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
                        <Label>Immatriculation du vehicule</Label>
                        <select
                            value={data.vehicule_id}
                            onChange={(e) => setData('vehicule_id', Number(e.target.value))}
                            className="w-full rounded border border-gray-300 px-3 py-2"
                        >
                            <option value="">--Choisir l'immatriculation du voiture--</option>
                            {Vehicule?.map((v: any) => (
                                <option key={v.id} value={v.id} className="bg-white text-black">
                                    {v.immatriculation}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="gap-1.5">
                        <Label>Nom du Compagnie</Label>
                        <Input type="text" value={data.NomCompagnie} onChange={(e) => setData('NomCompagnie', e.target.value)} />
                    </div>

                    <div className="gap-1.5">
                        <Label>Identifiant du contrat</Label>
                        <Input type="text" value={data.NumContrat} onChange={(e) => setData('NumContrat', e.target.value)} />
                    </div>

                    <div className="gap-1.5">
                        <Label>Coût</Label>
                        <Input type="text" value={data.cout} onChange={(e) => setData('cout', e.target.value)} />
                    </div>

                    <div className="gap-1.5">
                        <Label>Date début</Label>
                        <Input type="date" value={data.dateDebut} onChange={(e) => setData('dateDebut', e.target.value)} />
                    </div>

                    <div className="gap-1.5">
                        <Label>Date début</Label>
                        <Input type="date" value={data.dateFin} onChange={(e) => setData('dateFin', e.target.value)} />
                    </div>
                    
                    <Button disabled={processing} className="t-4" type="submit">
                        Mettre à jour le véhicule
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
