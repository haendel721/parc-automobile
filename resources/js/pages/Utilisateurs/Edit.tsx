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

            <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
                {/* En-tête avec navigation */}
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-4">
                            <Link href={route('utilisateurs.index')}>
                                <Button 
                                    variant="outline" 
                                    className="flex items-center gap-2 border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-700 hover:text-white backdrop-blur-sm transition-all duration-300"
                                >
                                    <ArrowLeft className="h-4 w-4" /> 
                                    Retour
                                </Button>
                            </Link>
                        </div>
                        
                        <div className="text-center lg:text-left">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                Modifier {user.prenom} {user.name}
                            </h1>
                            <p className="text-gray-400 mt-2">Gérez les informations de l'utilisateur</p>
                        </div>

                        <div className="flex items-center gap-2 rounded-2xl bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 px-4 py-3">
                            <User className="h-5 w-5 text-blue-400" />
                            <span className="text-sm font-medium text-blue-300">ID: {user.id}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                        {/* Formulaire principal */}
                        <div className="col-span-1">
                            <Card className="border-0 bg-gray-900/90 backdrop-blur-xl shadow-2xl">
                                <CardHeader className="border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900/50 pb-4">
                                    <CardTitle className="flex items-center gap-3 text-xl font-semibold">
                                        <div className="rounded-2xl bg-blue-500/10 p-2">
                                            <User className="h-5 w-5 text-blue-400" />
                                        </div>
                                        <span className="text-white">Informations personnelles</span>
                                    </CardTitle>
                                    <CardDescription className="text-gray-400">
                                        Mettez à jour les détails de l'utilisateur
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <form onSubmit={handleUpdate} className="space-y-8">
                                        {/* Affichage des erreurs */}
                                        {Object.keys(errors).length > 0 && (
                                            <Alert 
                                                variant="destructive" 
                                                className="mb-6 border-red-500/50 bg-red-500/10 backdrop-blur-sm text-red-300 duration-300 animate-in fade-in"
                                            >
                                                <CircleAlert className="h-4 w-4" />
                                                <AlertTitle className="text-red-200">Erreurs de validation</AlertTitle>
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
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-0.5 w-6 bg-blue-500 rounded-full"></div>
                                                <h3 className="text-lg font-semibold text-white">Identité</h3>
                                            </div>
                                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                                <div className="space-y-3">
                                                    <Label htmlFor="name" className="text-sm font-medium text-gray-300">
                                                        Nom *
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        type="text"
                                                        value={data.name}
                                                        onChange={(e) => setData('name', e.target.value)}
                                                        className="w-full bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
                                                        placeholder="Entrez le nom"
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <Label htmlFor="prenom" className="text-sm font-medium text-gray-300">
                                                        Prénom
                                                    </Label>
                                                    <Input
                                                        id="prenom"
                                                        type="text"
                                                        value={data.prenom}
                                                        onChange={(e) => setData('prenom', e.target.value)}
                                                        className="w-full bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
                                                        placeholder="Entrez le prénom"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section Contact */}
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-0.5 w-6 bg-green-500 rounded-full"></div>
                                                <h3 className="text-lg font-semibold text-white">Contact</h3>
                                            </div>
                                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                                <div className="space-y-3">
                                                    <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                                                        Email
                                                    </Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        value={data.email}
                                                        onChange={(e) => setData('email', e.target.value)}
                                                        className="w-full bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500/20 transition-all duration-300"
                                                        placeholder="email@exemple.com"
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <Label htmlFor="phone" className="text-sm font-medium text-gray-300">
                                                        Téléphone
                                                    </Label>
                                                    <Input
                                                        id="phone"
                                                        type="tel"
                                                        value={data.phone}
                                                        onChange={(e) => setData('phone', e.target.value)}
                                                        className="w-full bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500/20 transition-all duration-300"
                                                        placeholder="+33 1 23 45 67 89"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section Profession */}
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-0.5 w-6 bg-purple-500 rounded-full"></div>
                                                <h3 className="text-lg font-semibold text-white">
                                                    Informations professionnelles
                                                </h3>
                                            </div>
                                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                                <div className="space-y-3">
                                                    <Label htmlFor="fonction" className="text-sm font-medium text-gray-300">
                                                        Fonction
                                                    </Label>
                                                    <Input
                                                        id="fonction"
                                                        type="text"
                                                        value={data.fonction}
                                                        onChange={(e) => setData('fonction', e.target.value)}
                                                        className="w-full bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300"
                                                        placeholder="Poste occupé"
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <Label htmlFor="statut" className="text-sm font-medium text-gray-300">
                                                        Statut
                                                    </Label>
                                                    <Input
                                                        id="statut"
                                                        type="text"
                                                        value={data.statut}
                                                        onChange={(e) => setData('statut', e.target.value)}
                                                        className="w-full bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-300"
                                                        placeholder="Statut professionnel"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section Rôle */}
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-0.5 w-6 bg-amber-500 rounded-full"></div>
                                                <h3 className="text-lg font-semibold text-white">Permissions</h3>
                                            </div>
                                            <div className="space-y-3 max-w-md">
                                                <Label htmlFor="role-select" className="text-sm font-medium text-gray-300">
                                                    Rôle *
                                                </Label>
                                                <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                                                    <SelectTrigger 
                                                        id="role-select" 
                                                        className="w-full bg-gray-700/50 border-gray-600 text-white focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300"
                                                    >
                                                        <SelectValue placeholder="Sélectionnez un rôle" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                                        <SelectItem value="admin" className="flex items-center space-x-2 focus:bg-gray-700">
                                                            <span>👑 Administrateur</span>
                                                        </SelectItem>
                                                        <SelectItem value="mecanicien" className="flex items-center space-x-2 focus:bg-gray-700">
                                                            <span>💼 Mécanicien</span>
                                                        </SelectItem>
                                                        <SelectItem value="utilisateur" className="flex items-center space-x-2 focus:bg-gray-700">
                                                            <span>👤 Utilisateur</span>
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col gap-4 border-t border-gray-700 pt-6 sm:flex-row sm:justify-end">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-700 hover:text-white transition-all duration-300 sm:order-first"
                                                onClick={() => window.history.back()}
                                            >
                                                Annuler
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Save className="mr-2 h-4 w-4" />
                                                {processing ? 'Mise à jour...' : 'Mettre à jour'}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}