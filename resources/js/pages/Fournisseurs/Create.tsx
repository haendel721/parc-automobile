import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Building2, CircleAlert, Globe, Mail, MapPin, Phone, User } from 'lucide-react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Fournisseurs',
        href: '/fournisseurs',
    },
    {
        title: 'Nouveau fournisseur',
        href: '/fournisseurs/create',
    },
];

export default function Index() {
    const { data, setData, post, processing, errors } = useForm({
        nom: '',
        type: '',
        addresse: '',
        phone: '',
        email: '',
        siteWeb: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('fournisseurs.store'));
    };

    // Types de fournisseurs prédéfinis pour le select
    const typesFournisseurs = [
        { value: 'garage', label: 'Garage' },
        { value: 'concessionnaire', label: 'Concessionnaire' },
        { value: 'pieces', label: 'Pièces détachées' },
        { value: 'equipement', label: 'Équipement automobile' },
        { value: 'pneu', label: 'Pneus' },
        { value: 'lubrifiant', label: 'Lubrifiants' },
        { value: 'Carburant', label: 'Carburant' },
        { value: 'autre', label: 'Autre' },
    ];

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Accueil', href: '/dashboard' },
                { title: 'fournisseur', href: '/fournisseurs' },
                { title: 'Ajouter un fournisseur', href: '/fournisseur/create' },
            ]}
        >
            <Head title="Fournisseur" />

            <div className="max-w-10xl container mx-auto px-4 py-6">
                {/* En-tête */}
                <div className="mb-8">
                    <div className="mb-8 flex items-center justify-between">
                        <div className="mb-6">
                            <Link href={route('fournisseurs.index')}>
                                <Button variant="outline" className="flex items-center gap-2 border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white">
                                    <ArrowLeft className="h-4 w-4" /> Retour à la liste
                                </Button>
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div>
                                <h1 className="mb-2 text-3xl font-bold text-white">Nouveau fournisseur</h1>
                                {/* <p className="text-gray-400">Renseignez les informations du véhicule à ajouter à votre flotte</p> */}
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 rounded-lg bg-blue-900/20 px-4 py-3 border border-blue-800/50">
                            <Building2 className="h-8 w-8 text-blue-400" />
                            {/* <span className="text-sm font-medium text-blue-300">ID: {user.id}</span> */}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Formulaire principal */}
                    <div className="lg:col-span-3">
                        <Card className="border-gray-700 bg-gray-800 shadow-xl">
                            <CardHeader className="border-b border-gray-700 pb-4">
                                <CardTitle className="text-xl font-semibold text-white">Informations du fournisseur</CardTitle>
                                <CardDescription className="text-gray-400">
                                    Renseignez les coordonnées et informations du nouveau fournisseur
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Affichage des erreurs */}
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

                                    {/* Grille responsive */}
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        {/* Nom du fournisseur */}
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="nom" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                                <User className="h-4 w-4 text-gray-400" />
                                                Nom du fournisseur *
                                            </Label>
                                            <Input
                                                id="nom"
                                                type="text"
                                                value={data.nom}
                                                onChange={(e) => setData('nom', e.target.value)}
                                                className="w-full border-gray-600 bg-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500"
                                                placeholder="Entrez le nom complet du fournisseur"
                                            />
                                        </div>

                                        {/* Type de fournisseur */}
                                        <div className="space-y-2">
                                            <Label htmlFor="type" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                                <Building2 className="h-4 w-4 text-gray-400" />
                                                Type *
                                            </Label>
                                            <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                                                <SelectTrigger id="type" className="w-full border-gray-600 bg-gray-700 text-white placeholder:text-gray-400">
                                                    <SelectValue placeholder="Sélectionnez un type" />
                                                </SelectTrigger>
                                                <SelectContent className="border-gray-600 bg-gray-700 text-white">
                                                    {typesFournisseurs.map((type) => (
                                                        <SelectItem key={type.value} value={type.value} className="focus:bg-gray-600">
                                                            {type.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Téléphone */}
                                        <div className="space-y-2">
                                            <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                                <Phone className="h-4 w-4 text-gray-400" />
                                                Téléphone
                                            </Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                className="w-full border-gray-600 bg-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500"
                                                placeholder="+261 34 12 345 67"
                                            />
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                                <Mail className="h-4 w-4 text-gray-400" />
                                                E-mail
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className="w-full border-gray-600 bg-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500"
                                                placeholder="contact@fournisseur.mg"
                                            />
                                        </div>

                                        {/* Site web */}
                                        <div className="space-y-2">
                                            <Label htmlFor="siteWeb" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                                <Globe className="h-4 w-4 text-gray-400" />
                                                Site web
                                            </Label>
                                            <Input
                                                id="siteWeb"
                                                type="text"
                                                value={data.siteWeb}
                                                onChange={(e) => setData('siteWeb', e.target.value)}
                                                className="w-full border-gray-600 bg-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500"
                                                placeholder="https://www.example.com"
                                            />
                                        </div>

                                        {/* Adresse */}
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="addresse" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                                <MapPin className="h-4 w-4 text-gray-400" />
                                                Adresse
                                            </Label>
                                            <Input
                                                id="addresse"
                                                type="text"
                                                value={data.addresse}
                                                onChange={(e) => setData('addresse', e.target.value)}
                                                className="w-full border-gray-600 bg-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500"
                                                placeholder="Adresse complète du fournisseur"
                                            />
                                        </div>
                                    </div>

                                    {/* Boutons d'action */}
                                    <div className="flex flex-col justify-end gap-3 border-t border-gray-700 pt-6 sm:flex-row">
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
                                            className="order-1 min-w-32 bg-blue-600 hover:bg-blue-700 sm:order-2"
                                        >
                                            {processing ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                    en cours d'enregistrement...
                                                </div>
                                            ) : (
                                                'Enregistrer le fournisseur'
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - Informations complémentaires */}
                    {/* <div className="space-y-6">
                        <Card className="border-0 border-blue-800 bg-blue-900/20 shadow-lg">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-blue-200">
                                    <CircleAlert className="h-5 w-5" />
                                    Conseils
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-start gap-2">
                                    <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-400"></div>
                                    <p className="text-sm text-blue-300">
                                        Les champs marqués d'un * sont obligatoires.
                                    </p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-400"></div>
                                    <p className="text-sm text-blue-300">
                                        Vérifiez l'exactitude des coordonnées avant validation.
                                    </p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-400"></div>
                                    <p className="text-sm text-blue-300">
                                        Un email valide facilite la communication future.
                                    </p>
                                </div>
                            </CardContent>
                        </Card> */}

                    {/* Carte statut */}
                    {/* <Card className="border-0 shadow-lg border-gray-700 bg-gray-800">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg font-semibold text-white">
                                    Statut
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 rounded-lg border border-green-800 bg-green-900/20 p-3">
                                    <div className="h-3 w-3 animate-pulse rounded-full bg-green-400"></div>
                                    <span className="text-sm font-medium text-green-300">Prêt à créer</span>
                                </div>
                                <p className="mt-2 text-xs text-gray-400">
                                    Tous les champs requis sont remplis. Vous pouvez créer ce fournisseur.
                                </p>
                            </CardContent>
                        </Card> */}
                    {/* </div> */}
                </div>
            </div>
        </AppLayout>
    );
}