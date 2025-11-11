import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
        photo: null as File | null,
        carburant_id: '',
        numSerie: '',
        anneeFabrication: '',
        dateAcquisition: '',
        kilometrage: '',
        capacite_reservoir: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('vehicules.store'), {
            forceFormData: true,
        });
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

            <div className="max-w-10xl container mx-auto px-4 py-6">
                {/* En-tête */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="mb-6">
                        <Link href={route('vehicules.index')}>
                            <Button variant="outline" className="flex items-center gap-2 bg-gray-700 text-gray-200 hover:bg-gray-600">
                                <ArrowLeft className="h-4 w-4" /> Retour à la liste
                            </Button>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div>
                            <h1 className="mb-2 text-3xl font-bold text-gray-200">Nouveau Véhicule</h1>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg bg-gray-800 px-4 py-3">
                        <Car className="h-8 w-8 text-blue-400" />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {/* Formulaire principal */}
                    <div>
                        <Card className="border-0 shadow-lg bg-gray-900/90">
                            <CardHeader className="border-b border-gray-700 pb-4">
                                <CardTitle className="text-xl font-semibold text-gray-200">Informations du véhicule</CardTitle>
                                <CardDescription className="text-gray-300">
                                    Renseignez les informations du véhicule à ajouter à votre flotte
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
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
                                            <Label htmlFor="immatriculation" className="text-lg font-medium text-gray-100">
                                                Immatriculation
                                            </Label>
                                            <Input
                                                id="immatriculation"
                                                type="text"
                                                placeholder="5029 TBA"
                                                value={data.immatriculation}
                                                onChange={(e) => setData('immatriculation', e.target.value)}
                                                className="w-full text-gray-100 bg-gray-800 border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>

                                        {/* Marque */}
                                        <div className="space-y-2">
                                            <Label htmlFor="marque_id" className="text-lg font-medium text-gray-100">
                                                Marque du véhicule
                                            </Label>
                                            <Select value={data.marque_id} onValueChange={(value) => setData('marque_id', value)}>
                                                <SelectTrigger id="marque_id" className="w-full text-gray-100 bg-gray-800 border-gray-600">
                                                    <SelectValue placeholder="Choisir une marque" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {marques.map((marque) => (
                                                        <SelectItem key={marque.id} value={marque.id.toString()}>
                                                            {marque.nom}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Modèle */}
                                        <div className="space-y-2">
                                            <Label htmlFor="model" className="text-lg font-medium text-gray-100">
                                                Modèle  
                                            </Label>
                                            <Input
                                                id="model"
                                                type="text"
                                                placeholder="Toyota Corolla"
                                                value={data.model}
                                                onChange={(e) => setData('model', e.target.value)}
                                                className="w-full text-gray-100 bg-gray-800 border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>

                                        {/* Type de véhicule */}
                                        <div className="space-y-2">
                                            <Label htmlFor="typeVehicule_id" className="text-lg font-medium text-gray-100">
                                                Type de véhicule  
                                            </Label>
                                            <Select value={data.typeVehicule_id} onValueChange={(value) => setData('typeVehicule_id', value)}>
                                                <SelectTrigger id="typeVehicule_id" className="w-full text-gray-100 bg-gray-800 border-gray-600">
                                                    <SelectValue placeholder="Choisir un type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {typesVehicules.map((type) => (
                                                        <SelectItem key={type.id} value={type.id.toString()}>
                                                            {type.nom}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Couleur */}
                                        <div className="space-y-2">
                                            <Label htmlFor="couleur" className="text-lg font-medium text-gray-100">
                                                Couleur
                                            </Label>
                                            <Input
                                                id="couleur"
                                                type="text"
                                                placeholder="Rouge"
                                                value={data.couleur}
                                                onChange={(e) => setData('couleur', e.target.value)}
                                                className="w-full text-gray-100 bg-gray-800 border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>

                                        {/* Carburant   */}
                                        <div className="space-y-2">
                                            <Label htmlFor="carburant_id" className="text-lg font-medium text-gray-100">
                                                Carburant *
                                            </Label>
                                            <Select value={data.carburant_id} onValueChange={(value) => setData('carburant_id', value)}>
                                                <SelectTrigger id="carburant_id" className="w-full text-gray-100 bg-gray-800 border-gray-600">
                                                    <SelectValue placeholder="Choisir un carburant" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {carburants.map((carburant) => (
                                                        <SelectItem key={carburant.id} value={carburant.id.toString()}>
                                                            {carburant.type}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Numéro de série */}
                                        <div className="space-y-2">
                                            <Label htmlFor="numSerie" className="text-lg font-medium text-gray-100">
                                                Numéro de série
                                            </Label>
                                            <Input
                                                id="numSerie"
                                                placeholder="Numéro de série"
                                                value={data.numSerie}
                                                onChange={(e) => setData('numSerie', e.target.value)}
                                                className="w-full text-gray-100 bg-gray-800 border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>

                                        {/* Année de fabrication */}
                                        <div className="space-y-2">
                                            <Label htmlFor="capacite_reservoir" className="text-lg font-medium text-gray-100">
                                                Capacité du réservoir (en litres)
                                            </Label>
                                            <Input
                                                id="capacite_reservoir"
                                                type="number"
                                                placeholder="10"
                                                value={data.capacite_reservoir}
                                                onChange={(e) => setData('capacite_reservoir', e.target.value)}
                                                className="w-full text-gray-100 bg-gray-800 border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>

                                        {/* Kilométrage */}
                                        <div className="space-y-2">
                                            <Label htmlFor="kilometrage" className="text-lg font-medium text-gray-100">
                                                Kilométrage
                                            </Label>
                                            <Input
                                                id="kilometrage"
                                                type="number"
                                                placeholder="0"
                                                value={data.kilometrage}
                                                onChange={(e) => setData('kilometrage', e.target.value)}
                                                className="w-full text-gray-100 bg-gray-800 border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>

                                        {/* Date d'acquisition */}
                                        <div className="space-y-2">
                                            <Label htmlFor="dateAcquisition" className="text-lg font-medium text-gray-100">
                                                Date d'acquisition
                                            </Label>
                                            <Input
                                                id="dateAcquisition"
                                                type="date"
                                                value={data.dateAcquisition}
                                                onChange={(e) => setData('dateAcquisition', e.target.value)}
                                                className="w-full text-gray-100 bg-gray-800 border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                        {/* Année de fabrication */}
                                        <div className="space-y-2">
                                            <Label htmlFor="anneeFabrication" className="text-lg font-medium text-gray-100">
                                                Année de fabrication
                                            </Label>
                                            <Input
                                                id="anneeFabrication"
                                                type="number"
                                                placeholder="2023"
                                                value={data.anneeFabrication}
                                                onChange={(e) => setData('anneeFabrication', e.target.value)}
                                                className="w-full text-gray-100 bg-gray-800 border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>

                                        {/* Photo - Full width */}
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="photo" className="text-lg font-medium text-gray-100">
                                                Photo du véhicule
                                            </Label>
                                            <div className="rounded-lg border-2 border-dashed border-gray-600 p-6 text-center transition-all duration-200 hover:border-blue-400 hover:bg-gray-800/50">
                                                <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                                                <p className="mb-2 text-sm text-gray-300">Glissez-déposez votre image ou cliquez pour parcourir</p>
                                                <Label
                                                    htmlFor="photo"
                                                    className="inline-flex cursor-pointer items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-700"
                                                >
                                                    <Upload className="mr-2 h-4 w-4" />
                                                    Choisir un fichier
                                                </Label>
                                                <Input 
                                                    id="photo" 
                                                    type="file" 
                                                    accept="image/*"
                                                    onChange={(e) => setData('photo', e.target.files?.[0] || null)} 
                                                    className="hidden" 
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="mt-6 flex justify-end gap-4 border-t border-gray-700 pt-6">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="min-w-32 bg-blue-600 hover:bg-blue-700 text-white"
                                        >
                                            {processing ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                    en cours d'enregistrement...
                                                </div>
                                            ) : (
                                                'sauvegarder'
                                            )}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => window.history.back()}
                                            className="text-gray-300 bg-gray-700 border-gray-600 hover:bg-gray-800 hover:text-gray-100"
                                        >
                                            Annuler
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}