import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { CircleAlert, Plus, ArrowLeft, ArrowRight, Wrench, Package } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Intervention',
        href: '/pieces/create',
    },
];

type Piece = {
    id: number;
    nom: string;
    prix: number;
    quantite: number;
    fournisseur?: { nom: string };
};

type Fournisseur = {
    nom: string;
    type: string;
    addresse: string;
    phone: number;
    email: string;
    sitWeb: string;
};

type PieceProps = {
    fournisseurs: Fournisseur[];
    entretien_id: number;
    vehicule_id: number;
    pieces: Piece[];
};

export default function Create() {
    const { fournisseurs = [], entretien_id, vehicule_id, pieces = [] } = usePage<PieceProps>().props;
    
    const {
        data,
        setData,
        post: posetePiece,
        processing: processingPiece,
        errors: errorsPiece,
    } = useForm({
        nom: '',
        prix: '',
        quantite: '',
        fournisseur_id: '',
        entretien_id: entretien_id || '',
        vehicule_id: vehicule_id || '',
        main_oeuvre: '',
        kilometrage: '',
        duree_immobilisation: '',
        description: '',
        statut: 'En cours',
    });

    const {
        data: fournisseurData,
        setData: setFournisseurData,
        post: postFournisseur,
        processing: processingFournisseur,
        errors: errorsFournisseur,
    } = useForm({
        nom: '',
        type: '',
        addresse: '',
        phone: '',
        email: '',
        siteWeb: '',
    });

    const [showInterventionForm, setShowInterventionForm] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleSubmitPiece = (e: React.FormEvent) => {
        e.preventDefault();
        posetePiece(route('pieces.store'));
        data.nom = '';
        data.prix = '';
        data.quantite = '';
        data.fournisseur_id = '';
    };

    const handleIntervention = (e: React.FormEvent) => {
        e.preventDefault();
        posetePiece(route('interventions.store'));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postFournisseur(route('fournisseurs.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Créer une nouvelle pièce" />
            
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-3">
                            Gestion d'Intervention
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Ajoutez les pièces nécessaires et complétez les informations d'intervention
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Main Content - Forms */}
                        <div className="lg:col-span-8 space-y-8">
                            {/* Progress Steps */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center justify-center">
                                    <div className={`flex items-center ${showInterventionForm ? 'text-blue-600' : 'text-gray-900'}`}>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${showInterventionForm ? 'border-blue-600' : 'border-blue-600 bg-blue-600 text-white'}`}>
                                            <Package className="w-5 h-5" />
                                        </div>
                                        <span className="ml-3 font-medium">Pièces</span>
                                    </div>
                                    
                                    <div className="w-24 h-0.5 bg-gray-300 mx-4"></div>
                                    
                                    <div className={`flex items-center ${showInterventionForm ? 'text-blue-600' : 'text-gray-500'}`}>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${showInterventionForm ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
                                            <Wrench className="w-5 h-5" />
                                        </div>
                                        <span className="ml-3 font-medium">Intervention</span>
                                    </div>
                                </div>
                            </div>

                            {/* Forms Container */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                {!showInterventionForm ? (
                                    /* -------- FORMULAIRE AJOUT PIECE -------- */
                                    <form onSubmit={handleSubmitPiece} className="p-8">
                                        {Object.keys(errorsPiece).length > 0 && (
                                            <Alert className="mb-6 border-red-200 bg-red-50">
                                                <CircleAlert className="text-red-600" />
                                                <AlertTitle className="text-red-800">Erreur !</AlertTitle>
                                                <AlertDescription className="text-red-700">
                                                    <ul className="list-disc list-inside">
                                                        {Object.entries(errorsPiece).map(([key, message]) => (
                                                            <li key={key}>{message as string}</li>
                                                        ))}
                                                    </ul>
                                                </AlertDescription>
                                            </Alert>
                                        )}

                                        <div className="mb-8">
                                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                                <Package className="w-7 h-7 text-blue-600" />
                                                Ajouter une pièce
                                            </h2>
                                            <p className="text-gray-600 mt-2">Renseignez les détails de la pièce à ajouter</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="nom" className="text-sm font-medium text-gray-700">
                                                    Nom de la pièce
                                                </Label>
                                                <Input
                                                    type="text"
                                                    value={data.nom}
                                                    onChange={(e) => setData('nom', e.target.value)}
                                                    className="w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Ex : Filtre à huile"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="fournisseur" className="text-sm font-medium text-gray-700">
                                                    Fournisseur
                                                </Label>
                                                <div className="flex gap-2">
                                                    <select
                                                        value={data.fournisseur_id}
                                                        onChange={(e) => setData('fournisseur_id', e.target.value)}
                                                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                    >
                                                        <option value="">-- Choisir un fournisseur --</option>
                                                        {fournisseurs.map((f: any) => (
                                                            <option key={f.id} value={f.id} className="bg-white text-black">
                                                                {f.nom}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowModal(true)}
                                                        className="inline-flex items-center justify-center w-12 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                                    >
                                                        <Plus className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="prix" className="text-sm font-medium text-gray-700">
                                                    Prix (Ar)
                                                </Label>
                                                <Input
                                                    type="text"
                                                    value={data.prix}
                                                    onChange={(e) => setData('prix', e.target.value)}
                                                    className="w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="0.00"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="quantite" className="text-sm font-medium text-gray-700">
                                                    Quantité
                                                </Label>
                                                <Input
                                                    type="text"
                                                    value={data.quantite}
                                                    onChange={(e) => setData('quantite', e.target.value)}
                                                    className="w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="1"
                                                />
                                            </div>
                                        </div>

                                        <Input value={data.entretien_id} onChange={(e) => setData('entretien_id', e.target.value)} hidden />
                                        <Input value={data.vehicule_id} onChange={(e) => setData('vehicule_id', e.target.value)} hidden />

                                        <div className="flex flex-col sm:flex-row gap-4 justify-end mt-8 pt-6 border-t border-gray-200">
                                            <Button
                                                type="submit"
                                                disabled={processingPiece}
                                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Ajouter la pièce
                                            </Button>
                                            <Button
                                                type="button"
                                                onClick={() => setShowInterventionForm(true)}
                                                className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                            >
                                                Continuer
                                                <ArrowRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </form>
                                ) : (
                                    /* -------- FORMULAIRE INTERVENTION -------- */
                                    <form onSubmit={handleIntervention} className="p-8">
                                        {Object.keys(errorsPiece).length > 0 && (
                                            <Alert className="mb-6 border-red-200 bg-red-50">
                                                <CircleAlert className="text-red-600" />
                                                <AlertTitle className="text-red-800">Erreur !</AlertTitle>
                                                <AlertDescription className="text-red-700">
                                                    <ul className="list-disc list-inside">
                                                        {Object.entries(errorsPiece).map(([key, message]) => (
                                                            <li key={key}>{message as string}</li>
                                                        ))}
                                                    </ul>
                                                </AlertDescription>
                                            </Alert>
                                        )}

                                        <div className="mb-8">
                                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                                <Wrench className="w-7 h-7 text-green-600" />
                                                Détails de l'intervention
                                            </h2>
                                            <p className="text-gray-600 mt-2">Complétez les informations de l'intervention</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-gray-700">
                                                    Main d'œuvre (prix)
                                                </Label>
                                                <Input
                                                    value={data.main_oeuvre}
                                                    onChange={(e) => setData('main_oeuvre', e.target.value)}
                                                    className="w-full focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                    placeholder="0.00"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-gray-700">
                                                    Kilométrage
                                                </Label>
                                                <Input
                                                    value={data.kilometrage}
                                                    onChange={(e) => setData('kilometrage', e.target.value)}
                                                    className="w-full focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                    placeholder="0"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-gray-700">
                                                    Durée d'immobilisation (heures)
                                                </Label>
                                                <Input
                                                    type="number"
                                                    value={data.duree_immobilisation}
                                                    onChange={(e) => setData('duree_immobilisation', e.target.value)}
                                                    className="w-full focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                    placeholder="0"
                                                />
                                            </div>

                                            <div className="md:col-span-2 space-y-2">
                                                <Label className="text-sm font-medium text-gray-700">
                                                    Description
                                                </Label>
                                                <Input
                                                    type="text"
                                                    value={data.description}
                                                    onChange={(e) => setData('description', e.target.value)}
                                                    className="w-full focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                    placeholder="Description de l'intervention..."
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4 justify-between mt-8 pt-6 border-t border-gray-200">
                                            <Button
                                                type="button"
                                                onClick={() => setShowInterventionForm(false)}
                                                className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                            >
                                                <ArrowLeft className="w-4 h-4" />
                                                Retour
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={processingPiece}
                                                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                            >
                                                Valider l'intervention
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>

                        {/* Sidebar - Liste des pièces */}
                        <div className="lg:col-span-4">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <Package className="w-5 h-5 text-blue-600" />
                                        Pièces ajoutées
                                        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full ml-2">
                                            {pieces.length}
                                        </span>
                                    </h2>
                                    <p className="text-gray-600 text-sm mt-1">Liste des pièces sélectionnées pour cette intervention</p>
                                </div>

                                {pieces.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500 text-sm">Aucune pièce ajoutée pour le moment</p>
                                        <p className="text-gray-400 text-xs mt-1">Les pièces ajoutées apparaîtront ici</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4 max-h-96 overflow-y-auto">
                                        {pieces.map((p) => (
                                            <div key={p.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-blue-300 transition-colors group">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                                                        {p.nom}
                                                    </h3>
                                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                                                        {p.prix} Ar
                                                    </span>
                                                </div>
                                                <div className="space-y-1 text-sm text-gray-600">
                                                    <p>Quantité : <span className="font-medium">{p.quantite}</span></p>
                                                    {p.fournisseur && (
                                                        <p className="text-xs text-gray-500">
                                                            Fournisseur : {p.fournisseur.nom}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Fournisseur */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
                    <div className="animate-scaleIn w-full max-w-lg mx-4">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Plus className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">Nouveau fournisseur</h2>
                                        <p className="text-gray-600 text-sm">Ajoutez les informations du fournisseur</p>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                {Object.keys(errorsFournisseur).length > 0 && (
                                    <Alert className="border-red-200 bg-red-50">
                                        <CircleAlert className="text-red-600" />
                                        <AlertTitle className="text-red-800">Erreurs détectées</AlertTitle>
                                        <AlertDescription className="text-red-700">
                                            <ul className="ml-5 list-disc text-sm">
                                                {Object.entries(errorsFournisseur).map(([key, message]) => (
                                                    <li key={key}>{message as string}</li>
                                                ))}
                                            </ul>
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-700">Nom</Label>
                                        <Input
                                            type="text"
                                            placeholder="Garage MécaPro"
                                            value={fournisseurData.nom}
                                            onChange={(e) => setFournisseurData('nom', e.target.value)}
                                            className="focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-700">Type</Label>
                                        <Input
                                            type="text"
                                            placeholder="Garage"
                                            value={fournisseurData.type}
                                            onChange={(e) => setFournisseurData('type', e.target.value)}
                                            className="focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <Label className="text-sm font-medium text-gray-700">Adresse</Label>
                                        <Input
                                            type="text"
                                            placeholder="Manjakaray, Antananarivo"
                                            value={fournisseurData.addresse}
                                            onChange={(e) => setFournisseurData('addresse', e.target.value)}
                                            className="focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-700">Téléphone</Label>
                                        <Input
                                            type="tel"
                                            placeholder="+261 34 00 000 00"
                                            value={fournisseurData.phone}
                                            onChange={(e) => setFournisseurData('phone', e.target.value)}
                                            className="focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-700">Email</Label>
                                        <Input
                                            type="email"
                                            placeholder="exemple@fournisseur.mg"
                                            value={fournisseurData.email}
                                            onChange={(e) => setFournisseurData('email', e.target.value)}
                                            className="focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <Label className="text-sm font-medium text-gray-700">Site web</Label>
                                        <Input
                                            type="text"
                                            placeholder="www.fournisseur.mg"
                                            value={fournisseurData.siteWeb}
                                            onChange={(e) => setFournisseurData('siteWeb', e.target.value)}
                                            className="focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Annuler
                                    </Button>
                                    <Button
                                        disabled={processingFournisseur}
                                        type="submit"
                                        className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                                    >
                                        Ajouter le fournisseur
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}