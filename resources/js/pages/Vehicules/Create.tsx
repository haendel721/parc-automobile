import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Car, CircleAlert, Upload } from 'lucide-react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Créer un nouveau véhicule',
        href: '/vehicules/create',
    },
];

type PageProps = {
    carburants: { id: number; type: string }[];
    typesVehicules: { id: number; nom: string }[];
    marques: { id: number; nom: string }[];
};

export default function Index() {
    const { carburants, typesVehicules, marques } = usePage<PageProps>().props;
    const { data, setData, post, processing, errors } = useForm({
        immatriculation: '',
        marque_id: '',
        model: '',
        typeVehicule_id: '',
        couleur: '',
        photo: '',
        carburant_id: '',
        numSerie: '',
        anneeFabrication: '',
        dateAcquisition: '',
        kilometrage: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        console.log(data);
        e.preventDefault();
        post(route('vehicules.store'));
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Accueil', href: '/dashboard' },
                { title: 'Véhicules', href: '/vehicules' },
                { title: 'Ajouter un vehicule', href: '/vehicules/create' },
            ]}
        >
            <Head title="Créer un nouveau véhicule" />

            {/* <div className="mx-auto max-w-10xl"> */}
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-center justify-between">
                    <div className="mb-6">
                        <Link href={route('vehicules.index')}>
                            <Button variant="outline" className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" /> Retour à la liste
                            </Button>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div>
                            <h1 className="mb-2 text-3xl font-bold text-gray-900">Nouveau Véhicule</h1>
                            {/* <p className="text-gray-600">Renseignez les informations du véhicule à ajouter à votre flotte</p> */}
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg bg-blue-50 px-4 py-3">
                        <Car className="h-8 w-8 text-blue-600" />
                        {/* <span className="text-sm font-medium text-blue-800">ID: {user.id}</span> */}
                    </div>
                </div>

                {/* Form Container */}
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
                    <form onSubmit={handleSubmit} className="p-6 sm:p-8" encType="multipart/form-data">
                        {/* Error Alert */}
                        {Object.keys(errors).length > 0 && (
                            <Alert variant="destructive" className="mb-6">
                                <CircleAlert className="h-4 w-4" />
                                <AlertTitle className="flex items-center gap-2">
                                    <span>Erreurs de validation</span>
                                </AlertTitle>
                                <AlertDescription>
                                    <ul className="list-inside list-disc space-y-1">
                                        {Object.entries(errors).map(([key, message]) => (
                                            <li key={key} className="text-sm">
                                                {message as string}
                                            </li>
                                        ))}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Form Grid */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Immatriculation */}
                            <div className="space-y-2">
                                <Label htmlFor="immatriculation" className="text-sm font-medium text-gray-700">
                                    Immatriculation
                                </Label>
                                <Input
                                    id="immatriculation"
                                    type="text"
                                    placeholder="5029 TBA"
                                    value={data.immatriculation}
                                    onChange={(e) => setData('immatriculation', e.target.value)}
                                    className="w-full transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Marque */}
                            <div className="space-y-2">
                                <Label htmlFor="marque_id" className="text-sm font-medium text-gray-700">
                                    Marque du véhicule
                                </Label>
                                <select
                                    id="marque_id"
                                    value={data.marque_id}
                                    onChange={(e) => setData('marque_id', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Choisir une marque</option>
                                    {marques.map((marque) => (
                                        <option key={marque.id} value={marque.id}>
                                            {marque.nom}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Modèle */}
                            <div className="space-y-2">
                                <Label htmlFor="model" className="text-sm font-medium text-gray-700">
                                    Modèle *
                                </Label>
                                <Input
                                    id="model"
                                    type="text"
                                    placeholder="Toyota Corolla"
                                    value={data.model}
                                    onChange={(e) => setData('model', e.target.value)}
                                    className="w-full transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Type de véhicule */}
                            <div className="space-y-2">
                                <Label htmlFor="typeVehicule" className="text-sm font-medium text-gray-700">
                                    Type de véhicule *
                                </Label>
                                <select
                                    id="typeVehicule"
                                    value={data.typeVehicule_id}
                                    onChange={(e) => setData('typeVehicule_id', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Choisir un type</option>
                                    {typesVehicules.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.nom}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Couleur */}
                            <div className="space-y-2">
                                <Label htmlFor="couleur" className="text-sm font-medium text-gray-700">
                                    Couleur
                                </Label>
                                <Input
                                    id="couleur"
                                    type="text"
                                    placeholder="Rouge"
                                    value={data.couleur}
                                    onChange={(e) => setData('couleur', e.target.value)}
                                    className="w-full transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Carburant */}
                            <div className="space-y-2">
                                <Label htmlFor="carburant" className="text-sm font-medium text-gray-700">
                                    Carburant *
                                </Label>
                                <select
                                    id="carburant"
                                    value={data.carburant_id}
                                    onChange={(e) => setData('carburant_id', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Choisir un carburant</option>
                                    {carburants.map((carburant) => (
                                        <option key={carburant.id} value={carburant.id}>
                                            {carburant.type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Numéro de série */}
                            <div className="space-y-2">
                                <Label htmlFor="numSerie" className="text-sm font-medium text-gray-700">
                                    Numéro de série
                                </Label>
                                <Input
                                    id="numSerie"
                                    placeholder="Numéro de série"
                                    value={data.numSerie}
                                    onChange={(e) => setData('numSerie', e.target.value)}
                                    className="w-full transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Année de fabrication */}
                            <div className="space-y-2">
                                <Label htmlFor="anneeFabrication" className="text-sm font-medium text-gray-700">
                                    Année de fabrication
                                </Label>
                                <Input
                                    id="anneeFabrication"
                                    type="number"
                                    placeholder="2023"
                                    value={data.anneeFabrication}
                                    onChange={(e) => setData('anneeFabrication', e.target.value)}
                                    className="w-full transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Kilométrage */}
                            <div className="space-y-2">
                                <Label htmlFor="kilometrage" className="text-sm font-medium text-gray-700">
                                    Kilométrage
                                </Label>
                                <Input
                                    id="kilometrage"
                                    type="number"
                                    placeholder="0"
                                    value={data.kilometrage}
                                    onChange={(e) => setData('kilometrage', e.target.value)}
                                    className="w-full transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Date d'acquisition */}
                            <div className="space-y-2">
                                <Label htmlFor="dateAcquisition" className="text-sm font-medium text-gray-700">
                                    Date d'acquisition
                                </Label>
                                <Input
                                    id="dateAcquisition"
                                    type="date"
                                    value={data.dateAcquisition}
                                    onChange={(e) => setData('dateAcquisition', e.target.value)}
                                    className="w-full transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Photo - Full width */}
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="photo" className="text-sm font-medium text-gray-700">
                                    Photo du véhicule
                                </Label>
                                <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-all duration-200 hover:border-blue-400 hover:bg-blue-50">
                                    <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                                    <p className="mb-2 text-sm text-gray-600">Glissez-déposez votre image ou cliquez pour parcourir</p>
                                    <Input id="photo" type="file" onChange={(e) => setData('photo', e.target.files?.[0] || '')} className="hidden" />
                                    <Label
                                        htmlFor="photo"
                                        className="inline-flex cursor-pointer items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-700"
                                    >
                                        <Upload className="mr-2 h-4 w-4" />
                                        Choisir un fichier
                                    </Label>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-6 flex justify-end border-t border-gray-200 pt-6">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="transform rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-2.5 font-medium text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl disabled:transform-none disabled:opacity-50"
                            >
                                {processing ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Ajout en cours...
                                    </div>
                                ) : (
                                    'Ajouter le véhicule/sauvegarder'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
            {/* </div> */}
        </AppLayout>
    );
}
