import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { CircleAlert, Building, MapPin, Phone, Mail, Globe, Briefcase, ArrowLeft } from 'lucide-react';
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
        <AppLayout breadcrumbs={[{ title: 'Modifier un fournisseur', href: `/fournisseurs/${fournisseur.id}/edit` }]}>
            <Head title="Mise à jour d'un fournisseur" />
            
            <div className="container max-w-10xl mx-auto p-6">
                {/* En-tête */}
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
                            <h1 className="mb-2 text-3xl font-bold text-gray-900">Modifier le fournisseur</h1>
                            {/* <p className="text-gray-600">Renseignez les informations du véhicule à ajouter à votre flotte</p> */}
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg bg-blue-50 px-4 py-3">
                        <Building className="h-8 w-8 text-blue-600" />
                        {/* <span className="text-sm font-medium text-blue-800">ID: {user.id}</span> */}
                    </div>
                </div>

                <Card className="shadow-lg border-0">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Building className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <CardTitle className="text-xl text-gray-900">Informations du fournisseur</CardTitle>
                                <CardDescription className="text-gray-600">
                                    ID: {fournisseur.id}
                                </CardDescription>
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
                                        <ul className="list-disc list-inside space-y-1 text-red-700">
                                            {Object.entries(errors).map(([key, message]) => (
                                                <li key={key}>{message as string}</li>
                                            ))}
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            )}

                            {/* Grid principal */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Nom du fournisseur */}
                                <div className="space-y-2">
                                    <Label htmlFor="nom" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                        <Building className="h-4 w-4 text-gray-500" />
                                        <span>Nom du fournisseur *</span>
                                    </Label>
                                    <Input
                                        id="nom"
                                        type="text"
                                        value={data.nom}
                                        onChange={(e) => setData('nom', e.target.value)}
                                        placeholder="Entrez le nom du fournisseur"
                                        className="h-11"
                                    />
                                </div>

                                {/* Type de fournisseur */}
                                <div className="space-y-2">
                                    <Label htmlFor="type" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                        <Briefcase className="h-4 w-4 text-gray-500" />
                                        <span>Type de fournisseur *</span>
                                    </Label>
                                    <Select 
                                        value={data.type} 
                                        onValueChange={(value) => setData('type', value)}
                                    >
                                        <SelectTrigger className="w-full h-11">
                                            <SelectValue placeholder="Sélectionner un type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {typesFournisseur.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Adresse */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="addresse" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                        <MapPin className="h-4 w-4 text-gray-500" />
                                        <span>Adresse</span>
                                    </Label>
                                    <Input
                                        id="addresse"
                                        type="text"
                                        value={data.addresse}
                                        onChange={(e) => setData('addresse', e.target.value)}
                                        placeholder="Entrez l'adresse complète"
                                        className="h-11"
                                    />
                                </div>

                                {/* Téléphone */}
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                        <Phone className="h-4 w-4 text-gray-500" />
                                        <span>Téléphone *</span>
                                    </Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="+33 1 23 45 67 89"
                                        className="h-11"
                                    />
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                        <Mail className="h-4 w-4 text-gray-500" />
                                        <span>Email *</span>
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="contact@fournisseur.com"
                                        className="h-11"
                                    />
                                </div>

                                {/* Site web */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="siteWeb" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                        <Globe className="h-4 w-4 text-gray-500" />
                                        <span>Site web</span>
                                    </Label>
                                    <Input
                                        id="siteWeb"
                                        type="text"
                                        value={data.siteWeb}
                                        onChange={(e) => setData('siteWeb', e.target.value)}
                                        placeholder="https://www.example.com"
                                        className="h-11"
                                    />
                                </div>
                            </div>

                            {/* Note sur les champs obligatoires */}
                            <div className="text-sm text-gray-500 border-t pt-4">
                                <p>* Champs obligatoires</p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                    className="px-6 order-2 sm:order-1"
                                >
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 order-1 sm:order-2"
                                >
                                    {processing ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
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