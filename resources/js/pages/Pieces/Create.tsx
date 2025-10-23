import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { CircleAlert } from 'lucide-react';
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
type fournisseurs = {
    nom: string;
    type: string;
    addresse: string;
    phone: number;
    email: string;
    sitWeb: string;
};
type PieceProps = {
    fournisseurs: fournisseurs[];
    entretien_id: number;
    vehicule_id: number;
    pieces: Piece[];
};
export default function Create() {
    const { fournisseurs = [], entretien_id, vehicule_id, pieces = [] } = usePage<PieceProps>().props; // données envoyées depuis Laravel
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
        // Champs d'intervention
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
    // const [piece, setPiece] = useState('');
    // console.log("entretien : " + entretien_id);
    // console.log("vehicule : " + vehicule_id);
    const handleSubmitPiece = (e: React.FormEvent) => {
        e.preventDefault();
        posetePiece(route('pieces.store'));
        data.nom = '';
        data.prix = '';
        data.quantite = '';
        data.fournisseur_id = '';
        console.log(data);
    };
    // --- Soumission du formulaire intervention ---
    const handleIntervention = (e: React.FormEvent) => {
        e.preventDefault();
        posetePiece(route('interventions.store'));
        console.log('Intervention enregistrée : ', data);
        // tu peux ajouter un `post(route('interventions.store'), data)` ici
    };
    const [showModal, setShowModal] = useState(false);
    const handleAddFournisseur = () => {
        setShowModal(true); // si tu utilises un modal
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postFournisseur(route('fournisseurs.store'));
        // console.log('fournisseurData' + fournisseurData);
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Créer un nouveaux piece" />
            <div className="m-5 flex w-8/12 justify-center gap-10 p-4">
                {!showInterventionForm ? (
                    <>
                        {/* -------- FORMULAIRE AJOUT PIECE -------- */}
                        <form onSubmit={handleSubmitPiece} className="relative rounded-xl p-6 shadow-lg" encType="multipart/form-data">
                            {/* display errors */}

                            {Object.keys(errorsPiece).length > 0 && (
                                <Alert>
                                    <CircleAlert />
                                    <AlertTitle>Erreur !</AlertTitle>
                                    <AlertDescription>
                                        <ul>
                                            {Object.entries(errorsPiece).map(([key, message]) => (
                                                <li key={key}>{message as string}</li>
                                            ))}
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            )}
                            <h2 className="mb-4 text-xl font-semibold">Ajouter les pièces</h2>
                            <div className="gap-1.5">
                                <Label htmlFor="piece nom">Nom</Label>
                                <Input type="text" value={data.nom} onChange={(e) => setData('nom', e.target.value)} />
                            </div>
                            <div className="gap-1.5">
                                <Label htmlFor="fournisseur">Fournisseur</Label>
                                <div className="flex items-center gap-2">
                                    <select
                                        value={data.fournisseur_id}
                                        onChange={(e) => setData('fournisseur_id', e.target.value)}
                                        className="flex-1 rounded border border-gray-300 px-3 py-2"
                                    >
                                        <option value="">--Choisir un fournisseur--</option>
                                        {fournisseurs.map((f: any) => (
                                            <option key={f.id} value={f.id} className="bg-white text-black">
                                                {f.nom}
                                            </option>
                                        ))}
                                    </select>

                                    {/* Bouton pour ajouter un fournisseur */}
                                    <button
                                        type="button"
                                        onClick={() => handleAddFournisseur()} // fonction à définir
                                        className="rounded bg-blue-500 px-3 py-2 text-white transition hover:bg-blue-600"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <div className="gap-1.5">
                                <Label htmlFor="piece prix ">Prix</Label>
                                <Input type="text" value={data.prix} onChange={(e) => setData('prix', e.target.value)} />
                            </div>
                            <div className="gap-1.5">
                                <Label htmlFor="piece quantité ">Quantité</Label>
                                <Input type="text" value={data.quantite} onChange={(e) => setData('quantite', e.target.value)} />
                            </div>
                            <Input value={data.entretien_id} onChange={(e) => setData('entretien_id', e.target.value)} hidden={true} />
                            <Input value={data.vehicule_id} onChange={(e) => setData('vehicule_id', e.target.value)} hidden={true} />
                            <div className="m-4 flex justify-center gap-10">
                                <Button disabled={processingPiece} className="w-50" type="submit">
                                    Ajouter
                                </Button>
                                <Button type="button" className="w-50" onClick={() => setShowInterventionForm(true)}>
                                    Suivant
                                </Button>
                            </div>
                        </form>
                        {showModal && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                                <div className="animate-fadeIn w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-8 shadow-2xl">
                                    <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">🏭 Ajouter un nouveau fournisseur</h2>

                                    {/* Formulaire */}
                                    <form onSubmit={handleSubmit} className="flex flex-col space-y-4" encType="multipart/form-data">
                                        {/* Affichage des erreurs */}
                                        {Object.keys(errorsFournisseur).length > 0 && (
                                            <Alert className="mb-4">
                                                <CircleAlert className="text-red-600" />
                                                <AlertTitle className="font-semibold text-red-600">Erreurs détectées</AlertTitle>
                                                <AlertDescription>
                                                    <ul className="ml-5 list-disc text-sm text-gray-700">
                                                        {Object.entries(errorsFournisseur).map(([key, message]) => (
                                                            <li key={key}>{message as string}</li>
                                                        ))}
                                                    </ul>
                                                </AlertDescription>
                                            </Alert>
                                        )}
                                        <div className="flex flex-col gap-1.5">
                                            <Label htmlFor="nom" className="font-medium text-gray-700">
                                                Nom du fournisseur
                                            </Label>
                                            <Input
                                                type="text"
                                                placeholder="Ex : Garage MécaPro"
                                                value={fournisseurData.nom}
                                                onChange={(e) => setFournisseurData('nom', e.target.value)}
                                                className="focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <Label htmlFor="type" className="font-medium text-gray-700">
                                                Type
                                            </Label>
                                            <Input
                                                type="text"
                                                placeholder="Ex : Garage"
                                                value={fournisseurData.type}
                                                onChange={(e) => setFournisseurData('type', e.target.value)}
                                                className="focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <Label htmlFor="adresse" className="font-medium text-gray-700">
                                                Adresse
                                            </Label>
                                            <Input
                                                type="text"
                                                placeholder="Ex : Manjakaray, Antananarivo"
                                                value={fournisseurData.addresse}
                                                onChange={(e) => setFournisseurData('addresse', e.target.value)}
                                                className="focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <Label htmlFor="phone" className="font-medium text-gray-700">
                                                Numéro de téléphone
                                            </Label>
                                            <Input
                                                type="tel"
                                                placeholder="+261 34 00 000 00"
                                                value={fournisseurData.phone}
                                                onChange={(e) => setFournisseurData('phone', e.target.value)}
                                                className="focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <Label htmlFor="email" className="font-medium text-gray-700">
                                                Adresse e-mail
                                            </Label>
                                            <Input
                                                type="email"
                                                placeholder="exemple@fournisseur.mg"
                                                value={fournisseurData.email}
                                                onChange={(e) => setFournisseurData('email', e.target.value)}
                                                className="focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <Label htmlFor="siteWeb" className="font-medium text-gray-700">
                                                Site web
                                            </Label>
                                            <Input
                                                type="text"
                                                placeholder="www.fournisseur.mg"
                                                value={fournisseurData.siteWeb}
                                                onChange={(e) => setFournisseurData('siteWeb', e.target.value)}
                                                className="focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
                                            />
                                        </div>

                                        <div className="mt-6 flex justify-end gap-3">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="border-gray-400 text-gray-600 hover:bg-gray-100"
                                                onClick={() => setShowModal(false)}
                                            >
                                                Annuler
                                            </Button>

                                            <Button
                                                disabled={processingFournisseur}
                                                type="submit"
                                                className="bg-blue-600 text-white shadow-md transition-all hover:bg-blue-700"
                                            >
                                                Ajouter le fournisseur
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        {/* -------- FORMULAIRE INTERVENTION -------- */}
                        <form onSubmit={handleIntervention} className="relative rounded-xl p-6 shadow-lg">
                            {Object.keys(errorsPiece).length > 0 && (
                                <Alert>
                                    <CircleAlert />
                                    <AlertTitle>Erreur !</AlertTitle>
                                    <AlertDescription>
                                        <ul>
                                            {Object.entries(errorsPiece).map(([key, message]) => (
                                                <li key={key}>{message as string}</li>
                                            ))}
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            )}

                            <h2 className="mb-4 text-xl font-semibold">Intervention</h2>

                            <div className="mt-4 mb-3">
                                <Label>Main d’œuvre (prix)</Label>
                                <Input
                                    value={data.main_oeuvre}
                                    onChange={(e) => setData('main_oeuvre', e.target.value)}
                                    className="w-full rounded border border-gray-300 px-3 py-2"
                                />
                            </div>

                            <div className="mb-3">
                                <Label>Kilométrage</Label>
                                <Input
                                    value={data.kilometrage}
                                    onChange={(e) => setData('kilometrage', e.target.value)}
                                    className="w-full rounded border border-gray-300 px-3 py-2"
                                />
                            </div>

                            <div className="mb-3">
                                <Label>Durée d’immobilisation (heure)</Label>
                                <Input
                                    type="number"
                                    value={data.duree_immobilisation}
                                    onChange={(e) => setData('duree_immobilisation', e.target.value)}
                                    className="w-full rounded border-gray-300 px-3 py-2"
                                />
                            </div>

                            <div className="mb-3">
                                <Label>Descrption</Label>
                                <Input
                                    type="text"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="w-full rounded border-gray-300 px-3 py-2"
                                />
                            </div>

                            <div className="m-4 flex justify-center gap-10">
                                <Button type="button" className="w-50" onClick={() => setShowInterventionForm(false)}>
                                    retour
                                </Button>
                                <Button className="w-50 bg-green-900 text-white hover:bg-green-950" disabled={processingPiece} type="submit">
                                    Valider
                                </Button>
                            </div>
                        </form>
                    </>
                )}
                {/* Section Liste des pièces */}
                <div className="mt-10">
                    <h2 className="mb-4 text-xl font-semibold">Liste des pièces ajoutées</h2>
                    {pieces.length === 0 ? (
                        <p className="text-gray-500 italic">Aucune pièce ajoutée pour le moment.</p>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {pieces.map((p) => (
                                <div key={p.id} className="rounded-xl p-4 shadow transition hover:shadow-md">
                                    <h3 className="text-sm font-bold">{p.nom}</h3>
                                    <p className="text-sm text-gray-600">Prix : {p.prix} Ar</p>
                                    <p className="text-sm text-gray-600">Quantité : {p.quantite}</p>
                                    {p.fournisseur && <p className="text-sm text-gray-500">Fournisseur : {p.fournisseur.nom}</p>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
