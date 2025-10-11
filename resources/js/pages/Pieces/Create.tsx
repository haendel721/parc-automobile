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
type PieceProps = {
    fournisseurs: [];
    entretien_id: number;
    vehicule_id: number;
    pieces: Piece[];
};
export default function Create() {
    const { fournisseurs = [], entretien_id, vehicule_id, pieces = [] } = usePage<PieceProps>().props; // données envoyées depuis Laravel
    const { data, setData, post, processing, errors } = useForm({
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
    const [showInterventionForm, setShowInterventionForm] = useState(false);
    // const [piece, setPiece] = useState('');
    // console.log("entretien : " + entretien_id);
    // console.log("vehicule : " + vehicule_id);
    const handleSubmitPiece = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('pieces.store'));
        data.nom = '';
        data.prix = '';
        data.quantite = '';
        data.fournisseur_id = '';
        console.log(data);
    };
    // --- Soumission du formulaire intervention ---
    const handleIntervention = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('interventions.store'));
        console.log('Intervention enregistrée : ', data);
        // tu peux ajouter un `post(route('interventions.store'), data)` ici
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Créer un nouveaux piece" />
            <div className="w-8/12 p-4 flex justify-center gap-10 m-5">
                {!showInterventionForm ? (
                    <>
                        {/* -------- FORMULAIRE AJOUT PIECE -------- */}
                        <form onSubmit={handleSubmitPiece} className="relative rounded-xl p-6 shadow-lg" encType="multipart/form-data">
                            {/* display errors */}

                            {Object.keys(errors).length > 0 && (
                                <Alert>
                                    <CircleAlert />
                                    <AlertTitle>Errors !</AlertTitle>
                                    <AlertDescription>
                                        <ul>
                                            {Object.entries(errors).map(([key, message]) => (
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
                                <select
                                    value={data.fournisseur_id}
                                    onChange={(e) => setData('fournisseur_id', e.target.value)}
                                    className="w-full rounded border border-gray-300 px-3 py-2"
                                >
                                    <option value="">--Choisir un fournisseur--</option>
                                    {fournisseurs.map((f: any) => (
                                        <option key={f.id} value={f.id} className="bg-white text-black">
                                            {f.nom}
                                        </option>
                                    ))}
                                </select>
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
                                <Button disabled={processing} className="w-50" type="submit">
                                    Ajouter
                                </Button>
                                <Button type="button" className="w-50" onClick={() => setShowInterventionForm(true)}>
                                    Suivant
                                </Button>
                            </div>
                        </form>
                    </>
                ) : (
                    <>
                        {/* -------- FORMULAIRE INTERVENTION -------- */}
                        <form onSubmit={handleIntervention} className="relative rounded-xl p-6 shadow-lg">
                            {Object.keys(errors).length > 0 && (
                                <Alert>
                                    <CircleAlert />
                                    <AlertTitle>Erreur !</AlertTitle>
                                    <AlertDescription>
                                        <ul>
                                            {Object.entries(errors).map(([key, message]) => (
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
                                <Button className="w-50 bg-green-900 text-white hover:bg-green-950" disabled={processing} type="submit">
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
