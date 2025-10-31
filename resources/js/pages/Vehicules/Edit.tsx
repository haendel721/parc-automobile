import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Car, CircleAlert, Upload } from 'lucide-react';
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
    dateAcquisition: string;
    photo: string;
    kilometrique: number;
}

interface Props {
    Vehicule: Vehicule;
    typesVehicules: { id: number; nom: string }[];
    carburants: { id: number; type: string }[];
    marques: { id: number; nom: string }[];
}

export default function Edit({ Vehicule, typesVehicules, carburants, marques }: Props) {
    const { processing, data, setData, post, errors } = useForm({
        id: Vehicule.id,
        immatriculation: Vehicule.immatriculation ?? '',
        marque_id: Vehicule.marque_id ?? '',
        model: Vehicule.model ?? '',
        typeVehicule_id: Vehicule.typeVehicule_id ?? '',
        couleur: Vehicule.couleur ?? '',
        photo: null,
        carburant_id: Vehicule.carburant_id ?? '',
        numSerie: Vehicule.numSerie ?? '',
        anneeFabrication: Vehicule.anneeFabrication ?? '',
        dateAcquisition: Vehicule.dateAcquisition ?? '',
        kilometrique: Vehicule.kilometrique ?? '',
    });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('vehicules.update', Vehicule.id), {
            forceFormData: true,
            method: 'put',
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Modifier un véhicule', href: `/vehicules/${Vehicule.id}/edit` }]}>
            <Head title="Mise à jour d'un véhicule" />

            <div className="container mx-auto max-w-10xl px-4 py-6">
                {/* En-tête */}
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
                            <h1 className="mb-2 text-3xl font-bold text-gray-900">Modifier le véhicule</h1>
                            {/* <p className="text-gray-600">Renseignez les informations du véhicule à ajouter à votre flotte</p> */}
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg bg-blue-50 px-4 py-3">
                        <Car className="h-8 w-8 text-blue-600" />
                        {/* <span className="text-sm font-medium text-blue-800">ID: {user.id}</span> */}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Formulaire principal */}
                    <div className="lg:col-span-2">
                        <Card className="border-0 shadow-lg">
                            <CardHeader className="border-b pb-4">
                                <CardTitle className="text-xl font-semibold text-gray-900">Informations générales</CardTitle>
                                <CardDescription className="text-gray-600">Modifiez les détails principaux du véhicule</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <form onSubmit={handleUpdate} className="space-y-6">
                                    {/* Erreurs */}
                                    {Object.keys(errors).length > 0 && (
                                        <Alert variant="destructive" className="mb-6">
                                            <CircleAlert className="h-4 w-4" />
                                            <AlertTitle>Erreur de validation</AlertTitle>
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

                                    {/* Grille responsive */}
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        {/* Immatriculation */}
                                        <div className="space-y-2">
                                            <Label htmlFor="immatriculation" className="text-sm font-medium">
                                                Immatriculation *
                                            </Label>
                                            <Input
                                                id="immatriculation"
                                                type="text"
                                                value={data.immatriculation}
                                                onChange={(e) => setData('immatriculation', e.target.value)}
                                                className="w-full"
                                                placeholder="AB-123-CD"
                                            />
                                        </div>

                                        {/* Marque */}
                                        <div className="space-y-2">
                                            <Label htmlFor="marque" className="text-sm font-medium">
                                                Marque *
                                            </Label>
                                            <Select value={data.marque_id.toString()} onValueChange={(value) => setData('marque_id', Number(value))}>
                                                <SelectTrigger id="marque" className="w-full">
                                                    <SelectValue placeholder="Sélectionnez une marque" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {marques.map((m) => (
                                                        <SelectItem key={m.id} value={m.id.toString()}>
                                                            {m.nom}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Modèle */}
                                        <div className="space-y-2">
                                            <Label htmlFor="model" className="text-sm font-medium">
                                                Modèle *
                                            </Label>
                                            <Input
                                                id="model"
                                                type="text"
                                                value={data.model}
                                                onChange={(e) => setData('model', e.target.value)}
                                                className="w-full"
                                                placeholder="Modèle du véhicule"
                                            />
                                        </div>

                                        {/* Type de véhicule */}
                                        <div className="space-y-2">
                                            <Label htmlFor="typeVehicule" className="text-sm font-medium">
                                                Type de véhicule *
                                            </Label>
                                            <Select
                                                value={data.typeVehicule_id.toString()}
                                                onValueChange={(value) => setData('typeVehicule_id', Number(value))}
                                            >
                                                <SelectTrigger id="typeVehicule" className="w-full">
                                                    <SelectValue placeholder="Type de véhicule" />
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
                                            <Label htmlFor="couleur" className="text-sm font-medium">
                                                Couleur
                                            </Label>
                                            <Input
                                                id="couleur"
                                                type="text"
                                                value={data.couleur}
                                                onChange={(e) => setData('couleur', e.target.value)}
                                                className="w-full"
                                                placeholder="Couleur du véhicule"
                                            />
                                        </div>

                                        {/* Carburant */}
                                        <div className="space-y-2">
                                            <Label htmlFor="carburant" className="text-sm font-medium">
                                                Carburant *
                                            </Label>
                                            <Select
                                                value={data.carburant_id.toString()}
                                                onValueChange={(value) => setData('carburant_id', Number(value))}
                                            >
                                                <SelectTrigger id="carburant" className="w-full">
                                                    <SelectValue placeholder="Type de carburant" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {carburants.map((c) => (
                                                        <SelectItem key={c.id} value={c.id.toString()}>
                                                            {c.type}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Numéro de série */}
                                        <div className="space-y-2">
                                            <Label htmlFor="numSerie" className="text-sm font-medium">
                                                Numéro de série
                                            </Label>
                                            <Input
                                                id="numSerie"
                                                type="text"
                                                value={data.numSerie}
                                                onChange={(e) => setData('numSerie', e.target.value)}
                                                className="w-full"
                                                placeholder="Numéro de série"
                                            />
                                        </div>

                                        {/* Année de fabrication */}
                                        <div className="space-y-2">
                                            <Label htmlFor="anneeFabrication" className="text-sm font-medium">
                                                Année de fabrication
                                            </Label>
                                            <Input
                                                id="anneeFabrication"
                                                type="number"
                                                min="1900"
                                                max={new Date().getFullYear()}
                                                value={data.anneeFabrication}
                                                onChange={(e) => setData('anneeFabrication', Number(e.target.value))}
                                                className="w-full"
                                                placeholder="2024"
                                            />
                                        </div>

                                        {/* Date d'acquisition */}
                                        <div className="space-y-2">
                                            <Label htmlFor="dateAcquisition" className="text-sm font-medium">
                                                Date d'acquisition
                                            </Label>
                                            <Input
                                                id="dateAcquisition"
                                                type="date"
                                                value={data.dateAcquisition}
                                                onChange={(e) => setData('dateAcquisition', e.target.value)}
                                                className="w-full"
                                            />
                                        </div>

                                        {/* Kilométrage */}
                                        <div className="space-y-2">
                                            <Label htmlFor="kilometrique" className="text-sm font-medium">
                                                Kilométrage
                                            </Label>
                                            <Input
                                                id="kilometrique"
                                                type="number"
                                                min="0"
                                                value={data.kilometrique}
                                                onChange={(e) => setData('kilometrique', Number(e.target.value))}
                                                className="w-full"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>

                                    {/* Photo */}
                                    <div className="space-y-4 border-t pt-4">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">Photo du véhicule</Label>

                                            {/* Photo existante */}
                                            {Vehicule.photo && (
                                                <div className="mb-4">
                                                    <p className="mb-2 text-sm text-gray-600">Photo actuelle :</p>
                                                    <div className="relative inline-block">
                                                        <img
                                                            src={`/storage/${Vehicule.photo}`}
                                                            alt="Photo du véhicule"
                                                            className="h-32 w-48 rounded-lg border object-cover shadow-sm"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Upload de nouvelle photo */}
                                            <div className="flex w-full items-center justify-center">
                                                <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition-colors hover:border-blue-400">
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <Upload className="mb-3 h-8 w-8 text-gray-400" />
                                                        <p className="mb-2 text-sm text-gray-500">
                                                            <span className="font-semibold">Cliquez pour uploader</span> ou glissez-déposez
                                                        </p>
                                                        <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 10MB)</p>
                                                    </div>
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            if (e.target.files && e.target.files[0]) {
                                                                setData('photo', e.target.files[0]);
                                                            }
                                                        }}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bouton de soumission */}
                                    <div className="flex justify-end border-t pt-6">
                                        <div className="flex gap-3">
                                            <Button type="button" variant="outline" onClick={() => window.history.back()} disabled={processing}>
                                                Annuler
                                            </Button>
                                            <Button type="submit" disabled={processing} className="min-w-32">
                                                {processing ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                        Mise à jour...
                                                    </div>
                                                ) : (
                                                    'Mettre à jour'
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - Informations complémentaires */}
                    {/* <div className="space-y-6">
                        <Card className="shadow-lg border-0 bg-blue-50 border-blue-100">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg font-semibold text-blue-900">
                                    Résumé du véhicule
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-blue-700">Immatriculation</span>
                                    <span className="font-medium text-blue-900">{Vehicule.immatriculation}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-blue-700">Modèle</span>
                                    <span className="font-medium text-blue-900">{Vehicule.model}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-blue-700">Kilométrage actuel</span>
                                    <span className="font-medium text-blue-900">
                                        {Vehicule.kilometrique.toLocaleString()} km
                                    </span>
                                </div>
                            </CardContent>
                        </Card> */}

                    {/* Carte conseils */}
                    {/* <Card className="shadow-lg border-0">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg font-semibold">
                                    Conseils
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <p className="text-sm text-gray-600">
                                        Vérifiez que toutes les informations sont correctes avant de sauvegarder.
                                    </p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <p className="text-sm text-gray-600">
                                        Les champs marqués d'un * sont obligatoires.
                                    </p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <p className="text-sm text-gray-600">
                                        La photo doit être nette et montrer clairement le véhicule.
                                    </p>
                                </div>
                            </CardContent>
                        </Card> */}
                    {/* </div> */}
                </div>
            </div>
        </AppLayout>
    );
}
