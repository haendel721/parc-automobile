import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import { AlertCircle, CalendarCog, CalendarDays, Car, CheckCircle2, CircleAlert, FileText, User, Wrench, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Accueil',
        href: '/dashboard',
    },
    {
        title: 'entretien',
        href: '/entretiens',
    },
    {
        title: 'affichage d\'un entretien spécifié',
        href: '/entretiens/show',
    },
];

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
        const hours = String(dt.getHours() - 3).padStart(2, '00');
        const minutes = String(dt.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '—';

        const date = new Date(dateStr);
        date.setHours(date.getHours() - 3);

        return date.toLocaleDateString('fr-FR', {
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
                return 'bg-green-900/40 text-green-300 border-green-800/50';
            case 'En cours':
                return 'bg-blue-900/40 text-blue-300 border-blue-800/50';
            case 'En attente':
                return 'bg-yellow-900/40 text-yellow-300 border-yellow-800/50';
            default:
                return 'bg-gray-700 text-gray-300 border-gray-600';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Entretien - ${immatricule?.immatriculation || 'Véhicule'}`} />

            <div className="min-h-screen py-8">
                <div className="container mx-auto p-4">
                    <div className="grid grid-cols-1 gap-8">
                        {/* Main Card */}
                        <div className="lg:col-span-2">
                            <Card className="w-full overflow-hidden rounded-2xl border border-gray-700 bg-gray-800/90 backdrop-blur-sm shadow-2xl">
                                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 pb-6">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-lg bg-white/20 p-2">
                                                <Car className="h-6 w-6 text-white" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-2xl font-bold text-white">{immatricule?.immatriculation || '—'}</CardTitle>
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
                                            <div className="flex items-start gap-3 rounded-xl bg-gray-700/50 p-4 border border-gray-600">
                                                <User className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-400" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-400">Demandeur</p>
                                                    <p className="font-semibold text-white">{nom?.name || '—'}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 rounded-xl bg-gray-700/50 p-4 border border-gray-600">
                                                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-400" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-400">Problème signalé</p>
                                                    <p className="font-semibold text-white">{entretien.probleme}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 rounded-xl bg-gray-700/50 p-4 border border-gray-600">
                                                <FileText className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-400" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-400">Type d'entretien</p>
                                                    <p className="font-semibold text-white">{entretien.type || 'Non spécifié'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3 rounded-xl bg-gray-700/50 p-4 border border-gray-600">
                                                <CalendarDays className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-400">Date prévue</p>
                                                    <p className="font-semibold text-white">{formatDate(entretien.prochaine_visite)}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 rounded-xl bg-gray-700/50 p-4 border border-gray-600">
                                                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-400">Mécanicien assigné</p>
                                                    <p className="font-semibold text-white">{mecanicien?.name || 'Non assigné'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="mb-8">
                                        <h3 className="mb-3 text-lg font-semibold text-white">Description</h3>
                                        <div className="rounded-xl border border-gray-600 bg-gray-700/50 p-4">
                                            <p className="leading-relaxed text-gray-300">{entretien.description || 'Aucune description fournie.'}</p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    {(userConnecter === 'admin' || userConnecter === 'mecanicien') && (
                                        <div className="flex flex-col gap-3 border-t border-gray-700 pt-4 sm:flex-row">
                                            {userConnecter === 'admin' && (
                                                entretien.statut === "Validé" 
                                                ? '' 
                                                : entretien.statut === "Terminé" 
                                                ? ''
                                                :<Button
                                                    onClick={() => openModal('validation')}
                                                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-white shadow-lg transition-all duration-200 hover:bg-blue-700 hover:shadow-xl"
                                                >
                                                    <CalendarCog className="h-4 w-4" />
                                                    Valider l'Entretien
                                                </Button>
                                            )}
                                            {userConnecter === 'mecanicien' && (
                                                <Link href={route('pieces.create' , {entretien_id: entretien.id, vehicule_id: entretien.vehicule_id })}>
                                                    <Button className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-white shadow-lg transition-all duration-200 hover:bg-emerald-700 hover:shadow-xl">
                                                        <Wrench className="h-4 w-4" />
                                                        Intervenir
                                                    </Button>
                                                </Link>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div className="relative w-full max-w-md animate-in fade-in-90 zoom-in-95">
                        <div className="overflow-hidden rounded-2xl border border-gray-600 bg-gray-800 shadow-2xl">
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold text-white">
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
                                    <Alert variant="destructive" className="mb-4 border-red-800 bg-red-900/20 text-red-200">
                                        <CircleAlert className="h-4 w-4" />
                                        <AlertTitle className="text-red-100">Erreur de validation</AlertTitle>
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
                                            <Label htmlFor="type" className="mb-2 block text-sm font-medium text-gray-300">
                                                Type d'entretien
                                            </Label>
                                            <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                                                <SelectTrigger className="w-full border-gray-600 bg-gray-700 text-white">
                                                    <SelectValue placeholder="Choisir le type d'entretien" />
                                                </SelectTrigger>
                                                <SelectContent className="border-gray-600 bg-gray-700 text-white">
                                                    <SelectItem value="Préventif">Préventif</SelectItem>
                                                    <SelectItem value="Correctif">Correctif</SelectItem>
                                                    <SelectItem value="Légal">Légal</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="mecanicien_id" className="mb-2 block text-sm font-medium text-gray-300">
                                                Mécanicien
                                            </Label>
                                            <Select
                                                value={data.mecanicien_id.toString()}
                                                onValueChange={(value) => setData('mecanicien_id', Number(value))}
                                            >
                                                <SelectTrigger className="w-full border-gray-600 bg-gray-700 text-white">
                                                    <SelectValue placeholder="Choisir le mécanicien" />
                                                </SelectTrigger>
                                                <SelectContent className="border-gray-600 bg-gray-700 text-white">
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
                                            <Label htmlFor="prochaine_visite" className="mb-2 block text-sm font-medium text-gray-300">
                                                Date prévue
                                            </Label>
                                            <Input
                                                id="prochaine_visite"
                                                value={data.prochaine_visite}
                                                onChange={(e) => setData('prochaine_visite', e.target.value)}
                                                type="datetime-local"
                                                className="w-full border-gray-600 bg-gray-700 text-white"
                                            />
                                        </div>

                                        <Input value={(data.statut = 'Validé')} onChange={(e) => setData('statut', e.target.value)} hidden={true} />
                                        <div className="flex gap-3 pt-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={closeModal}
                                                className="flex-1 border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
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
                                            <Label htmlFor="piece" className="mb-2 block text-sm font-medium text-gray-300">
                                                Pièce remplacée
                                            </Label>
                                            <div className="flex gap-2">
                                                <div className="flex-1">
                                                    <Input
                                                        id="piece"
                                                        placeholder="Ex: Filtre à huile"
                                                        value={piece}
                                                        onChange={(e) => setPiece(e.target.value)}
                                                        className="w-full border-gray-600 bg-gray-700 text-white placeholder:text-gray-400"
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
                                                    <div className="flex items-center px-3 text-emerald-400">
                                                        <CheckCircle2 className="h-5 w-5" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="main_oeuvre" className="mb-2 block text-sm font-medium text-gray-300">
                                                Main d'œuvre (€)
                                            </Label>
                                            <Input
                                                id="main_oeuvre"
                                                type="number"
                                                placeholder="0.00"
                                                value={data.main_oeuvre}
                                                onChange={(e) => setData('main_oeuvre', e.target.value)}
                                                className="w-full border-gray-600 bg-gray-700 text-white placeholder:text-gray-400"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="kilometrage" className="mb-2 block text-sm font-medium text-gray-300">
                                                Kilométrage
                                            </Label>
                                            <Input
                                                id="kilometrage"
                                                type="number"
                                                placeholder="0"
                                                value={data.kilometrage}
                                                onChange={(e) => setData('kilometrage', e.target.value)}
                                                className="w-full border-gray-600 bg-gray-700 text-white placeholder:text-gray-400"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="duree_immobilisation" className="mb-2 block text-sm font-medium text-gray-300">
                                                Durée d'immobilisation (heures)
                                            </Label>
                                            <Input
                                                id="duree_immobilisation"
                                                type="number"
                                                placeholder="0"
                                                value={data.duree_immobilisation}
                                                onChange={(e) => setData('duree_immobilisation', e.target.value)}
                                                className="w-full border-gray-600 bg-gray-700 text-white placeholder:text-gray-400"
                                            />
                                        </div>

                                        <Input value={(data.statut = 'En cours')} onChange={(e) => setData('statut', e.target.value)} hidden={true} />
                                        <div className="flex gap-3 pt-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={closeModal}
                                                className="flex-1 border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
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