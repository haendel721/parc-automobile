import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, CircleAlert, Save, User } from 'lucide-react';
import { route } from 'ziggy-js';

interface User {
    id: number;
    name: string;
    prenom: string;
    phone: string;
    statut: string;
    fonction: string;
    email: string;
    role: string;
}

interface Props {
    user: User;
}

export default function Edit({ user }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        id: user.id,
        name: user.name,
        prenom: user.prenom,
        phone: user.phone,
        statut: user.statut,
        fonction: user.fonction,
        email: user.email,
        role: user.role,
    });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('utilisateurs.update', user.id));
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Accueil', href: '/dashboard' },
                { title: 'Utilisateurs', href: '/utilisateurs' },
                { title: `Modifier ${user.prenom} ${user.name}`, href: `/utilisateurs/${user.id}/edit` },
            ]}
        >
            <Head title={`Mise à jour - ${user.prenom} ${user.name}`} />

            <div className="max-w-10xl container mx-auto px-4 py-8">
                {/* En-tête avec navigation */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="mb-6">
                        <Link href={route('utilisateurs.index')}>
                            <Button variant="outline" className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" /> Retour à la liste
                            </Button>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                                Gérez les informations de {user.prenom} {user.name}
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg bg-blue-50 px-4 py-3">
                        <User className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">ID: {user.id}</span>
                    </div>
                </div>

                <div className="lg:grid-cols grid grid-cols-1 gap-8">
                    {/* Formulaire principal */}
                    <div className="lg:col-span-2">
                        <Card className="border-0 shadow-lg">
                            <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white pb-4">
                                <CardTitle className="flex items-center space-x-2 text-xl font-semibold">
                                    <User className="h-5 w-5 text-gray-700" />
                                    <span>Informations personnelles</span>
                                </CardTitle>
                                <CardDescription>Mettez à jour les détails de l'utilisateur</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <form onSubmit={handleUpdate} className="space-y-6">
                                    {/* Affichage des erreurs */}
                                    {Object.keys(errors).length > 0 && (
                                        <Alert variant="destructive" className="mb-6 duration-300 animate-in fade-in">
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

                                    {/* Section Identité */}
                                    <div className="space-y-4">
                                        <h3 className="border-l-4 border-blue-500 pl-3 text-lg font-medium text-gray-900">Identités</h3>
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                                    Nom *
                                                </Label>
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    className="w-full transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Entrez le nom"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="prenom" className="text-sm font-medium text-gray-700">
                                                    Prénom
                                                </Label>
                                                <Input
                                                    id="prenom"
                                                    type="text"
                                                    value={data.prenom}
                                                    onChange={(e) => setData('prenom', e.target.value)}
                                                    className="w-full transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Entrez le prénom"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section Contact */}
                                    <div className="space-y-4">
                                        <h3 className="border-l-4 border-blue-500 pl-3 text-lg font-medium text-gray-900">Contacts</h3>
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                                    Email
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    className="w-full transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                                    placeholder="email@exemple.com"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                                                    Téléphone
                                                </Label>
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    value={data.phone}
                                                    onChange={(e) => setData('phone', e.target.value)}
                                                    className="w-full transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                                    placeholder="+33 1 23 45 67 89"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section Profession */}
                                    <div className="space-y-4">
                                        <h3 className="border-l-4 border-blue-500 pl-3 text-lg font-medium text-gray-900">
                                            Informations professionnelles
                                        </h3>
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="fonction" className="text-sm font-medium text-gray-700">
                                                    Fonction
                                                </Label>
                                                <Input
                                                    id="fonction"
                                                    type="text"
                                                    value={data.fonction}
                                                    onChange={(e) => setData('fonction', e.target.value)}
                                                    className="w-full transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Poste occupé"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="statut" className="text-sm font-medium text-gray-700">
                                                    Statut
                                                </Label>
                                                <Input
                                                    id="statut"
                                                    type="text"
                                                    value={data.statut}
                                                    onChange={(e) => setData('statut', e.target.value)}
                                                    className="w-full transition-colors focus:border-transparent focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Statut professionnel"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section Rôle */}
                                    <div className="space-y-4">
                                        <h3 className="border-l-4 border-blue-500 pl-3 text-lg font-medium text-gray-900">Permissions</h3>
                                        <div className="space-y-2">
                                            <Label htmlFor="role-select" className="text-sm font-medium text-gray-700">
                                                Rôle *
                                            </Label>
                                            <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                                                <SelectTrigger id="role-select" className="w-full transition-colors focus:ring-2 focus:ring-blue-500">
                                                    <SelectValue placeholder="Sélectionnez un rôle" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="admin" className="flex items-center space-x-2">
                                                        <span>👑 Administrateur</span>
                                                    </SelectItem>
                                                    <SelectItem value="mecanicien" className="flex items-center space-x-2">
                                                        <span>💼 Mécanicien</span>
                                                    </SelectItem>
                                                    <SelectItem value="utilisateur" className="flex items-center space-x-2">
                                                        <span>👤 Utilisateur</span>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl sm:flex-none"
                                        >
                                            <Save className="mr-2 h-4 w-4" />
                                            {processing ? 'Mise à jour...' : 'Mettre à jour'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => window.history.back()}
                                            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 sm:flex-none"
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
