import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Building, Calendar, Car, CircleAlert, DollarSign, FileEdit, FileText } from 'lucide-react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Accueil', href: '/dashboard' },
    { title: 'Assurances', href: '/assurances' },
    { title: 'Nouvelle Assurance', href: '/assurances/create' },
];

interface vehicules {
    id: number;
    immatriculation: string;
    user_id: number;
    marque?: string;
    modele?: string;
}

interface user {
    id: number;
    role: string;
    name?: string;
}

type AssuranceProps = {
    vehicules: vehicules[];
    user: user;
};

export default function Create() {
    const { vehicules, user } = usePage<AssuranceProps>().props;

    const userRole = user?.role || 'utilisateur';
    const userId = user?.id || null;

    const filteredVehicules = userRole === 'admin' ? vehicules : vehicules.filter((v) => v.user_id === userId);

    const { data, setData, post, processing, errors } = useForm({
        vehicule_id: '',
        NomCompagnie: '',
        NumContrat: '',
        cout: '',
        dateDebut: '',
        dateFin: '',
        statut: 'assure',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('assurances.store'));
    };

    const formatCurrency = (value: string) => {
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    };

    const handleCoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s/g, '');
        if (/^\d*$/.test(value)) {
            setData('cout', formatCurrency(value));
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Accueil', href: '/dashboard' },
                { title: 'Assurances', href: '/assurances' },
                { title: 'Ajouter une assurance', href: '/assurances/create' },
            ]}
        >
            <Head title="Nouvelle Assurance" />

            <div className="max-w-10xl container mx-auto px-4 py-8">
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
                            <h1 className="mb-2 text-3xl font-bold text-gray-900">Nouvelle Assurance</h1>
                            {/* <p className="text-gray-600">Renseignez les informations du véhicule à ajouter à votre flotte</p> */}
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg bg-blue-50 px-4 py-3">
                        <FileEdit className="h-8 w-8 text-blue-600" />
                        {/* <span className="text-sm font-medium text-blue-800">ID: {user.id}</span> */}
                    </div>
                </div>

                <Card className="border-0 shadow-lg">
                    <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <CircleAlert className="h-6 w-6 text-blue-600" />
                            Informations de l'assurance
                        </CardTitle>
                        <CardDescription>Remplissez tous les champs requis pour créer une nouvelle assurance</CardDescription>
                    </CardHeader>

                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Alert d'erreurs */}
                            {Object.keys(errors).length > 0 && (
                                <Alert variant="destructive" className="mb-6">
                                    <CircleAlert className="h-4 w-4" />
                                    <AlertTitle>Erreurs de validation</AlertTitle>
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

                            {/* Grid responsive */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Véhicule */}
                                <div className="space-y-2">
                                    <Label htmlFor="vehicule_id" className="flex items-center gap-2 text-sm font-medium">
                                        <Car className="h-4 w-4 text-gray-500" />
                                        Véhicule *
                                    </Label>
                                    <Select value={data.vehicule_id} onValueChange={(value) => setData('vehicule_id', value)}>
                                        <SelectTrigger className="h-11 w-full">
                                            <SelectValue placeholder="Sélectionnez un véhicule" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {filteredVehicules.map((v) => (
                                                <SelectItem key={v.id} value={v.id.toString()}>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{v.immatriculation}</span>
                                                        {v.marque && v.modele && (
                                                            <span className="text-xs text-gray-500">
                                                                {v.marque} {v.modele}
                                                            </span>
                                                        )}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Nom de l'entreprise */}
                                <div className="space-y-2">
                                    <Label htmlFor="NomCompagnie" className="flex items-center gap-2 text-sm font-medium">
                                        <Building className="h-4 w-4 text-gray-500" />
                                        Compagnie d'assurance *
                                    </Label>
                                    <Input
                                        id="NomCompagnie"
                                        type="text"
                                        placeholder="Nom de la compagnie"
                                        value={data.NomCompagnie}
                                        onChange={(e) => setData('NomCompagnie', e.target.value)}
                                        className="h-11"
                                    />
                                </div>

                                {/* Numéro de contrat */}
                                <div className="space-y-2">
                                    <Label htmlFor="NumContrat" className="flex items-center gap-2 text-sm font-medium">
                                        <FileText className="h-4 w-4 text-gray-500" />
                                        Numéro de contrat *
                                    </Label>
                                    <Input
                                        id="NumContrat"
                                        type="text"
                                        placeholder="N° de contrat"
                                        value={data.NumContrat}
                                        onChange={(e) => setData('NumContrat', e.target.value)}
                                        className="h-11"
                                    />
                                </div>

                                {/* Coût */}
                                <div className="space-y-2">
                                    <Label htmlFor="cout" className="flex items-center gap-2 text-sm font-medium">
                                        <DollarSign className="h-4 w-4 text-gray-500" />
                                        Coût de l'assurance *
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="cout"
                                            type="text"
                                            placeholder="0"
                                            value={data.cout}
                                            onChange={handleCoutChange}
                                            className="h-11 pl-8"
                                        />
                                        <span className="absolute top-1/2 left-3 -translate-y-1/2 transform text-sm text-gray-500">Ar</span>
                                    </div>
                                </div>

                                {/* Date de début */}
                                <div className="space-y-2">
                                    <Label htmlFor="dateDebut" className="flex items-center gap-2 text-sm font-medium">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        Date de début *
                                    </Label>
                                    <Input
                                        id="dateDebut"
                                        type="date"
                                        value={data.dateDebut}
                                        onChange={(e) => setData('dateDebut', e.target.value)}
                                        className="h-11"
                                    />
                                </div>

                                {/* Date de fin */}
                                <div className="space-y-2">
                                    <Label htmlFor="dateFin" className="flex items-center gap-2 text-sm font-medium">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        Date de fin *
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

                            {/* Bouton de soumission */}
                            <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700"
                                    size="lg"
                                >
                                    {processing ? (
                                        <>
                                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                                            Création en cours...
                                        </>
                                    ) : (
                                        "Créer l'assurance"
                                    )}
                                </Button>

                                <Button type="button" variant="outline" onClick={() => window.history.back()} className="flex-1" size="lg">
                                    Annuler
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Informations supplémentaires */}
                {/* <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <CircleAlert className="h-4 w-4 text-blue-500" />
                        <span>Tous les champs marqués d'un * sont obligatoires</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Car className="h-4 w-4 text-green-500" />
                        <span>Véhicules disponibles selon vos permissions</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Calendar className="h-4 w-4 text-orange-500" />
                        <span>Dates au format JJ/MM/AAAA</span>
                    </div>
                </div> */}
            </div>
        </AppLayout>
    );
}
