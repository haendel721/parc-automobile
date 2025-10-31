import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import { AlertCircle, CalendarCog, CalendarDays, Car, CheckCircle2, CircleAlert, FileText, User, Wrench, X } from 'lucide-react';
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
    userConnecter: string;
};

export default function Index() {
    const { entretien, fournisseur, vehicule, user, pieces, userConnecter, intervention, entretienValidated } = usePage<PropsShow>().props;

    const nom = user.find((u) => u.id === entretien.user_id);
    const immatricule = vehicule.find((v) => v.id === entretien.vehicule_id);
    const mecanicien = user.find((u) => u.id === entretien.mecanicien_id);

    const formatDatetimeLocal = (dateStr: string) => {
        if (!dateStr) return '';
        const dt = new Date(dateStr);
        const year = dt.getFullYear();
        const month = String(dt.getMonth() + 1).padStart(2, '0');
        const day = String(dt.getDate()).padStart(2, '0');
        const hours = String(dt.getHours()).padStart(2, '0');
        const minutes = String(dt.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const [piece, setPiece] = useState('');
    const [existe, setExiste] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [activeModal, setActiveModal] = useState<'validation' | 'intervention' | null>(null);

    useEffect(() => {
        if (piece.trim().length === 0) {
            setExiste(null);
            return;
        }
        const timer = setTimeout(() => {
            const piece_id = pieces.find((p) => p.nom.toLowerCase() === piece.toLowerCase())?.id ?? '';
            data.piece_id = piece_id;
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

    const { data, setData, processing, post, errors } = useForm({
        fournisseur_id: entretien.fournisseur_id ?? '',
        type: entretien.type ?? '',
        prochaine_visite: formatDatetimeLocal(entretien.prochaine_visite ?? ''),
        statut: entretien.statut ?? '',
        mecanicien_id: entretien.mecanicien_id ?? '',
        piece_id: '',
        main_oeuvre: '',
        kilometrage: '',
        duree_immobilisation: '',
        entretien_id: entretien.id,
    });

    const handleValide = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('entretiens.validate', entretien.id), {
            forceFormData: true,
            method: 'put',
            onSuccess: () => {
                setIsOpen(false);
                setActiveModal(null);
            },
        });
    };

    const handleIntervention = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('interventions.store'), {
            forceFormData: true,
            method: 'post',
            onSuccess: () => {
                setIsOpen(false);
                setActiveModal(null);
            },
        });
    };

    const openModal = (modalType: 'validation' | 'intervention') => {
        setActiveModal(modalType);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setActiveModal(null);
    };

    const getStatusVariant = (statut: string) => {
        switch (statut) {
            case 'Validé':
                return 'default';
            case 'En cours':
                return 'secondary';
            case 'En attente':
                return 'outline';
            default:
                return 'outline';
        }
    };

    const getStatusColor = (statut: string) => {
        switch (statut) {
            case 'Validé':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'En cours':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'En attente':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <AppLayout>
            <Head title={`Entretien - ${immatricule?.immatriculation || 'Véhicule'}`} />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
                <div className="container mx-auto p-4">
                    {/* Header */}
                    {/* <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">Détails de l'Entretien</h1>
                        <p className="text-slate-600">Gestion et suivi des interventions véhicule</p>
                    </div> */}
                    
                    <div className="grid grid-cols-1 gap-8">
                        {/* Main Card */}
                        <div className="lg:col-span-2">
                            <Card className="w-full overflow-hidden rounded-2xl border-0 bg-white shadow-xl">
                                <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-200 pb-6 text-white">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-lg bg-white/20 p-2">
                                                <Car className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-2xl font-bold">{immatricule?.immatriculation || '—'}</CardTitle>
                                                <p className="mt-1 text-sm text-blue-100">Suivi d'entretien véhicule</p>
                                            </div>
                                        </div>
                                        <Badge
                                            variant={getStatusVariant(entretien.statut)}
                                            className={`px-3 py-1 text-sm font-semibold ${getStatusColor(entretien.statut)}`}
                                        >
                                            {entretien.statut}
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-6">
                                    {/* Informations Grid */}
                                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                                                <User className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                                                <div>
                                                    <p className="text-sm font-medium text-slate-600">Demandeur</p>
                                                    <p className="font-semibold text-slate-800">{nom?.name || '—'}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                                                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-600" />
                                                <div>
                                                    <p className="text-sm font-medium text-slate-600">Problème signalé</p>
                                                    <p className="font-semibold text-slate-800">{entretien.probleme}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                                                <FileText className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-600" />
                                                <div>
                                                    <p className="text-sm font-medium text-slate-600">Type d'entretien</p>
                                                    <p className="font-semibold text-slate-800">{entretien.type || 'Non spécifié'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                                                <CalendarDays className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                                                <div>
                                                    <p className="text-sm font-medium text-slate-600">Date prévue</p>
                                                    <p className="font-semibold text-slate-800">{formatDate(entretien.prochaine_visite)}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                                                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                                                <div>
                                                    <p className="text-sm font-medium text-slate-600">Mécanicien assigné</p>
                                                    <p className="font-semibold text-slate-800">{mecanicien?.name || 'Non assigné'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="mb-8">
                                        <h3 className="mb-3 text-lg font-semibold text-slate-800">Description</h3>
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                            <p className="leading-relaxed text-slate-700">{entretien.description || 'Aucune description fournie.'}</p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    {(userConnecter === 'admin' || userConnecter === 'mecanicien') && (
                                        <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row">
                                            {userConnecter === 'admin' && (
                                                <Button
                                                    onClick={() => openModal('validation')}
                                                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-white shadow-lg transition-all duration-200 hover:bg-blue-700 hover:shadow-xl"
                                                >
                                                    <CalendarCog className="h-4 w-4" />
                                                    Valider l'Entretien
                                                </Button>
                                            )}
                                            {userConnecter === 'mecanicien' && (
                                                <Button
                                                    onClick={() => openModal('intervention')}
                                                    className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-white shadow-lg transition-all duration-200 hover:bg-emerald-700 hover:shadow-xl"
                                                >
                                                    <Wrench className="h-4 w-4" />
                                                    Intervenir
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="relative w-full max-w-md animate-in fade-in-90 zoom-in-95">
                        <div className="overflow-hidden rounded-2xl border-0 bg-white shadow-2xl">
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold">
                                        {activeModal === 'validation' ? 'Validation Entretien' : 'Nouvelle Intervention'}
                                    </h3>
                                    <Button
                                        onClick={closeModal}
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-lg text-white hover:bg-white/20"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="max-h-[70vh] overflow-y-auto p-6">
                                {Object.keys(errors).length > 0 && (
                                    <Alert variant="destructive" className="mb-4">
                                        <CircleAlert className="h-4 w-4" />
                                        <AlertTitle>Erreur de validation</AlertTitle>
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

                                {activeModal === 'validation' ? (
                                    <form onSubmit={handleValide} className="space-y-4">
                                        <div>
                                            <Label htmlFor="type" className="mb-2 block text-sm font-medium text-slate-700">
                                                Type d'entretien
                                            </Label>
                                            <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Choisir le type d'entretien" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Préventif">Préventif</SelectItem>
                                                    <SelectItem value="Correctif">Correctif</SelectItem>
                                                    <SelectItem value="Légal">Légal</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="mecanicien_id" className="mb-2 block text-sm font-medium text-slate-700">
                                                Mécanicien
                                            </Label>
                                            <Select
                                                value={data.mecanicien_id.toString()}
                                                onValueChange={(value) => setData('mecanicien_id', Number(value))}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Choisir le mécanicien" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {user
                                                        .filter((u) => u.role === 'mecanicien')
                                                        .map((u) => (
                                                            <SelectItem key={u.id} value={u.id.toString()}>
                                                                {u.name}
                                                            </SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="prochaine_visite" className="mb-2 block text-sm font-medium text-slate-700">
                                                Date prévue
                                            </Label>
                                            <Input
                                                id="prochaine_visite"
                                                value={data.prochaine_visite}
                                                onChange={(e) => setData('prochaine_visite', e.target.value)}
                                                type="datetime-local"
                                                className="w-full"
                                            />
                                        </div>

                                        {/* <Input value="Validé" onChange={(e) => setData('statut', e.target.value)} hidden /> */}
                                        <Input value={(data.statut = 'Validé')} onChange={(e) => setData('statut', e.target.value)} hidden={true} />
                                        <div className="flex gap-3 pt-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={closeModal}
                                                className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50"
                                            >
                                                Annuler
                                            </Button>
                                            <Button type="submit" disabled={processing} className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
                                                {processing ? 'Validation...' : 'Valider'}
                                            </Button>
                                        </div>
                                    </form>
                                ) : (
                                    <form onSubmit={handleIntervention} className="space-y-4">
                                        <div>
                                            <Label htmlFor="piece" className="mb-2 block text-sm font-medium text-slate-700">
                                                Pièce remplacée
                                            </Label>
                                            <div className="flex gap-2">
                                                <div className="flex-1">
                                                    <Input
                                                        id="piece"
                                                        placeholder="Ex: Filtre à huile"
                                                        value={piece}
                                                        onChange={(e) => setPiece(e.target.value)}
                                                        className="w-full"
                                                    />
                                                </div>
                                                {existe === false && (
                                                    <Button
                                                        type="button"
                                                        disabled={loading}
                                                        className="bg-emerald-600 text-white hover:bg-emerald-700"
                                                    >
                                                        {loading ? '...' : 'Créer'}
                                                    </Button>
                                                )}
                                                {existe === true && (
                                                    <div className="flex items-center px-3 text-emerald-600">
                                                        <CheckCircle2 className="h-5 w-5" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="main_oeuvre" className="mb-2 block text-sm font-medium text-slate-700">
                                                Main d'œuvre (€)
                                            </Label>
                                            <Input
                                                id="main_oeuvre"
                                                type="number"
                                                placeholder="0.00"
                                                value={data.main_oeuvre}
                                                onChange={(e) => setData('main_oeuvre', e.target.value)}
                                                className="w-full"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="kilometrage" className="mb-2 block text-sm font-medium text-slate-700">
                                                Kilométrage
                                            </Label>
                                            <Input
                                                id="kilometrage"
                                                type="number"
                                                placeholder="0"
                                                value={data.kilometrage}
                                                onChange={(e) => setData('kilometrage', e.target.value)}
                                                className="w-full"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="duree_immobilisation" className="mb-2 block text-sm font-medium text-slate-700">
                                                Durée d'immobilisation (heures)
                                            </Label>
                                            <Input
                                                id="duree_immobilisation"
                                                type="number"
                                                placeholder="0"
                                                value={data.duree_immobilisation}
                                                onChange={(e) => setData('duree_immobilisation', e.target.value)}
                                                className="w-full"
                                            />
                                        </div>

                                        {/* <Input value="En cours" onChange={(e) => setData('statut', e.target.value)} hidden /> */}
                                        <Input value={(data.statut = 'En cours')} onChange={(e) => setData('statut', e.target.value)} hidden={true} />
                                        <div className="flex gap-3 pt-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={closeModal}
                                                className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50"
                                            >
                                                Annuler
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700"
                                            >
                                                {processing ? 'Création...' : 'Créer Intervention'}
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
