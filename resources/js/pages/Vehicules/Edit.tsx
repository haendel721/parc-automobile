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
    capacite_reservoir:number;
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
        capacite_reservoir:Vehicule.capacite_reservoir ?? '',
    });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('vehicules.update', Vehicule.id), {
            forceFormData: true,
            method: 'put',
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Accueil', href: '/dashboard' },
                { title: 'Véhicules', href: '/vehicules' },
                { title: `Modifier le véhicule   ${Vehicule.immatriculation}`, href: `/vehicules/${Vehicule.id}/edit` },
            ]}
        >
            <Head title="Mise à jour d'un véhicule" />

            <div className="max-w-10xl container mx-auto px-4 py-6">
                {/* En-tête */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="mb-6">
                        <Link href={route('vehicules.index')}>
                            <Button variant="outline" className="flex items-center gap-2 bg-gray-500">
                                <ArrowLeft className="h-4 w-4" /> Retour à la liste
                            </Button>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div>
                            <h1 className="mb-2 text-3xl font-bold text-gray-200">Modifier le véhicule</h1>
                            {/* <p className="text-gray-600">Renseignez les informations du véhicule à ajouter à votre flotte</p> */}
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg bg-gray-300 px-4 py-3">
                        <Car className="h-8 w-8 text-blue-600" />
                        {/* <span className="text-sm font-medium text-blue-800">ID: {user.id}</span> */}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Formulaire principal */}
                    <div className="lg:col-span-2">
                        <Card className="border-0 bg-gray-900/90 shadow-lg">
                            <CardHeader className="border-b pb-4">
                                <CardTitle className="text-xl font-semibold text-gray-200">Informations générales</CardTitle>
                                <CardDescription className="text-gray-300">Modifiez les détails principaux du véhicule</CardDescription>
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
                                            <Label htmlFor="immatriculation" className="text-lg font-medium text-gray-100">
                                                Immatriculation
                                            </Label>
                                            <Input
                                                id="immatriculation"
                                                type="text"
                                                value={data.immatriculation}
                                                onChange={(e) => setData('immatriculation', e.target.value)}
                                                className="w-full text-gray-100"
                                                placeholder="AB-123-CD"
                                            />
                                        </div>

                                        {/* Marque */}
                                        <div className="space-y-2">
                                            <Label htmlFor="marque" className="text-lg font-medium text-gray-100">
                                                Marque
                                            </Label>
                                            <Select value={data.marque_id.toString()} onValueChange={(value) => setData('marque_id', Number(value))}>
                                                <SelectTrigger id="marque" className="w-full text-gray-100">
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
                                            <Label htmlFor="model" className="text-lg font-medium text-gray-100">
                                                Modèle *
                                            </Label>
                                            <Input
                                                id="model"
                                                type="text"
                                                value={data.model}
                                                onChange={(e) => setData('model', e.target.value)}
                                                className="w-full text-gray-100"
                                                placeholder="Modèle du véhicule"
                                            />
                                        </div>

                                        {/* Type de véhicule */}
                                        <div className="space-y-2">
                                            <Label htmlFor="typeVehicule" className="text-lg font-medium text-gray-100">
                                                Type de véhicule *
                                            </Label>
                                            <Select
                                                value={data.typeVehicule_id.toString()}
                                                onValueChange={(value) => setData('typeVehicule_id', Number(value))}
                                            >
                                                <SelectTrigger id="typeVehicule" className="w-full text-gray-100">
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
                                            <Label htmlFor="couleur" className="text-lg font-medium text-gray-100">
                                                Couleur
                                            </Label>
                                            <Input
                                                id="couleur"
                                                type="text"
                                                value={data.couleur}
                                                onChange={(e) => setData('couleur', e.target.value)}
                                                className="w-full text-gray-100"
                                                placeholder="Couleur du véhicule"
                                            />
                                        </div>

                                        {/* Carburant */}
                                        <div className="space-y-2">
                                            <Label htmlFor="carburant" className="text-lg font-medium text-gray-100">
                                                Carburant *
                                            </Label>
                                            <Select
                                                value={data.carburant_id.toString()}
                                                onValueChange={(value) => setData('carburant_id', Number(value))}
                                            >
                                                <SelectTrigger id="carburant" className="w-full text-gray-100">
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
                                            <Label htmlFor="numSerie" className="text-lg font-medium text-gray-100">
                                                Numéro de série
                                            </Label>
                                            <Input
                                                id="numSerie"
                                                type="text"
                                                value={data.numSerie}
                                                onChange={(e) => setData('numSerie', e.target.value)}
                                                className="w-full text-gray-100"
                                                placeholder="Numéro de série"
                                            />
                                        </div>
                                        {/* Reservoir */}
                                        <div className="space-y-2">
                                            <Label htmlFor="kilometrique" className="text-lg text-gray-100 font-medium">
                                                Reservoir
                                            </Label>
                                            <Input
                                                id="capacite_reservoir"
                                                type="number"
                                                min="0"
                                                value={data.capacite_reservoir}
                                                onChange={(e) => setData('capacite_reservoir', Number(e.target.value))}
                                                className="w-full text-gray-100"
                                                placeholder="0"
                                            />
                                        </div>
                                        {/* Kilométrage */}
                                        <div className="space-y-2">
                                            <Label htmlFor="kilometrique" className="text-lg font-medium text-gray-100">
                                                Kilométrage
                                            </Label>
                                            <Input
                                                id="kilometrique"
                                                type="number"
                                                min="0"
                                                disabled={true}
                                                value={data.kilometrique}
                                                onChange={(e) => setData('kilometrique', Number(e.target.value))}
                                                className="w-full text-gray-100"
                                                placeholder="0"
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
                                                min="1900"
                                                max={new Date().getFullYear()}
                                                value={data.anneeFabrication}
                                                onChange={(e) => setData('anneeFabrication', Number(e.target.value))}
                                                className="w-full text-gray-100"
                                                placeholder="2024"
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
                                                className="w-full text-gray-100"
                                            />
                                        </div>
                                    </div>

                                    {/* Photo */}
                                    <div className="space-y-4 border-t pt-4">
                                        <div className="space-y-2">
                                            {/* Photo existante */}
                                            {Vehicule.photo && (
                                                <div className="mb-4">
                                                    <p className="mb-2 text-lg text-gray-100">Photo actuelle :</p>
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
                                                            <span className="font-semibold">Cliquez pour uploader</span>
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
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => window.history.back()}
                                                className="text-blue-500 hover:text-green-700"
                                            >
                                                Annuler
                                            </Button>
                                            <Button type="submit" disabled={processing} className="min-w-32 bg-blue-600 hover:bg-blue-700">
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
                </div>
            </div>
        </AppLayout>
    );
}
