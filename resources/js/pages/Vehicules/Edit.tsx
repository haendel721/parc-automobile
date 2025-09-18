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
}

interface Props {
    Vehicule: Vehicule;
    typesVehicules: { id: number; nom: string }[]; // injectés depuis Laravel
    carburants: { id: number; type: string }[];
    marques: {id: number ; nom: string}[];
}

export default function Edit({ Vehicule, typesVehicules, carburants , marques }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        immatriculation: Vehicule.immatriculation,
        marque_id: Vehicule.marque_id,
        model: Vehicule.model,
        typeVehicule_id: Vehicule.typeVehicule_id,
        couleur: Vehicule.couleur,
        carburant_id: Vehicule.carburant_id,
        numSerie: Vehicule.numSerie,
        anneeFabrication: Vehicule.anneeFabrication,
        dateAcquisition: Vehicule.dateAcquisition,
    });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('vehicules.update', Vehicule.id));
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Modifier un véhicule', href: `/vehicules/${Vehicule.id}/edit` },
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

                    {/* Immatriculation */}
                    <div className="gap-1.5">
                        <Label>Immatriculation</Label>
                        <Input
                            type="text"
                            value={data.immatriculation}
                            onChange={(e) => setData('immatriculation', e.target.value)}
                        />
                    </div>

                    {/* marque */}
                    <div className="gap-1.5">
                        <Label>Marque</Label>
                        <select
                            id="marques"
                            value={data.marque_id}
                            onChange={(e) => setData('marque_id', Number(e.target.value))}
                            className="w-full rounded border border-gray-300 px-3 py-2"
                        >
                            {marques.map((m) => (
                                <option key={m.id} value={m.id} className='bg-white text-black'>
                                    {m.nom}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Modèle */}
                    <div className="gap-1.5">
                        <Label>Modèle</Label>
                        <Input
                            type="text"
                            value={data.model}
                            onChange={(e) => setData('model', e.target.value)}
                        />
                    </div>

                    {/* Type de véhicule */}
                    <div className="gap-1.5">
                        <Label>Type de véhicule</Label>
                        <select
                            id="typeVehicule"
                            value={data.typeVehicule_id}
                            onChange={(e) => setData('typeVehicule_id', Number(e.target.value))}
                            className="w-full rounded border border-gray-300 px-3 py-2"
                        >
                            {typesVehicules.map((type) => (
                                <option key={type.id} value={type.id} className='bg-white text-black'>
                                    {type.nom}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Couleur */}
                    <div className="gap-1.5">
                        <Label>Couleur</Label>
                        <Input
                            type="text"
                            value={data.couleur}
                            onChange={(e) => setData('couleur', e.target.value)}
                        />
                    </div>

                    {/* Carburant */}
                    <div className="gap-1.5">
                        <Label>Carburant</Label>
                        <select
                            id="carburant"
                            value={data.carburant_id}
                            onChange={(e) => setData('carburant_id', Number(e.target.value))}
                            className="w-full rounded border border-gray-300 px-3 py-2"
                        >
                            {carburants.map((c) => (
                                <option key={c.id} value={c.id} className='bg-white text-black'>
                                    {c.type}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Numéro de série */}
                    <div className="gap-1.5">
                        <Label>Numéro de série</Label>
                        <Input
                            type="text"
                            value={data.numSerie}
                            onChange={(e) => setData('numSerie', e.target.value)}
                        />
                    </div>

                    {/* Année de fabrication */}
                    <div className="gap-1.5">
                        <Label>Année de fabrication</Label>
                        <Input
                            type="number"
                            value={data.anneeFabrication}
                            onChange={(e) =>
                                setData('anneeFabrication', Number(e.target.value))
                            }
                        />
                    </div>

                    {/* Date d’acquisition */}
                    <div className="gap-1.5">
                        <Label>Date d’acquisition</Label>
                        <Input
                            type="date"
                            value={data.dateAcquisition}
                            onChange={(e) => setData('dateAcquisition', e.target.value)}
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
