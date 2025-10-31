import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { CircleAlert, Package, Save, ArrowLeft } from 'lucide-react';
import { route } from 'ziggy-js';

interface piece {
    id: number;
    nom: string;
    prix: number;
    quantite: number;
    fournisseur_id: number;
}

interface Props {
    piece: piece;
    fournisseurs: { id: number; nom: string }[]; 
}

export default function Edit({ piece, fournisseurs }: Props) {
    const { processing, data, setData, post, errors } = useForm({
        id: piece.id,
        nom: piece.nom ?? '',
        prix: piece.prix ?? '',
        quantite: piece.quantite ?? '',
        fournisseur_id: piece.fournisseur_id ?? '',
    });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('pieces.update', piece.id), {
            forceFormData: true,
            method: 'put',
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Modifier une pièce', href: `/pieces/${piece.id}/edit` }]}>
            <Head title="Mise à jour d'une pièce" />
            
            <div className="container  mx-auto px-2 py-25 max-w-4xl">
                {/* Header avec bouton retour */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Package className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Modifier la pièce</h1>
                            <p className="text-gray-600">Mettez à jour les informations de la pièce #{piece.id}</p>
                        </div>
                    </div>
                    {/* <Button 
                        variant="outline" 
                        onClick={() => window.history.back()}
                        className="flex items-center space-x-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Retour</span>
                    </Button> */}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Formulaire principal */}
                    <div className="lg:col-span-2">
                        <Card className="shadow-sm border-0">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-semibold flex items-center space-x-2">
                                    <Package className="h-5 w-5" />
                                    <span>Informations de la pièce</span>
                                </CardTitle>
                                <CardDescription>
                                    Modifiez les détails de la pièce dans le formulaire ci-dessous
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <form onSubmit={handleUpdate} className="space-y-6">
                                    {Object.keys(errors).length > 0 && (
                                        <Alert variant="destructive" className="mb-6">
                                            <CircleAlert className="h-4 w-4" />
                                            <AlertTitle>Erreurs de validation</AlertTitle>
                                            <AlertDescription>
                                                <ul className="list-disc list-inside space-y-1">
                                                    {Object.entries(errors).map(([key, message]) => (
                                                        <li key={key} className="text-sm">{message as string}</li>
                                                    ))}
                                                </ul>
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Nom */}
                                        <div className="space-y-2">
                                            <Label htmlFor="nom" className="text-sm font-medium">
                                                Nom de la pièce *
                                            </Label>
                                            <Input
                                                id="nom"
                                                type="text"
                                                value={data.nom}
                                                onChange={(e) => setData('nom', e.target.value)}
                                                placeholder="Entrez le nom de la pièce"
                                                className="w-full"
                                            />
                                        </div>

                                        {/* Fournisseur */}
                                        <div className="space-y-2">
                                            <Label htmlFor="fournisseur" className="text-sm font-medium">
                                                Fournisseur *
                                            </Label>
                                            <Select
                                                value={data.fournisseur_id.toString()}
                                                onValueChange={(value) => setData('fournisseur_id', Number(value))}
                                            >
                                                <SelectTrigger id="fournisseur" className="w-full">
                                                    <SelectValue placeholder="Sélectionnez un fournisseur" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {fournisseurs.map((fournisseur) => (
                                                        <SelectItem key={fournisseur.id} value={fournisseur.id.toString()}>
                                                            {fournisseur.nom}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Quantité */}
                                        <div className="space-y-2">
                                            <Label htmlFor="quantite" className="text-sm font-medium">
                                                Quantité en stock *
                                            </Label>
                                            <Input
                                                id="quantite"
                                                type="number"
                                                min="0"
                                                value={data.quantite}
                                                onChange={(e) => setData('quantite', Number(e.target.value))}
                                                placeholder="0"
                                                className="w-full"
                                            />
                                        </div>

                                        {/* Prix */}
                                        <div className="space-y-2">
                                            <Label htmlFor="prix" className="text-sm font-medium">
                                                Prix (€) *
                                            </Label>
                                            <Input
                                                id="prix"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={data.prix}
                                                onChange={(e) => setData('prix', Number(e.target.value))}
                                                placeholder="0.00"
                                                className="w-full"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                                        <Button 
                                            type="submit" 
                                            disabled={processing}
                                            className="flex items-center space-x-2 bg-primary hover:bg-primary/90"
                                        >
                                            <Save className="h-4 w-4" />
                                            <span>{processing ? 'Mise à jour...' : 'Mettre à jour la pièce'}</span>
                                        </Button>
                                        <Button 
                                            type="button" 
                                            variant="outline"
                                            onClick={() => window.history.back()}
                                        >
                                            Annuler
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar d'informations */}
                    {/* <div className="lg:col-span-1">
                        <Card className="shadow-sm border-0 bg-gray-50">
                            <CardHeader>
                                <CardTitle className="text-base font-semibold">
                                    Informations importantes
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-gray-700">Conseils de saisie</h4>
                                    <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                                        <li>Vérifiez l'exactitude du nom</li>
                                        <li>Maintenez les quantités à jour</li>
                                        <li>Sélectionnez le bon fournisseur</li>
                                        <li>Les prix doivent inclure les taxes</li>
                                    </ul>
                                </div>
                                
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-gray-700">Statut actuel</h4>
                                    <div className="text-xs text-gray-600 space-y-1">
                                        <div className="flex justify-between">
                                            <span>ID Pièce:</span>
                                            <span className="font-mono">#{piece.id}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Dernière mise à jour:</span>
                                            <span>Maintenant</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div> */}
                </div>
            </div>
        </AppLayout>
    );
}