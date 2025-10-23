import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import { clsx } from 'clsx';
import { AlertCircle, CalendarCog, CalendarDays, Car, CheckCircle2, CircleAlert, FileText, User, Wrench } from 'lucide-react';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';
interface entretien {
    id: number;
    user_id: number;
    vehicule_id: number;
    probleme: string;
    description: string;
    statut: string;
    fournisseur_id: number;
    type: string;
    prochaine_visite: string;
    mecanicien_id: number;
}

interface intervention {
    id: number;
    entretien_id: number;
    piece_id: number;
    main_oeuvre: number;
    kilometrage: number;
    duree_immobilisation: string;
}
interface fournisseur {
    id: number;
    nom: string;
}
interface pieces {
    id: number;
    nom: string;
}
interface entretienValidated {
    id: number;
    type_entretien: string;
    date_prevue: string;
    user_id: number;
    entretien_id: number;
    vehicule_id: number;
    mecanicien_id: number;
}
type PropsShow = {
    entretien: entretien;
    fournisseur: fournisseur[];
    vehicule: { id: number; immatriculation: string }[];
    user: { id: number; name: string; role: string }[];
    pieces: pieces[];
    intervention: intervention[];
    entretienValidated: entretienValidated[];
};

export default function Index() {
    const { entretien, fournisseur, vehicule, user, pieces, userConnecter, intervention, entretienValidated } = usePage<PropsShow>().props;
    // console.log('user : ' + user.map((e) => e.role));
    const nom = user.find((u) => u.id === entretien.user_id);
    const immatricule = vehicule.find((v) => v.id === entretien.vehicule_id);
    console.log('entretienValidated : ' + entretienValidated.map((e) => e.date_prevue));
    const formatDatetimeLocal = (dateStr: string) => {
        if (!dateStr) return '';
        const dt = new Date(dateStr);
        const year = dt.getFullYear();
        const month = String(dt.getMonth() + 1).padStart(2, '0');
        const day = String(dt.getDate()).padStart(2, '0');
        const hours = String(dt.getHours() - 3).padStart(2, '0');
        const minutes = String(dt.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const [piece, setPiece] = useState('');
    const [existe, setExiste] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(false);
    //  console.log('Vérification de la pièce : 112 ' + piece);
    useEffect(() => {
        if (piece.trim().length === 0) {
            setExiste(null);
            return;
        }
        const timer = setTimeout(() => {
            const piece_id = pieces.find((p) => p.nom.toLowerCase() === piece.toLowerCase())?.id ?? '';
            data.piece_id = piece_id;
            console.log('Vérification de la pièce : ' + piece + ' id : ' + piece_id);
            setLoading(true);
            axios
                .get(route('pieces.check'), { params: { nom: piece } })
                .then((response) => {
                    setExiste(response.data.exists);
                })
                .finally(() => setLoading(false));
        }, 500);

        return () => clearTimeout(timer);
    }, [piece]);

    const [isOpen, setIsOpen] = useState(false);
    const { data, setData, processing, post, errors } = useForm({
        // validation des entretiens
        fournisseur_id: entretien.fournisseur_id ?? '',
        type: entretien.type ?? '',
        prochaine_visite: formatDatetimeLocal(entretien.prochaine_visite ?? ''),
        statut: entretien.statut ?? '',
        mecanicien_id: entretien.mecanicien_id ?? '',

        // Intervention
        piece_id: '',
        main_oeuvre: '',
        kilometrage: '',
        duree_immobilisation: '',
        entretien_id: entretien.id,
    });
    // console.log(data.prochaine_visite)
    // console.log('piece_id : ' + piece_id);

    const handleValide = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('entretiens.validate', entretien.id), {
            forceFormData: true,
            method: 'put',
            onSuccess: () => {
                console.log('Entretien validé : ');
                setIsOpen(false);
            },
        });
        // console.log(data);
    };

    const handleIntervention = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('interventions.store'), {
            forceFormData: true,
            method: 'post',
            onSuccess: () => {
                console.log('Intervention créée : ');
                setIsOpen(false);
            },
        });
        // console.log(data);
    };

    // const Voir = () => {
    //     fetch(route('entretiens.checkDate', entretien.id))
    //         .then((response) => response.json())
    //         .then((data) => {
    //             console.log("Statut de l'entretien :", data.statut);
    //         })
    //         .catch((err) => console.error(err));
    // };

    const isValide = entretien.statut === 'Validé';

    // console.log("entretien : " + entretien.id + "\nvehicule : " + entretien.vehicule_id );
    return (
        <>
            <AppLayout>
                <Head title="Afficher l'entretien poster" />
                {/* <button onClick={Voir} className="rounded bg-green-500 px-4 py-2 text-white">
                    Voir statut (console)
                </button> */}
                <div className="flex min-h-screen w-full items-center justify-center bg-gray-50">
                    <div className="w-full max-w-4xl px-6">
                        <Card className="w-full rounded-2xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:shadow-2xl">
                            <CardHeader className="flex items-center justify-between border-b pb-3">
                                <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                                    <Car className="h-5 w-5 text-blue-600" />
                                    {immatricule ? immatricule.immatriculation : '—'}
                                </CardTitle>
                                <span
                                    className={clsx(
                                        'rounded-full px-3 py-1 text-sm font-medium',
                                        isValide ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700',
                                    )}
                                >
                                    {entretien.statut}
                                </span>
                            </CardHeader>

                            <CardContent className="space-y-4 pt-6 text-gray-700">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-gray-500" />
                                        <span className="font-medium">Utilisateur :</span>
                                        <span>{nom ? nom.name : '—'}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4 text-gray-500" />
                                        <span className="font-medium">Problème :</span>
                                        <span>{entretien.probleme}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-gray-500" />
                                        <span className="font-medium">Type :</span>
                                        <span>{entretien.type}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <CalendarDays className="h-4 w-4 text-gray-500" />
                                        <span className="font-medium">Date :</span>
                                        <span>{entretien.prochaine_visite}</span>
                                    </div>

                                    <div className="flex items-start gap-2 md:col-span-2">
                                        <FileText className="mt-1 h-4 w-4 text-gray-500" />
                                        <div>
                                            <span className="font-medium">Description :</span>
                                            <p className="text-sm text-gray-600">{entretien.description}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-gray-500" />
                                        <span className="font-medium">Mécanicien :</span>
                                        <span>{user.filter((u) => u.id === entretien.mecanicien_id).map((u) => u.name)}</span>
                                    </div>
                                </div>

                                {(userConnecter === 'admin' || userConnecter === 'mecanicien') && (
                                    <div className="flex justify-end gap-3 pt-6">
                                        {userConnecter === 'admin' && (
                                            <Button onClick={() => setIsOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                                                <CalendarCog className="h-4 w-4" />
                                                Validation
                                            </Button>
                                        )}
                                        {userConnecter === 'mecanicien' && (
                                            <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
                                                <a
                                                    href={route('pieces.create', {
                                                        entretien_id: entretien.id,
                                                        vehicule_id: entretien.vehicule_id,
                                                    })}
                                                >
                                                    <Wrench className="h-4 w-4" />
                                                    Intervention
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {userConnecter === 'admin' ? (
                    <>
                        {isOpen && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black/40">
                                <div className="relative w-full max-w-md rounded-xl bg-cyan-700 p-6 shadow-lg">
                                    <form onSubmit={handleValide}>
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
                                        <Button
                                            onClick={() => setIsOpen(false)}
                                            className="absolute top-2 right-2 font-bold text-red-500 hover:text-red-600"
                                        >
                                            X
                                        </Button>

                                        <h2 className="mb-4 text-xl font-semibold text-white">Validation</h2>

                                        <div className="mb-3 text-white">
                                            <Label>Type d'entretien</Label>
                                            <select
                                                value={data.type}
                                                onChange={(e) => setData('type', e.target.value)}
                                                className="w-full rounded border border-gray-300 px-3 py-2"
                                            >
                                                <option>choisit le type d'entretien</option>
                                                <option value={'Préventif'} className="text-black">
                                                    Préventif
                                                </option>
                                                <option value={'Correctif'} className="text-black">
                                                    Correctif
                                                </option>
                                                <option value={'Légal'} className="text-black">
                                                    Légal
                                                </option>
                                            </select>
                                        </div>

                                        <div className="mb-3 text-white">
                                            <Label>Mécanicien</Label>
                                            <select
                                                value={data.mecanicien_id}
                                                onChange={(e) => setData('mecanicien_id', Number(e.target.value))}
                                                className="w-full rounded border border-gray-300 px-3 py-2"
                                            >
                                                <option className="text-black">choisit le mécanicien disponible</option>
                                                {user
                                                    .filter((u) => u.role === 'mecanicien')
                                                    .map((u) => (
                                                        <option key={u.id} value={u.id} className="text-black">
                                                            {u.name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>

                                        <div className="mb-3 text-white">
                                            <Label>Date prévue :</Label>
                                            <Input
                                                value={data.prochaine_visite}
                                                onChange={(e) => setData('prochaine_visite', e.target.value)}
                                                className="w-full border-white"
                                                type="datetime-local"
                                            />
                                        </div>
                                        <Input value={(data.statut = 'Validé')} onChange={(e) => setData('statut', e.target.value)} hidden={true} />
                                        <Button className="m-4 bg-green-900 text-white hover:bg-green-950" disabled={processing} type="submit">
                                            Valider
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        {isOpen && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black/40">
                                <div className="relative w-full max-w-md rounded-xl bg-gray-500 p-6 shadow-lg">
                                    <form onSubmit={handleIntervention}>
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
                                        <Button
                                            onClick={() => setIsOpen(false)}
                                            className="absolute top-2 right-2 font-bold text-red-500 hover:text-red-600"
                                        >
                                            X
                                        </Button>

                                        <h2 className="mb-4 text-xl font-semibold">Intervention</h2>

                                        <div className="flex items-end gap-2">
                                            <div className="flex-1">
                                                <Label>Pièce remplacée</Label>
                                                <Input
                                                    className="w-full rounded border border-gray-300 px-3 py-2"
                                                    placeholder="Ex: Filtre à huile"
                                                    value={piece}
                                                    onChange={(e) => setPiece(e.target.value)}
                                                />
                                            </div>

                                            {existe === false && (
                                                <Button disabled={loading} className="bg-green-600 hover:bg-green-700">
                                                    {loading ? 'Création...' : 'Créer'}
                                                </Button>
                                            )}

                                            {existe === true && <span className="mb-2 text-sm text-green-300">✔ </span>}
                                        </div>

                                        <div className="mb-3">
                                            <Label>Main d’œuvre (prix) :</Label>
                                            <Input
                                                value={data.main_oeuvre}
                                                onChange={(e) => setData('main_oeuvre', e.target.value)}
                                                className="w-full rounded border border-gray-300 px-3 py-2"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <Label>Kilométrage :</Label>
                                            <Input
                                                value={data.kilometrage}
                                                onChange={(e) => setData('kilometrage', e.target.value)}
                                                className="w-full rounded border border-gray-300 px-3 py-2"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <Label>Durée d’immobilisation (heure) :</Label>
                                            <Input
                                                value={data.duree_immobilisation}
                                                onChange={(e) => setData('duree_immobilisation', e.target.value)}
                                                className="w-full border-white"
                                                type="number"
                                            />
                                        </div>
                                        <Input value={(data.statut = 'En cours')} onChange={(e) => setData('statut', e.target.value)} hidden={true} />
                                        <Button className="m-4 bg-green-900 text-white hover:bg-green-950" disabled={processing} type="submit">
                                            Valider
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </AppLayout>
        </>
    );
}
