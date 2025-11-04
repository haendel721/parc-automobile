import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Briefcase, Building, CircleAlert, Globe, Mail, MapPin, Phone } from 'lucide-react';
import { route } from 'ziggy-js';

interface Fournisseur {
    id: number;
    nom: string;
    type: string;
    addresse: string;
    phone: string;
    email: string;
    siteWeb: string;
}

interface Props {
    fournisseur: Fournisseur;
}

export default function Edit({ fournisseur }: Props) {
    const { processing, data, setData, post, errors } = useForm({
        id: fournisseur.id,
        nom: fournisseur.nom ?? '',
        type: fournisseur.type ?? '',
        addresse: fournisseur.addresse ?? '',
        phone: fournisseur.phone ?? '',
        email: fournisseur.email ?? '',
        siteWeb: fournisseur.siteWeb ?? '',
    });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('fournisseurs.update', fournisseur.id), {
            forceFormData: true,
            method: 'put',
        });
    };

    // Types de fournisseurs prédéfinis
    const typesFournisseur = [
        { value: 'matériel', label: 'Matériel et équipement' },
        { value: 'service', label: 'Service' },
        { value: 'logiciel', label: 'Logiciel' },
        { value: 'consommable', label: 'Consommable' },
        { value: 'transport', label: 'Transport' },
        { value: 'autre', label: 'Autre' },
    ];

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Accueil', href: '/dashboard' },
                { title: 'fournisseur', href: '/fournisseurs' },
                { title: 'Modifier un fournisseur', href: `/fournisseurs/${fournisseur.id}/edit` },
            ]}
        >
            <Head title="Mise à jour d'un fournisseur" />

            <div className="max-w-10xl container mx-auto p-6">
                {/* En-tête */}
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
                            <h1 className="mb-2 text-3xl font-bold text-white">Modifier le fournisseur</h1>
                            {/* <p className="text-gray-400">Renseignez les informations du véhicule à ajouter à votre flotte</p> */}
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg bg-blue-900/20 px-4 py-3 border border-blue-800/50">
                        <Building className="h-8 w-8 text-blue-400" />
                        {/* <span className="text-sm font-medium text-blue-300">ID: {user.id}</span> */}
                    </div>
                </div>

                <Card className="border-gray-700 bg-gray-800 shadow-xl">
                    <CardHeader className="border-b border-gray-700 bg-gradient-to-r from-green-900/20 to-emerald-900/20">
                        <div className="flex items-center space-x-3">
                            <div className="rounded-lg bg-green-900/30 p-2">
                                <Building className="h-6 w-6 text-green-400" />
                            </div>
                            <div>
                                <CardTitle className="text-xl text-white">Informations du fournisseur</CardTitle>
                                <CardDescription className="text-gray-400">ID: {fournisseur.id}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-6">
                        <form onSubmit={handleUpdate} className="space-y-6">
                            {/* Section Erreurs */}
                            {Object.keys(errors).length > 0 && (
                                <Alert variant="destructive" className="border-l-4 border-l-red-500 border-red-800 bg-red-900/20 text-red-200">
                                    <CircleAlert className="h-5 w-5" />
                                    <AlertTitle className="text-red-100">Erreurs de validation</AlertTitle>
                                    <AlertDescription>
                                        <ul className="list-inside list-disc space-y-1">
                                            {Object.entries(errors).map(([key, message]) => (
                                                <li key={key}>{message as string}</li>
                                            ))}
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            )}

                            {/* Grid principal */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Nom du fournisseur */}
                                <div className="space-y-2">
                                    <Label htmlFor="nom" className="flex items-center space-x-2 text-sm font-medium text-gray-300">
                                        <Building className="h-4 w-4 text-gray-400" />
                                        <span>Nom du fournisseur *</span>
                                    </Label>
                                    <Input
                                        id="nom"
                                        type="text"
                                        value={data.nom}
                                        onChange={(e) => setData('nom', e.target.value)}
                                        placeholder="Entrez le nom du fournisseur"
                                        className="h-11 border-gray-600 bg-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500"
                                    />
                                </div>

                                {/* Type de fournisseur */}
                                <div className="space-y-2">
                                    <Label htmlFor="type" className="flex items-center space-x-2 text-sm font-medium text-gray-300">
                                        <Briefcase className="h-4 w-4 text-gray-400" />
                                        <span>Type de fournisseur *</span>
                                    </Label>
                                    <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                                        <SelectTrigger className="h-11 w-full border-gray-600 bg-gray-700 text-white placeholder:text-gray-400">
                                            <SelectValue placeholder="Sélectionner un type" />
                                        </SelectTrigger>
                                        <SelectContent className="border-gray-600 bg-gray-700 text-white">
                                            {typesFournisseur.map((type) => (
                                                <SelectItem key={type.value} value={type.value} className="focus:bg-gray-600">
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Adresse */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="addresse" className="flex items-center space-x-2 text-sm font-medium text-gray-300">
                                        <MapPin className="h-4 w-4 text-gray-400" />
                                        <span>Adresse</span>
                                    </Label>
                                    <Input
                                        id="addresse"
                                        type="text"
                                        value={data.addresse}
                                        onChange={(e) => setData('addresse', e.target.value)}
                                        placeholder="Entrez l'adresse complète"
                                        className="h-11 border-gray-600 bg-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500"
                                    />
                                </div>

                                {/* Téléphone */}
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="flex items-center space-x-2 text-sm font-medium text-gray-300">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                        <span>Téléphone *</span>
                                    </Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="+33 1 23 45 67 89"
                                        className="h-11 border-gray-600 bg-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500"
                                    />
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="flex items-center space-x-2 text-sm font-medium text-gray-300">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        <span>E-mail</span>
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="contact@fournisseur.com"
                                        className="h-11 border-gray-600 bg-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500"
                                    />
                                </div>

                                {/* Site web */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="siteWeb" className="flex items-center space-x-2 text-sm font-medium text-gray-300">
                                        <Globe className="h-4 w-4 text-gray-400" />
                                        <span>Site web</span>
                                    </Label>
                                    <Input
                                        id="siteWeb"
                                        type="text"
                                        value={data.siteWeb}
                                        onChange={(e) => setData('siteWeb', e.target.value)}
                                        placeholder="https://www.example.com"
                                        className="h-11 border-gray-600 bg-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col justify-end space-y-3 border-t border-gray-700 pt-6 sm:flex-row sm:space-x-4 sm:space-y-0">
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
                                    className="order-1 bg-gradient-to-r from-blue-600 to-blue-600 px-6 hover:from-blue-700 hover:to-blue-700 sm:order-2"
                                >
                                    {processing ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                            <span>Mise à jour...</span>
                                        </div>
                                    ) : (
                                        'Mettre à jour le fournisseur'
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