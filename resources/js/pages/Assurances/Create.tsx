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
                            <Button variant="outline" className="flex items-center gap-2 border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white">
                                <ArrowLeft className="h-4 w-4" /> Retour à la liste
                            </Button>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div>
                            <h1 className="mb-2 text-3xl font-bold text-white">Nouvelle Assurance</h1>
                            {/* <p className="text-gray-400">Renseignez les informations du véhicule à ajouter à votre flotte</p> */}
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg bg-blue-900/20 px-4 py-3 border border-blue-800/50">
                        <FileEdit className="h-8 w-8 text-blue-400" />
                        {/* <span className="text-sm font-medium text-blue-300">ID: {user.id}</span> */}
                    </div>
                </div>

                <Card className="border-gray-700 bg-gray-800 shadow-xl">
                    <CardHeader className="border-b border-gray-700 bg-gradient-to-r from-blue-900/20 to-indigo-900/20">
                        <CardTitle className="flex items-center gap-2 text-xl text-white">
                            <CircleAlert className="h-6 w-6 text-blue-400" />
                            Informations de l'assurance
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                            Remplissez tous les champs requis pour créer une nouvelle assurance
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Alert d'erreurs */}
                            {Object.keys(errors).length > 0 && (
                                <Alert variant="destructive" className="mb-6 border-red-800 bg-red-900/20 text-red-200">
                                    <CircleAlert className="h-4 w-4" />
                                    <AlertTitle className="text-red-100">Erreurs de validation</AlertTitle>
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
                                    <Label htmlFor="vehicule_id" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                        <Car className="h-4 w-4 text-gray-400" />
                                        Véhicule *
                                    </Label>
                                    <Select value={data.vehicule_id} onValueChange={(value) => setData('vehicule_id', value)}>
                                        <SelectTrigger className="h-11 w-full border-gray-600 bg-gray-700 text-white placeholder:text-gray-400">
                                            <SelectValue placeholder="Sélectionnez un véhicule" />
                                        </SelectTrigger>
                                        <SelectContent className="border-gray-600 bg-gray-700 text-white">
                                            {filteredVehicules.map((v) => (
                                                <SelectItem key={v.id} value={v.id.toString()} className="focus:bg-gray-600">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{v.immatriculation}</span>
                                                        {v.marque && v.modele && (
                                                            <span className="text-xs text-gray-400">
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
                                    <Label htmlFor="NomCompagnie" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                        <Building className="h-4 w-4 text-gray-400" />
                                        Compagnie d'assurance *
                                    </Label>
                                    <Input
                                        id="NomCompagnie"
                                        type="text"
                                        placeholder="Nom de la compagnie"
                                        value={data.NomCompagnie}
                                        onChange={(e) => setData('NomCompagnie', e.target.value)}
                                        className="h-11 border-gray-600 bg-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500"
                                    />
                                </div>

                                {/* Numéro de contrat */}
                                <div className="space-y-2">
                                    <Label htmlFor="NumContrat" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                        <FileText className="h-4 w-4 text-gray-400" />
                                        Numéro de contrat *
                                    </Label>
                                    <Input
                                        id="NumContrat"
                                        type="text"
                                        placeholder="N° de contrat"
                                        value={data.NumContrat}
                                        onChange={(e) => setData('NumContrat', e.target.value)}
                                        className="h-11 border-gray-600 bg-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500"
                                    />
                                </div>

                                {/* Coût */}
                                <div className="space-y-2">
                                    <Label htmlFor="cout" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                        <DollarSign className="h-4 w-4 text-gray-400" />
                                        Coût de l'assurance *
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="cout"
                                            type="text"
                                            placeholder="0"
                                            value={data.cout}
                                            onChange={handleCoutChange}
                                            className="h-11 border-gray-600 bg-gray-700 pl-8 text-white placeholder:text-gray-400 focus:border-blue-500"
                                        />
                                        <span className="absolute top-1/2 left-3 -translate-y-1/2 transform text-sm text-gray-400">Ar</span>
                                    </div>
                                </div>

                                {/* Date de début */}
                                <div className="space-y-2">
                                    <Label htmlFor="dateDebut" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        Date de début *
                                    </Label>
                                    <Input
                                        id="dateDebut"
                                        type="date"
                                        value={data.dateDebut}
                                        onChange={(e) => setData('dateDebut', e.target.value)}
                                        className="h-11 border-gray-600 bg-gray-700 text-white focus:border-blue-500"
                                    />
                                </div>

                                {/* Date de fin */}
                                <div className="space-y-2">
                                    <Label htmlFor="dateFin" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        Date de fin *
                                    </Label>
                                    <Input
                                        id="dateFin"
                                        type="date"
                                        value={data.dateFin}
                                        onChange={(e) => setData('dateFin', e.target.value)}
                                        className="h-11 border-gray-600 bg-gray-700 text-white focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Bouton de soumission */}
                            <div className="flex flex-col justify-end gap-3 border-t border-gray-700 pt-4 sm:flex-row">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
                                    onClick={() => window.history.back()}
                                >
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="transform rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-2.5 font-medium text-white shadow-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-xl"
                                    size="lg"
                                >
                                    {processing ? (
                                        <>
                                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                                            en cours d'enregistrement...
                                        </>
                                    ) : (
                                        "Enregistrer l'assurance"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Informations supplémentaires */}
                {/* <div className="mt-6 grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                    <div className="flex items-center gap-2 rounded-lg bg-gray-700 p-3">
                        <CircleAlert className="h-4 w-4 text-blue-400" />
                        <span className="text-gray-300">Tous les champs marqués d'un * sont obligatoires</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-gray-700 p-3">
                        <Car className="h-4 w-4 text-green-400" />
                        <span className="text-gray-300">Véhicules disponibles selon vos permissions</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-gray-700 p-3">
                        <Calendar className="h-4 w-4 text-orange-400" />
                        <span className="text-gray-300">Dates au format JJ/MM/AAAA</span>
                    </div>
                </div> */}
            </div>
        </AppLayout>
    );
}