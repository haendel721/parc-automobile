import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { BellDot, CirclePlus, Trash2, Car, User, Calendar, Fuel, DollarSign, MapPin, Filter, Search, X } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Accueil',
        href: '/dashboard',
    },
    {
        title: 'Plein Carburant',
        href: '/pleinCarburants',
    },
];

type pleinCarburant = {
    id: number;
    vehicule_id: number;
    user_id: number;
    date_plein: string;
    quantite: number;
    prix_unitaire: number;
    montant_total: number;
    station: string;
};

type Vehicules = {
    id: number;
    immatriculation: string;
    marque_id: number;
    modele: string;
    typeVehicule_id: number;
    couleur: string;
    carburant_id: number;
    numSerie: string;
    anneeFabrication: number;
    dateAcquisition: string;
    photo: string;
    user_id: number;
    kilometrique: number;
};

type PageProps = {
    flash: {
        message?: string;
    };
    pleinCarburant: pleinCarburant[];
    user: {
        id: number;
        role: string;
        name: string;
    };
    T_user: {
        id: number;
        role: string;
        name: string;
    }[];
    vehicules: Vehicules[];
    montantTotal: { vehicule_id: number; totalMontant: number }[];
    Quantite: { vehicule_id: number; Quantite: number }[];
};

export default function Index() {
    const { user, pleinCarburant, flash, vehicules, T_user, montantTotal, Quantite } = usePage<PageProps>().props;
    const { processing, delete: destroy } = useForm();
    
    const handleDelete = (id: number) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer ce plein ?`)) {
            destroy(route('pleinCarburant.destroy', id));
        }
    };

    // États pour la recherche
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState<'utilisateur' | 'immatriculation' | 'station' | 'quantite' | 'montant' | 'date'>('immatriculation');
    const [searchTermTotal, setSearchTermTotal] = useState('');
    const [quantityOperator, setQuantityOperator] = useState<'>' | '<'>('>');
    const [quantityValue, setQuantityValue] = useState<number | ''>('');
    const [weekStart, setWeekStart] = useState<string>('');
    const [weekEnd, setWeekEnd] = useState<string>('');

    // Filtrage des données
    const filteredPleinCarburant = pleinCarburant.filter((pc) => {
        const pcDate = new Date(pc.date_plein);

        let matchesWeek = true;
        if (weekStart && weekEnd) {
            const start = new Date(weekStart);
            const end = new Date(weekEnd);
            matchesWeek = pcDate >= start && pcDate <= end;
        }

        const search = searchTerm.toLowerCase().trim();
        let matchesSearch = true;
        
        if (searchField === 'station') {
            matchesSearch = pc.station.toLowerCase().includes(search);
        } else if (searchField === 'immatriculation') {
            matchesSearch = vehicules.some((v) => v.id === pc.vehicule_id && v.immatriculation.toLowerCase().includes(search));
        } else if (searchField === 'utilisateur') {
            matchesSearch = T_user.some((u) => u.id === pc.user_id && u.name.toLowerCase().includes(search));
        } else if (searchField === 'quantite') {
            if (quantityValue !== '') {
                matchesSearch = quantityOperator === '>' ? pc.quantite > quantityValue : pc.quantite < quantityValue;
            }
        } else if (searchField === 'montant') {
            if (quantityValue !== '') {
                matchesSearch = quantityOperator === '>' ? pc.montant_total > quantityValue : pc.montant_total < quantityValue;
            }
        }

        return matchesWeek && matchesSearch;
    });

    const filteredVehicules = vehicules.filter((v) => {
        return v.immatriculation.toLowerCase().includes(searchTermTotal.toLowerCase());
    });

    // Fonction pour formater la date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Obtenir le nom de l'utilisateur
    const getUserName = (userId: number) => {
        const user = T_user.find(u => u.id === userId);
        return user ? user.name : 'Inconnu';
    };

    // Obtenir l'immatriculation du véhicule
    const getVehicleImmatriculation = (vehicleId: number) => {
        const vehicle = vehicules.find(v => v.id === vehicleId);
        return vehicle ? vehicle.immatriculation : 'Inconnu';
    };

    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Plein Carburant" />
                
                {/* Notification Flash */}
                <div className="p-4">
                    {flash.message && (
                        <Alert className="bg-blue-900/20 border-blue-800 text-blue-200">
                            <BellDot className="text-blue-300" />
                            <AlertTitle className="text-blue-100">Notification !</AlertTitle>
                            <AlertDescription>{flash.message}</AlertDescription>
                        </Alert>
                    )}
                </div>

                <div className="p-4 space-y-8">
                    {/* SECTION STATISTIQUES VÉHICULES */}
                    <section>
                        <div className="mb-6">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Consommation de carburant</h2>
                                    <p className="text-gray-400">Vue d'ensemble des dépenses par véhicule</p>
                                </div>
                                
                                {/* Barre de recherche */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="relative flex-1 min-w-[250px]">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Rechercher par immatriculation..."
                                            value={searchTermTotal}
                                            onChange={(e) => setSearchTermTotal(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Grille des véhicules */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredVehicules.length > 0 ? (
                                filteredVehicules.map((vehicle) => {
                                    const totalMontant = montantTotal.find(mt => mt.vehicule_id === vehicle.id)?.totalMontant || 0;
                                    const totalQuantite = Quantite.find(q => q.vehicule_id === vehicle.id)?.Quantite || 0;
                                    
                                    return (
                                        <Card key={vehicle.id} className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-all duration-200">
                                            <CardHeader className="pb-3">
                                                <div className="flex items-center justify-between">
                                                    <CardTitle className="text-white text-lg flex items-center gap-2">
                                                        <Car className="h-5 w-5 text-blue-400" />
                                                        {vehicle.immatriculation}
                                                    </CardTitle>
                                                    <Badge variant="secondary" className="bg-blue-900/20 text-blue-300">
                                                        {vehicle.modele}
                                                    </Badge>
                                                </div>
                                                <CardDescription className="text-gray-400">
                                                    {getUserName(vehicle.user_id)}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-400 flex items-center gap-2">
                                                        <Fuel className="h-4 w-4" />
                                                        Quantité totale
                                                    </span>
                                                    <span className="text-white font-semibold">
                                                        {totalQuantite} L
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-400 flex items-center gap-2">
                                                        <DollarSign className="h-4 w-4" />
                                                        Montant total
                                                    </span>
                                                    <span className="text-green-400 font-semibold">
                                                        {totalMontant.toLocaleString('fr-FR')} Ar
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })
                            ) : (
                                <div className="col-span-full text-center py-12">
                                    <div className="flex flex-col items-center justify-center gap-3 text-gray-400">
                                        <Car className="h-16 w-16 text-gray-600" />
                                        <p className="text-lg font-medium">Aucun véhicule trouvé</p>
                                        <p className="text-sm">Aucun résultat ne correspond à votre recherche</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* SECTION HISTORIQUE DES PLEINS */}
                    <section>
                        <div className="mb-6">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Historique des pleins</h2>
                                    <p className="text-gray-400">Détail de tous les pleins de carburant effectués</p>
                                </div>
                                
                                <div className="flex flex-col sm:flex-row gap-3">
                                    {/* Sélecteur de champ */}
                                    <select
                                        value={searchField}
                                        onChange={(e) => setSearchField(e.target.value as any)}
                                        className="px-4 py-2 rounded-xl border border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    >
                                        <option value="immatriculation">Immatriculation</option>
                                        <option value="utilisateur">Utilisateur</option>
                                        <option value="station">Station</option>
                                        <option value="quantite">Quantité</option>
                                        <option value="montant">Montant</option>
                                        <option value="date">Date</option>
                                    </select>

                                    {/* Champ de recherche dynamique */}
                                    <div className="flex gap-2">
                                        {searchField === 'quantite' || searchField === 'montant' ? (
                                            <div className="flex gap-2">
                                                <select
                                                    value={quantityOperator}
                                                    onChange={(e) => setQuantityOperator(e.target.value as any)}
                                                    className="px-3 py-2 rounded-xl border border-gray-600 bg-gray-700 text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                                >
                                                    <option value=">">Supérieur à</option>
                                                    <option value="<">Inférieur à</option>
                                                </select>
                                                <input
                                                    type="number"
                                                    placeholder="Valeur"
                                                    value={quantityValue}
                                                    onChange={(e) => setQuantityValue(Number(e.target.value))}
                                                    className="px-3 py-2 rounded-xl border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                />
                                            </div>
                                        ) : searchField === 'date' ? (
                                            <div className="flex gap-2">
                                                <input
                                                    type="date"
                                                    value={weekStart}
                                                    onChange={(e) => setWeekStart(e.target.value)}
                                                    className="px-3 py-2 rounded-xl border border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                />
                                                <span className="flex items-center text-gray-400">à</span>
                                                <input
                                                    type="date"
                                                    value={weekEnd}
                                                    onChange={(e) => setWeekEnd(e.target.value)}
                                                    className="px-3 py-2 rounded-xl border border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                />
                                            </div>
                                        ) : (
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    placeholder={`Rechercher par ${searchField}...`}
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="pl-10 pr-4 py-2 rounded-xl border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                />
                                            </div>
                                        )}
                                        
                                        <Link href={route('pleinCarburant.create')}>
                                            <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                                                <CirclePlus className="h-4 w-4" />
                                                Nouveau plein
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Grille des pleins de carburant */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredPleinCarburant.length > 0 ? (
                                filteredPleinCarburant.map((pc) => (
                                    <Card key={pc.id} className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-all duration-200 group">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-white text-lg flex items-center gap-2">
                                                    <Fuel className="h-5 w-5 text-green-400" />
                                                    Plein #{pc.id}
                                                </CardTitle>
                                                <Badge variant="outline" className="bg-gray-700 text-gray-300">
                                                    {formatDate(pc.date_plein)}
                                                </Badge>
                                            </div>
                                            <CardDescription className="text-gray-400 flex items-center gap-2">
                                                <Car className="h-4 w-4" />
                                                {getVehicleImmatriculation(pc.vehicule_id)}
                                            </CardDescription>
                                        </CardHeader>
                                        
                                        <CardContent className="space-y-4">
                                            {/* Informations principales */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <p className="text-sm text-gray-400 flex items-center gap-2">
                                                        <User className="h-3 w-3" />
                                                        Conducteur
                                                    </p>
                                                    <p className="text-white font-medium">{getUserName(pc.user_id)}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm text-gray-400 flex items-center gap-2">
                                                        <MapPin className="h-3 w-3" />
                                                        Station
                                                    </p>
                                                    <p className="text-white font-medium">{pc.station}</p>
                                                </div>
                                            </div>

                                            {/* Détails du plein */}
                                            <div className="bg-gray-700/50 rounded-lg p-3 space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-400 text-sm">Quantité</span>
                                                    <span className="text-white font-semibold">{pc.quantite} L</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-400 text-sm">Prix unitaire</span>
                                                    <span className="text-white font-semibold">{pc.prix_unitaire} Ar/L</span>
                                                </div>
                                                <div className="flex justify-between items-center pt-2 border-t border-gray-600">
                                                    <span className="text-gray-400 font-medium">Total</span>
                                                    <span className="text-green-400 font-bold text-lg">
                                                        {pc.montant_total.toLocaleString('fr-FR')} Ar
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex justify-end pt-2">
                                                <Button
                                                    disabled={processing}
                                                    onClick={() => handleDelete(pc.id)}
                                                    className="bg-red-600 hover:bg-red-700 text-white"
                                                    size="sm"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12">
                                    <div className="flex flex-col items-center justify-center gap-3 text-gray-400">
                                        <Fuel className="h-16 w-16 text-gray-600" />
                                        <p className="text-lg font-medium">Aucun plein trouvé</p>
                                        <p className="text-sm">Aucun résultat ne correspond à votre recherche</p>
                                        <Link href={route('pleinCarburant.create')}>
                                            <Button className="bg-blue-600 hover:bg-blue-700 text-white mt-4">
                                                <CirclePlus className="h-4 w-4 mr-2" />
                                                Ajouter le premier plein
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </AppLayout>
        </>
    );
}