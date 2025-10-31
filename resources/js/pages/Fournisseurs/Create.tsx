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
        { value: 'autre', label: 'Autre' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Créer un nouveau fournisseur" />

            <div className="max-w-10xl container mx-auto px-4 py-6">
                {/* En-tête */}
                <div className="mb-8">
                    <div className="mb-8 flex items-center justify-between">
                        <div className="mb-6">
                            <Link href={route('fournisseurs.index')}>
                                <Button variant="outline" className="flex items-center gap-2">
                                    <ArrowLeft className="h-4 w-4" /> Retour à la liste
                                </Button>
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div>
                                <h1 className="mb-2 text-3xl font-bold text-gray-900">Nouveau fournisseur</h1>
                                {/* <p className="text-gray-600">Renseignez les informations du véhicule à ajouter à votre flotte</p> */}
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 rounded-lg bg-blue-50 px-4 py-3">
                            <Building2 className="h-8 w-8 text-blue-600" />
                            {/* <span className="text-sm font-medium text-blue-800">ID: {user.id}</span> */}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Formulaire principal */}
                    <div className="lg:col-span-3">
                        <Card className="border-0 shadow-lg">
                            <CardHeader className="border-b pb-4">
                                <CardTitle className="text-xl font-semibold text-gray-900">Informations du fournisseur</CardTitle>
                                <CardDescription className="text-gray-600">
                                    Renseignez les coordonnées et informations du nouveau fournisseur
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Affichage des erreurs */}
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

                                    {/* Grille responsive */}
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        {/* Nom du fournisseur */}
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="nom" className="flex items-center gap-2 text-sm font-medium">
                                                <User className="h-4 w-4 text-gray-500" />
                                                Nom du fournisseur *
                                            </Label>
                                            <Input
                                                id="nom"
                                                type="text"
                                                value={data.nom}
                                                onChange={(e) => setData('nom', e.target.value)}
                                                className="w-full"
                                                placeholder="Entrez le nom complet du fournisseur"
                                            />
                                        </div>

                                        {/* Type de fournisseur */}
                                        <div className="space-y-2">
                                            <Label htmlFor="type" className="flex items-center gap-2 text-sm font-medium">
                                                <Building2 className="h-4 w-4 text-gray-500" />
                                                Type *
                                            </Label>
                                            <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                                                <SelectTrigger id="type" className="w-full">
                                                    <SelectValue placeholder="Sélectionnez un type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {typesFournisseurs.map((type) => (
                                                        <SelectItem key={type.value} value={type.value}>
                                                            {type.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Téléphone */}
                                        <div className="space-y-2">
                                            <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium">
                                                <Phone className="h-4 w-4 text-gray-500" />
                                                Téléphone
                                            </Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                className="w-full"
                                                placeholder="+261 34 12 345 67"
                                            />
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                                                <Mail className="h-4 w-4 text-gray-500" />
                                                E-mail
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className="w-full"
                                                placeholder="contact@fournisseur.mg"
                                            />
                                        </div>

                                        {/* Site web */}
                                        <div className="space-y-2">
                                            <Label htmlFor="siteWeb" className="flex items-center gap-2 text-sm font-medium">
                                                <Globe className="h-4 w-4 text-gray-500" />
                                                Site web
                                            </Label>
                                            <Input
                                                id="siteWeb"
                                                type="text"
                                                value={data.siteWeb}
                                                onChange={(e) => setData('siteWeb', e.target.value)}
                                                className="w-full"
                                                placeholder="https://www.example.com"
                                            />
                                        </div>

                                        {/* Adresse */}
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="addresse" className="flex items-center gap-2 text-sm font-medium">
                                                <MapPin className="h-4 w-4 text-gray-500" />
                                                Adresse
                                            </Label>
                                            <Input
                                                id="addresse"
                                                type="text"
                                                value={data.addresse}
                                                onChange={(e) => setData('addresse', e.target.value)}
                                                className="w-full"
                                                placeholder="Adresse complète du fournisseur"
                                            />
                                        </div>
                                    </div>

                                    {/* Boutons d'action */}
                                    <div className="flex flex-col justify-end gap-3 border-t pt-6 sm:flex-row">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => window.history.back()}
                                            disabled={processing}
                                            className="order-2 sm:order-1"
                                        >
                                            Annuler
                                        </Button>
                                        <Button type="submit" disabled={processing} className="order-1 min-w-32 sm:order-2">
                                            {processing ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                    Création...
                                                </div>
                                            ) : (
                                                'Créer le fournisseur'
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - Informations complémentaires */}
                    {/* <div className="space-y-6">
                        <Card className="shadow-lg border-0 bg-blue-50 border-blue-100">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                                    <CircleAlert className="h-5 w-5" />
                                    Conseils
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <p className="text-sm text-blue-700">
                                        Les champs marqués d'un * sont obligatoires.
                                    </p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <p className="text-sm text-blue-700">
                                        Vérifiez l'exactitude des coordonnées avant validation.
                                    </p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <p className="text-sm text-blue-700">
                                        Un email valide facilite la communication future.
                                    </p>
                                </div>
                            </CardContent>
                        </Card> */}

                    {/* Carte statut */}
                    {/* <Card className="shadow-lg border-0">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg font-semibold">
                                    Statut
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-medium text-green-800">Prêt à créer</span>
                                </div>
                                <p className="text-xs text-gray-600 mt-2">
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
