import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, CircleAlert, Package, Plus, Wrench } from 'lucide-react';
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
        <AppLayout
            breadcrumbs={[
                { title: 'Accueil', href: '/dashboard' },
                { title: 'piece', href: '/pieces' },
                { title: 'ajouter des pièces et faire une intervention', href: '/pieces/create' },
            ]}
        >
            <Head title="Créer une nouvelle pièce" />

            <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl">Intervention</h1>
                        <p className="mx-auto max-w-2xl text-lg text-gray-400">
                            Ajoutez les pièces nécessaires et complétez les informations d'intervention
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                        {/* Main Content - Forms */}
                        <div className="space-y-8 lg:col-span-8">
                            {/* Progress Steps */}
                            <div className="rounded-2xl border border-gray-700 bg-gray-800 p-6 shadow-sm">
                                <div className="flex items-center justify-center">
                                    <div className={`flex items-center ${showInterventionForm ? 'text-blue-400' : 'text-white'}`}>
                                        <div
                                            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${showInterventionForm ? 'border-blue-400' : 'border-blue-400 bg-blue-600 text-white'}`}
                                        >
                                            <Package className="h-5 w-5" />
                                        </div>
                                        <span className="ml-3 font-medium">Pièces</span>
                                    </div>

                                    <div className="mx-4 h-0.5 w-24 bg-gray-600"></div>

                                    <div className={`flex items-center ${showInterventionForm ? 'text-blue-400' : 'text-gray-500'}`}>
                                        <div
                                            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${showInterventionForm ? 'border-blue-400 bg-blue-600 text-white' : 'border-gray-600'}`}
                                        >
                                            <Wrench className="h-5 w-5" />
                                        </div>
                                        <span className="ml-3 font-medium">Intervention</span>
                                    </div>
                                </div>
                            </div>

                            {/* Forms Container */}
                            <div className="overflow-hidden rounded-2xl border border-gray-700 bg-gray-800 shadow-sm">
                                {!showInterventionForm ? (
                                    /* -------- FORMULAIRE AJOUT PIECE -------- */
                                    <form onSubmit={handleSubmitPiece} className="p-8">
                                        {Object.keys(errorsPiece).length > 0 && (
                                            <Alert className="mb-6 border-red-800 bg-red-900/20 text-red-200">
                                                <CircleAlert className="text-red-400" />
                                                <AlertTitle className="text-red-100">Erreur !</AlertTitle>
                                                <AlertDescription className="text-red-300">
                                                    <ul className="list-inside list-disc">
                                                        {Object.entries(errorsPiece).map(([key, message]) => (
                                                            <li key={key}>{message as string}</li>
                                                        ))}
                                                    </ul>
                                                </AlertDescription>
                                            </Alert>
                                        )}

                                        <div className="mb-8">
                                            <h2 className="flex items-center gap-3 text-2xl font-bold text-white">
                                                <Package className="h-7 w-7 text-blue-400" />
                                                Ajouter une pièce
                                            </h2>
                                            <p className="mt-2 text-gray-400">Renseignez les détails de la pièce à ajouter</p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="nom" className="text-sm font-medium text-gray-300">
                                                    Nom de la pièce
                                                </Label>
                                                <Input
                                                    type="text"
                                                    value={data.nom}
                                                    onChange={(e) => setData('nom', e.target.value)}
                                                    className="w-full border-gray-600 bg-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Ex : Filtre à huile"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="fournisseur" className="text-sm font-medium text-gray-300">
                                                    Fournisseur
                                                </Label>
                                                <div className="flex gap-2">
                                                    <select
                                                        value={data.fournisseur_id}
                                                        onChange={(e) => setData('fournisseur_id', e.target.value)}
                                                        className="flex-1 rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="">-- Choisir un fournisseur --</option>
                                                        {fournisseurs.map((f: any) => (
                                                            <option key={f.id} value={f.id} className="bg-gray-700 text-white">
                                                                {f.nom}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowModal(true)}
                                                        className="inline-flex w-12 items-center justify-center rounded-lg bg-blue-600 text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                                                    >
                                                        <Plus className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="prix" className="text-sm font-medium text-gray-300">
                                                    Prix (Ar)
                                                </Label>
                                                <Input
                                                    type="text"
                                                    value={data.prix}
                                                    onChange={(e) => setData('prix', e.target.value)}
                                                    className="w-full border-gray-600 bg-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                                    placeholder="0.00"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="quantite" className="text-sm font-medium text-gray-300">
                                                    Quantitée(s)
                                                </Label>
                                                <Input
                                                    type="text"
                                                    value={data.quantite}
                                                    onChange={(e) => setData('quantite', e.target.value)}
                                                    className="w-full border-gray-600 bg-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                                    placeholder="1"
                                                />
                                            </div>
                                        </div>

                                        <Input value={data.entretien_id} onChange={(e) => setData('entretien_id', e.target.value)} hidden />
                                        <Input value={data.vehicule_id} onChange={(e) => setData('vehicule_id', e.target.value)} hidden />

                                        <div className="mt-8 flex flex-col justify-end gap-4 border-t border-gray-700 pt-6 sm:flex-row">
                                            <Button
                                                type="submit"
                                                disabled={processingPiece}
                                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                                            >
                                                <Plus className="h-4 w-4" />
                                                Ajouter la pièce
                                            </Button>
                                            <Button
                                                type="button"
                                                onClick={() => setShowInterventionForm(true)}
                                                className="inline-flex items-center gap-2 rounded-lg bg-gray-700 px-6 py-3 text-white transition-colors hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                                            >
                                                Continuer
                                                <ArrowRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </form>
                                ) : (
                                    /* -------- FORMULAIRE INTERVENTION -------- */
                                    <form onSubmit={handleIntervention} className="p-8">
                                        {Object.keys(errorsPiece).length > 0 && (
                                            <Alert className="mb-6 border-red-800 bg-red-900/20 text-red-200">
                                                <CircleAlert className="text-red-400" />
                                                <AlertTitle className="text-red-100">Erreur !</AlertTitle>
                                                <AlertDescription className="text-red-300">
                                                    <ul className="list-inside list-disc">
                                                        {Object.entries(errorsPiece).map(([key, message]) => (
                                                            <li key={key}>{message as string}</li>
                                                        ))}
                                                    </ul>
                                                </AlertDescription>
                                            </Alert>
                                        )}

                                        <div className="mb-8">
                                            <h2 className="flex items-center gap-3 text-2xl font-bold text-white">
                                                <Wrench className="h-7 w-7 text-green-400" />
                                                Détails de l'intervention
                                            </h2>
                                            <p className="mt-2 text-gray-400">Complétez les informations de l'intervention</p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-gray-300">Main d'œuvre (prix)</Label>
                                                <Input
                                                    value={data.main_oeuvre}
                                                    onChange={(e) => setData('main_oeuvre', e.target.value)}
                                                    className="w-full border-gray-600 bg-gray-700 text-white placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                                                    placeholder="0.00"
                                                />
                                            </div>

                                            {/* <div className="space-y-2">
                                                <Label className="text-sm font-medium text-gray-300">Kilométrage</Label>
                                                <Input
                                                    value={data.kilometrage}
                                                    onChange={(e) => setData('kilometrage', e.target.value)}
                                                    className="w-full border-gray-600 bg-gray-700 text-white placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                                                    placeholder="0"
                                                />
                                            </div> */}

                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-gray-300">Durée d'immobilisation (heures)</Label>
                                                <Input
                                                    type="number"
                                                    value={data.duree_immobilisation}
                                                    onChange={(e) => setData('duree_immobilisation', e.target.value)}
                                                    className="w-full border-gray-600 bg-gray-700 text-white placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                                                    placeholder="0"
                                                />
                                            </div>

                                            <div className="space-y-2 md:col-span-2">
                                                <Label className="text-sm font-medium text-gray-300">Description</Label>
                                                <Input
                                                    type="text"
                                                    value={data.description}
                                                    onChange={(e) => setData('description', e.target.value)}
                                                    className="w-full border-gray-600 bg-gray-700 text-white placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                                                    placeholder="Description de l'intervention..."
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-8 flex flex-col justify-end gap-4 border-t border-gray-700 pt-6 sm:flex-row">
                                            <Button
                                                type="button"
                                                onClick={() => setShowInterventionForm(false)}
                                                className="inline-flex items-center gap-2 rounded-lg border border-gray-600 bg-gray-700 px-6 py-3 text-white transition-colors hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                                            >
                                                <ArrowLeft className="h-4 w-4" />
                                                Retour
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={processingPiece}
                                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
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
                            <div className="sticky top-8 rounded-2xl border border-gray-700 bg-gray-800 p-6 shadow-sm">
                                <div className="mb-6">
                                    <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                                        <Package className="h-5 w-5 text-blue-400" />
                                        Pièces ajoutées
                                        <span className="ml-2 rounded-full bg-blue-900/50 px-2.5 py-0.5 text-sm font-medium text-blue-300">
                                            {pieces.length}
                                        </span>
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-400">Liste des pièces sélectionnées pour cette intervention</p>
                                </div>

                                {pieces.length === 0 ? (
                                    <div className="py-8 text-center">
                                        <Package className="mx-auto mb-3 h-12 w-12 text-gray-600" />
                                        <p className="text-sm text-gray-500">Aucune pièce ajoutée pour le moment</p>
                                        <p className="mt-1 text-xs text-gray-600">Les pièces ajoutées apparaîtront ici</p>
                                    </div>
                                ) : (
                                    <div className="max-h-96 space-y-4 overflow-y-auto">
                                        {pieces.map((p) => (
                                            <div
                                                key={p.id}
                                                className="group rounded-xl border border-gray-600 bg-gray-700 p-4 transition-colors hover:border-blue-500"
                                            >
                                                <div className="mb-2 flex items-start justify-between">
                                                    <h3 className="font-semibold text-white transition-colors group-hover:text-blue-400">
                                                        {p.nom}
                                                    </h3>
                                                    <span className="rounded bg-blue-900/50 px-2 py-1 text-xs font-medium text-blue-300">
                                                        {p.prix} Ar
                                                    </span>
                                                </div>
                                                <div className="space-y-1 text-sm text-gray-400">
                                                    <p>
                                                        Quantitée(s) : <span className="font-medium text-gray-300">{p.quantite}</span>
                                                    </p>
                                                    {p.fournisseur && <p className="text-xs text-gray-500">Fournisseur : {p.fournisseur.nom}</p>}
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity">
                    <div className="animate-scaleIn mx-4 w-full max-w-lg">
                        <div className="rounded-2xl border border-gray-600 bg-gray-800 shadow-2xl">
                            <div className="border-b border-gray-700 p-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-900/30">
                                        <Plus className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Nouveau fournisseur</h2>
                                        <p className="text-sm text-gray-400">Ajoutez les informations du fournisseur</p>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4 p-6">
                                {Object.keys(errorsFournisseur).length > 0 && (
                                    <Alert className="border-red-800 bg-red-900/20 text-red-200">
                                        <CircleAlert className="text-red-400" />
                                        <AlertTitle className="text-red-100">Erreurs détectées</AlertTitle>
                                        <AlertDescription className="text-red-300">
                                            <ul className="ml-5 list-disc text-sm">
                                                {Object.entries(errorsFournisseur).map(([key, message]) => (
                                                    <li key={key}>{message as string}</li>
                                                ))}
                                            </ul>
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-300">Nom</Label>
                                        <Input
                                            type="text"
                                            placeholder="Garage MécaPro"
                                            value={fournisseurData.nom}
                                            onChange={(e) => setFournisseurData('nom', e.target.value)}
                                            className="border-gray-600 bg-gray-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-300">Type</Label>
                                        <Input
                                            type="text"
                                            placeholder="Garage"
                                            value={fournisseurData.type}
                                            onChange={(e) => setFournisseurData('type', e.target.value)}
                                            className="border-gray-600 bg-gray-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label className="text-sm font-medium text-gray-300">Adresse</Label>
                                        <Input
                                            type="text"
                                            placeholder="Manjakaray, Antananarivo"
                                            value={fournisseurData.addresse}
                                            onChange={(e) => setFournisseurData('addresse', e.target.value)}
                                            className="border-gray-600 bg-gray-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-300">Téléphone</Label>
                                        <Input
                                            type="tel"
                                            placeholder="+261 34 00 000 00"
                                            value={fournisseurData.phone}
                                            onChange={(e) => setFournisseurData('phone', e.target.value)}
                                            className="border-gray-600 bg-gray-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-300">Email</Label>
                                        <Input
                                            type="email"
                                            placeholder="exemple@fournisseur.mg"
                                            value={fournisseurData.email}
                                            onChange={(e) => setFournisseurData('email', e.target.value)}
                                            className="border-gray-600 bg-gray-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label className="text-sm font-medium text-gray-300">Site web</Label>
                                        <Input
                                            type="text"
                                            placeholder="www.fournisseur.mg"
                                            value={fournisseurData.siteWeb}
                                            onChange={(e) => setFournisseurData('siteWeb', e.target.value)}
                                            className="border-gray-600 bg-gray-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1 border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
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