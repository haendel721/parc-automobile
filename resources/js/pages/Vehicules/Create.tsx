import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm , usePage } from '@inertiajs/react';
import { CircleAlert } from 'lucide-react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Créer un nouveaux vehicule ',
        href: '/vehicules/create',
    },
];

export default function Index() {
    const { props } = usePage();
     const { carburants, typesVehicules, marques } = props; // données envoyées depuis Laravel
    const { data, setData, post, processing, errors } = useForm({
        immatriculation: '',
        marque_Id: '',
        model: '',
        typeVehicule_id: '',
        couleur: '',
        carburant_id: '',
        numSerie: '',
        anneeFabrication: '',
        dateAcquisition: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        console.log(data);
        e.preventDefault();
        post(route('vehicules.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Créer un nouveaux vehicule" />
            <div className="w-8/12 p-4">
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
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
                        <Label htmlFor="vehicule immatriculation">Immatriculation</Label>
                        <Input
                            type="text"
                            placeholder="5029 TBA"
                            value={data.immatriculation}
                            onChange={(e) => setData('immatriculation', e.target.value)}
                        />
                    </div>
                    <div className="gap-1.5">
                        <Label htmlFor="marque_Id">Marque du véhicule</Label>
                        <select
                            id="marque_Id"
                            value={data.marque_Id}
                            onChange={(e) => setData('marque_Id', e.target.value)}
                            className="w-full rounded border border-gray-300 px-3 py-2"
                        >
                            <option value="">--Choisir une marque de voiture--</option>
                            {marques.map((type: any) => (
                                <option key={type.id} value={type.id} className='bg-white text-black'>
                                    {type.nom}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="gap-1.5">
                        <Label htmlFor="vehicule model ">Model</Label>
                        <Input 
                            type='text' 
                            placeholder="Toyota" 
                            value={data.model} 
                            onChange={(e) => setData('model', e.target.value)} />
                    </div>
                    <div className="gap-1.5">
                        <Label htmlFor="typeVehicule">Type de véhicule</Label>
                        <select
                            id="typeVehicule"
                            value={data.typeVehicule_id}
                            onChange={(e) => setData('typeVehicule_id', e.target.value)}
                            className="w-full rounded border border-gray-300 px-3 py-2"
                        >
                            <option value="">--Choisir un type de vehicule--</option>
                            {typesVehicules.map((type: any) => (
                                <option key={type.id} value={type.id} className='bg-white text-black'>
                                    {type.nom}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="gap-1.5">
                        <Label htmlFor="vehicule couleur ">Couleur</Label>
                        <Input 
                            type='text' 
                            placeholder="rouge" 
                            value={data.couleur} 
                            onChange={(e) => setData('couleur', e.target.value)} />
                    </div>
                    <div className="gap-1.5">
                        <Label htmlFor="carburant">Carburant</Label>
                        <select
                            id="carburant"
                            value={data.carburant_id}
                            onChange={(e) => setData('carburant_id', e.target.value)}
                            className="w-full rounded border border-gray-300 px-3 py-2"
                        >
                            <option value="">--Choisir un type de carburant--</option>
                            {carburants.map((c: any) => (
                                <option key={c.id} value={c.id} className='bg-white text-black'>
                                    {c.type}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="gap-1.5">
                        <Label htmlFor="vehicule numéro de dérie ">Numéro de série</Label>
                        <Input 
                            placeholder="numéro de série" 
                            value={data.numSerie} 
                            onChange={(e) => setData('numSerie', e.target.value)} />
                    </div>
                    <div className="gap-1.5">
                        <Label htmlFor='Année de fabrication'>Année de fabrication</Label>
                        <Input 
                            type='number' 
                            value={data.anneeFabrication}
                            onChange={(e) => setData('anneeFabrication',e.target.value)} />
                    </div>
                    <div className="gap-1.5">
                        <Label htmlFor='Date d acquisition'>date d'acquisition du vehicule</Label>
                        <Input 
                            type='date' 
                            value={data.dateAcquisition}
                            onChange={(e) => setData('dateAcquisition',e.target.value)} />
                    </div>
                    <Button disabled={processing} className="t-4" type="submit">
                        Ajouter
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
