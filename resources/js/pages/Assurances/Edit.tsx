import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Building, Calendar, Car, CircleAlert, DollarSign, FileEdit, FileText, ShieldCheck } from 'lucide-react';
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
}

interface Assurance {
    id: number;
    vehicule_id: number;
    NomCompagnie: string;
    NumContrat: string;
    cout: number;
    dateDebut: string;
    dateFin: string;
}

interface Props {
    Vehicule: Vehicule;
    assurance: Assurance;
}

export default function Edit({ assurance, Vehicule }: Props) {
    const { processing, data, setData, post, errors } = useForm({
        id: assurance.id,
        vehicule_id: assurance.vehicule_id,
        NomCompagnie: assurance.NomCompagnie,
        NumContrat: assurance.NumContrat,
        cout: assurance.cout,
        dateDebut: assurance.dateDebut,
        dateFin: assurance.dateFin,
    });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('assurances.update', assurance.id), {
            forceFormData: true,
            method: 'put',
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Modifier une assurance', href: `/assurances/${assurance.id}/edit` }]}>
            <Head title="Mise à jour d'une Assurance" />

            <div className="container mx-auto max-w-10xl p-6">
                {/* En-tête */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="mb-6">
                        <Link href={route('assurances.index')}>
                            <Button variant="outline" className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" /> Retour à la liste
                            </Button>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div>
                            <h1 className="mb-2 text-3xl font-bold text-gray-900">Gestion des Assurances</h1>
                            {/* <p className="text-gray-600">Renseignez les informations du véhicule à ajouter à votre flotte</p> */}
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg bg-blue-50 px-4 py-3">
                        <ShieldCheck className="h-5 w-5 text-green-600" />
                    </div>
                </div>

                <Card className="border-0 shadow-lg">
                    <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div className="flex items-center space-x-3">
                            <div className="rounded-lg bg-blue-100 p-2">
                                <FileText className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <CardTitle className="text-xl text-gray-900">Informations du contrat</CardTitle>
                                <CardDescription className="text-gray-600">Contrat n° {assurance.NumContrat}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-6">
                        <form onSubmit={handleUpdate} className="space-y-6">
                            {/* Section Erreurs */}
                            {Object.keys(errors).length > 0 && (
                                <Alert variant="destructive" className="border-l-4 border-l-red-500">
                                    <CircleAlert className="h-5 w-5" />
                                    <AlertTitle className="text-red-800">Erreurs de validation</AlertTitle>
                                    <AlertDescription>
                                        <ul className="list-inside list-disc space-y-1 text-red-700">
                                            {Object.entries(errors).map(([key, message]) => (
                                                <li key={key}>{message as string}</li>
                                            ))}
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            )}

                            {/* Grid principal */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Véhicule */}
                                <div className="space-y-2">
                                    <Label htmlFor="vehicule_id" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                        <Car className="h-4 w-4 text-gray-500" />
                                        <span>Véhicule assuré</span>
                                    </Label>
                                    <Select value={data.vehicule_id.toString()} onValueChange={(value) => setData('vehicule_id', Number(value))}>
                                        <SelectTrigger className="h-11 w-full">
                                            <SelectValue placeholder="Sélectionner un véhicule" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Vehicule?.map((vehicule) => (
                                                <SelectItem key={vehicule.id} value={vehicule.id.toString()}>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{vehicule.immatriculation}</span>
                                                        <span className="text-sm text-gray-500">
                                                            {vehicule.marque_id} - {vehicule.model}
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Compagnie d'assurance */}
                                <div className="space-y-2">
                                    <Label htmlFor="NomCompagnie" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                        <Building className="h-4 w-4 text-gray-500" />
                                        <span>Compagnie d'assurance</span>
                                    </Label>
                                    <Input
                                        id="NomCompagnie"
                                        type="text"
                                        value={data.NomCompagnie}
                                        onChange={(e) => setData('NomCompagnie', e.target.value)}
                                        placeholder="Entrez le nom de la compagnie"
                                        className="h-11"
                                    />
                                </div>

                                {/* Numéro de contrat */}
                                <div className="space-y-2">
                                    <Label htmlFor="NumContrat" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                        <FileText className="h-4 w-4 text-gray-500" />
                                        <span>Numéro de contrat</span>
                                    </Label>
                                    <Input id="NumContrat" type="text" disabled value={data.NumContrat} className="h-11 bg-gray-50 text-gray-600" />
                                </div>

                                {/* Coût */}
                                <div className="space-y-2">
                                    <Label htmlFor="cout" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                        <DollarSign className="h-4 w-4 text-gray-500" />
                                        <span>Coût de l'assurance</span>
                                    </Label>
                                    <Input
                                        id="cout"
                                        type="number"
                                        step="0.01"
                                        value={data.cout}
                                        onChange={(e) => setData('cout', Number(e.target.value))}
                                        placeholder="0.00"
                                        className="h-11"
                                    />
                                </div>

                                {/* Dates */}
                                <div className="space-y-2">
                                    <Label htmlFor="dateDebut" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        <span>Date de début</span>
                                    </Label>
                                    <Input
                                        id="dateDebut"
                                        type="date"
                                        value={data.dateDebut}
                                        onChange={(e) => setData('dateDebut', e.target.value)}
                                        className="h-11"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="dateFin" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        <span>Date de fin</span>
                                    </Label>
                                    <Input
                                        id="dateFin"
                                        type="date"
                                        value={data.dateFin}
                                        onChange={(e) => setData('dateFin', e.target.value)}
                                        className="h-11"
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end space-x-4 border-t pt-6">
                                <Button type="button" variant="outline" onClick={() => window.history.back()} className="px-6">
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 hover:from-blue-700 hover:to-indigo-700"
                                >
                                    {processing ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                            <span>Mise à jour...</span>
                                        </div>
                                    ) : (
                                        "Mettre à jour l'assurance"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
