import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import PleinCarburantCharts from '@/pages/PleinCarburants/PleinCarburantCharts';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import { AlertTriangleIcon, Car, ChevronLeft, ChevronRight, Eye, Search, Settings, Shield, ShieldOffIcon, SquarePen, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { route } from 'ziggy-js';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tableau de bord',
        href: dashboard().url,
    },
];

interface users {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface vehicules {
    id: number;
    marque_id: number;
    model: string;
    couleur: string;
    photo: string;
    user_id: number;
    typeVehicule_id: number;
    immatriculation: string;
    kilometrique: number;
    carburant_id: number;
}

interface marques {
    id: number;
    nom: string;
}

interface typeVehicule {
    id: number;
    nom: string;
}

interface entretiens {
    id: number;
    user_id: number;
    type: string;
    statut: string;
    vehicule?: vehicules;
    vehicule_id: number;
    prochaine_visite: string;
}

interface assurances {
    id: number;
    assurance_id: number;
    NomCompagnie: string;
    vehicule_id: number;
    NumContrat: string;
    user_id: number;
    cout: number;
    dateDebut: string;
    dateFin: string;
    duree_jours: number;
    jour_restant: number;
}

interface DepenseData {
    mois: string;
    [key: string]: number | string;
}

type Props = {
    users: users;
    vehicules: vehicules[];
    entretiens: entretiens[];
    assurances: assurances[];
    marques: marques[];
    userConnecter: { id: number; role: string };
    typeVehicule: typeVehicule[];
    carburant: { id: number; type: string }[];
};

export default function Dashboard() {
    const { entretiens, vehicules, users, assurances, userConnecter, marques, typeVehicule, carburant } = usePage<Props>().props;
    const vehiculeConnecter = vehicules.filter((v) => v.user_id === userConnecter.id);
    const assuranceConnecter = assurances.filter((a) => a.user_id === userConnecter.id);
    const entretiensConnecter = entretiens.filter((e) => e.user_id === userConnecter.id);
    // console.log(
    //     'vehiculeConnecter',
    //     vehicules.map((v) => v.user_id),
    // );
    const vehiculesAvecMarque = vehiculeConnecter.map((v) => {
        const marque = marques.find((m) => m.id === v.marque_id);
        return {
            ...v,
            marqueNom: marque ? marque.nom : 'Marque inconnue',
        };
    });

    const [current, setCurrent] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState<'model' | 'immatriculation' | 'marque' | 'carburant' | 'type'>('immatriculation');
    const [data, setData] = useState<DepenseData[]>([]);
    const [vehiculeKeys, setVehiculeKeys] = useState<string[]>([]);
    const [dataAssurance, setDataAssurance] = useState<{ statut: string; count: number }[]>([]);

    // Navigation du carousel
    const nextSlide = () => {
        setCurrent((prev) => (prev === vehiculeConnecter.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrent((prev) => (prev === 0 ? vehiculeConnecter.length - 1 : prev - 1));
    };
    // console.log('vehiculeKeys', vehiculeKeys);

    useEffect(() => {
        const timer = setInterval(nextSlide, 10000);
        return () => clearInterval(timer);
    }, [current]);

    // Filtrage des véhicules
    const filteredVehicules = vehicules.filter((pc) => {
        const search = searchTerm.toLowerCase().trim();
        if (!search) return true;

        switch (searchField) {
            case 'immatriculation':
                return pc.immatriculation.toLowerCase().includes(search);
            case 'model':
                return pc.model.toLowerCase().includes(search);
            case 'marque':
                return marques.some((m) => m.id === pc.marque_id && m.nom.toLowerCase().includes(search));
            case 'carburant':
                return carburant.some((c) => c.id === pc.carburant_id && c.type.toLowerCase().includes(search));
            case 'type':
                return typeVehicule.some((t) => t.id === pc.typeVehicule_id && t.nom.toLowerCase().includes(search));
            default:
                return true;
        }
    });
    // console.log(data.map(d => d.mois));
    // Chargement des données
    useEffect(() => {
        axios.get('/depenses-vehicules').then((response) => {
            const json = response.data;

            // console.log('Dépenses des véhicules:', json);
            setData(json);
            if (json.length > 0) {
                setVehiculeKeys(Object.keys(json[0]).filter((key) => key !== 'mois'));
            }
        });
    }, []);

    useEffect(() => {
        if (!userConnecter) return;
        axios
            .get('/assurances/statut')
            .then((res) => setDataAssurance(res.data))
            .catch((err) => console.error(err));
    }, [userConnecter]);

    const { processing, delete: destroy } = useForm();
    const handleDelete = (id: number, immatriculation: string) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer ce véhicule : ${immatriculation} ?`)) {
            destroy(route('vehicules.destroy', id));
        }
    };

    const COLORS = {
        'Sans assurance': '#ef4444',
        Expirées: '#f59e0b',
        Assurées: '#10b981',
    };
    const stats = {
        totalVehicules: userConnecter.role === 'admin' ? vehicules.length : vehiculeConnecter.length,
        assurancesActives:
            userConnecter.role === 'admin'
                ? assurances.filter((a) => a.jour_restant > 0).length
                : assuranceConnecter.filter((a) => a.jour_restant > 0).length,
        entretiensEnCours:
            userConnecter.role === 'admin'
                ? entretiens.filter((e) => e.statut === 'en cours').length
                : entretiensConnecter.filter((e) => e.statut === 'en cours').length,
        assuranceExpires:
            userConnecter.role === 'admin'
                ? assurances.filter((a) => a.jour_restant === -1).length
                : assuranceConnecter.filter((a) => a.jour_restant === -1).length,
    };

    // console.log(stats.totalVehicules);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            {userConnecter.role === 'admin' ? (
                // VUE ADMIN
                <div className="min-h-screen  p-6 dark:bg-gray-900/30">
                    {/* Cartes de statistiques */}
                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
                        <div className="rounded-2xl bg-gradient-to-br from-blue-700/90 to-blue-800/50  p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100">Total Véhicules</p>
                                    <p className="text-3xl font-bold">{stats.totalVehicules}</p>
                                </div>
                                <Car className="h-8 w-8 opacity-80" />
                            </div>
                        </div>

                        <div className="rounded-2xl bg-gradient-to-r from-green-700/90 to-green-800/50 p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white">Assurances Actives</p>
                                    <p className="text-3xl font-bold">{stats.assurancesActives}</p>
                                </div>
                                <Shield className="h-8 w-8 opacity-80" />
                            </div>
                        </div>

                        <div className="rounded-2xl bg-gradient-to-r from-amber-700/90 to-amber-800/50 p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white">Entretiens en Cours</p>
                                    <p className="text-3xl font-bold">{stats.entretiensEnCours}</p>
                                </div>
                                <Settings className="h-8 w-8 opacity-80" />
                            </div>
                        </div>

                        <div className="rounded-2xl bg-gradient-to-r from-yellow-700/90 to-yellow-800/50 p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100">Véhicules avec Assurance expirée</p>
                                    <p className="text-3xl font-bold">{stats.assuranceExpires}</p>
                                </div>
                                <AlertTriangleIcon className="h-8 w-8 opacity-80" />
                            </div>
                        </div>

                        <div className="rounded-2xl bg-gradient-to-r from-red-700/90 to-red-800/50 p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100">Véhicules sans Assurance</p>
                                    <p className="text-3xl font-bold">{stats.totalVehicules - stats.assurancesActives - stats.assuranceExpires}</p>
                                </div>
                                <ShieldOffIcon className="h-8 w-8 opacity-80" />
                            </div>
                        </div>
                    </div>

                    {/* Graphiques */}
                    <div className="mb-8 grid grid-cols-1 gap-2 lg:grid-cols-3">
                        <div className="rounded-2xl bg-gray-900/50 p-6 shadow-lg lg:col-span-2 dark:bg-gray-800/90 backdrop-blur-md text-white">
                            <h3 className="mb-6 text-lg font-semibold text-white ">
                                Dépenses mensuelles des véhicules en entretiens
                            </h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                        <XAxis dataKey="mois" interval={0} />
                                        <YAxis
                                            label={{
                                                value: 'Coût (Ar)', // 👉 texte de la légende
                                                position: 'top', // 👉 position de la légende (insideLeft, outsideLeft, etc.)
                                                offset: 10,
                                                style: { textAnchor: 'middle', fill: '#a4a4a4ff', fontSize: 12 },
                                            }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                borderRadius: '8px',
                                                border: 'none',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                            }}
                                        />
                                        <Legend />
                                        {vehiculeKeys.map((vehicule, index) => (
                                            <Bar
                                                key={vehicule}
                                                dataKey={vehicule}
                                                fill={['#4f46e5', '#16a34a', '#f59e0b', '#ef4444', '#0ea5e9'][index % 5]}
                                                name={vehicule}
                                                radius={[4, 4, 0, 0]}
                                            />
                                        ))}
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-gray-900/90 p-6 shadow-lg dark:bg-gray-800">
                            <h3 className="mb-6 text-lg justify-center flex font-semibold text-white">Statut des assurances</h3>
                            <div className="h-80">
                                {dataAssurance.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={dataAssurance}
                                                dataKey="count"
                                                nameKey="statut"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                            >
                                                {dataAssurance.map((entry, index) => (
                                                    <Cell key={index} fill={COLORS[entry.statut]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex h-full items-center justify-center">
                                        <p className="text-gray-500">Chargement des données...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Graphique carburant */}
                    <div className="dark:bg-gray-800">
                        <PleinCarburantCharts />
                    </div>

                    {/* Tableau des véhicules */}
                   <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700">
    {/* Header avec recherche */}
    <div className="border-b border-gray-700 p-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
                <h2 className="text-2xl font-bold text-white">Gestion des véhicules</h2>
                <p className="text-gray-400 mt-1">Consultez et gérez votre parc automobile</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
                {/* Sélecteur de champ de recherche */}
                <div className="relative">
                    <select
                        value={searchField}
                        onChange={(e) => setSearchField(e.target.value as any)}
                        className="rounded-xl border border-gray-600 bg-gray-700 px-4 py-2.5 pl-10 pr-8 text-sm text-white transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
                    >
                        <option value="immatriculation">Immatriculation</option>
                        <option value="model">Modèle</option>
                        <option value="marque">Marque</option>
                        <option value="carburant">Carburant</option>
                        <option value="type">Type</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                {/* Champ de recherche */}
                <div className="relative">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                    <input
                        type="text"
                        placeholder={`${searchField}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-xl border border-gray-600 bg-gray-700 py-2.5 pr-4 pl-10 text-sm text-white transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none md:w-64"
                    />
                </div>
            </div>
        </div>

        {/* Indicateur de filtre actif */}
        {searchTerm && (
            <div className="mt-4 flex items-center justify-between rounded-lg border border-blue-800 bg-blue-900/20 p-3">
                <div className="flex items-center gap-2 text-sm text-blue-300">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                        />
                    </svg>
                    Filtre actif : {searchField} - "{searchTerm}"
                </div>
                <button 
                    onClick={() => setSearchTerm('')} 
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        )}
    </div>

    {/* Tableau */}
    <div className="overflow-x-auto">
        <Table>
            <TableHeader className="bg-blue-900/20">
                <TableRow>
                    <TableHead className="text-blue-200 font-semibold">Véhicule</TableHead>
                    <TableHead className="text-blue-200 font-semibold">Immatriculation</TableHead>
                    <TableHead className="text-blue-200 font-semibold">Marque</TableHead>
                    <TableHead className="text-blue-200 font-semibold">Modèle</TableHead>
                    <TableHead className="text-blue-200 font-semibold">Carburant</TableHead>
                    <TableHead className="text-blue-200 font-semibold">Type</TableHead>
                    <TableHead className="text-blue-200 font-semibold">Assurance</TableHead>
                    <TableHead className="text-right text-blue-200 font-semibold">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredVehicules.map((v, index) => {
                    const assuranceV = assurances.find((a) => a.vehicule_id === v.id);
                    const marqueNom = marques.find((m) => m.id === v.marque_id)?.nom || '';
                    const carburantType = carburant.find((c) => c.id === v.carburant_id)?.type || '';
                    const typeNom = typeVehicule.find((t) => t.id === v.typeVehicule_id)?.nom || '';

                    return (
                        <TableRow 
                            key={v.id} 
                            className={`border-gray-700 transition-all duration-200 hover:bg-blue-900/10 ${
                                index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/50'
                            }`}
                        >
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <img
                                        src={v.photo ? `/storage/${v.photo}` : '/images/default-car.png'}
                                        alt={v.model}
                                        className="h-12 w-12 rounded-xl object-cover border border-gray-600 shadow-sm"
                                    />
                                </div>
                            </TableCell>
                            <TableCell className="font-medium text-white">{v.immatriculation}</TableCell>
                            <TableCell className="text-gray-300">{marqueNom}</TableCell>
                            <TableCell className="text-gray-300">{v.model}</TableCell>
                            <TableCell className="text-gray-300">{carburantType}</TableCell>
                            <TableCell className="text-gray-300">{typeNom}</TableCell>
                            <TableCell>
                                {assuranceV ? (
                                    <span
                                        className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                                            assuranceV.jour_restant === -1
                                                ? 'bg-red-900/40 text-red-300 border border-red-800/50'
                                                : assuranceV.jour_restant < 8
                                                  ? 'bg-yellow-900/40 text-yellow-300 border border-yellow-800/50'
                                                  : 'bg-green-900/40 text-green-300 border border-green-800/50'
                                        }`}
                                    >
                                        {assuranceV.jour_restant === -1
                                            ? '🔄 Expiré'
                                            : assuranceV.jour_restant === 0
                                              ? '⏳ 0 jour'
                                              : `✅ ${assuranceV.jour_restant} jour(s)`}
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center rounded-full bg-gray-700 px-3 py-1.5 text-xs font-medium text-gray-400 border border-gray-600">
                                        ⚠️ Sans assurance
                                    </span>
                                )}
                            </TableCell>
                            <TableCell>
                                <div className="flex justify-end gap-2">
                                    <Link href={route('vehicules.show', v.id)}>
                                        <Button 
                                            size="sm" 
                                            variant="outline" 
                                            className="border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white transition-all duration-200"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Link href={route('vehicules.edit', v.id)}>
                                        <Button 
                                            size="sm" 
                                            variant="outline"
                                            className="border-blue-600 bg-blue-900/20 text-blue-400 hover:bg-blue-800 hover:text-white transition-all duration-200"
                                        >
                                            <SquarePen className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleDelete(v.id, v.immatriculation)}
                                        disabled={processing}
                                        className="bg-red-900/20 text-red-400 border border-red-800/50 hover:bg-red-800 hover:text-white transition-all duration-200"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>

        {/* État vide */}
        {filteredVehicules.length === 0 && (
            <div className="p-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-700">
                    <Car className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-400 text-lg font-medium">Aucun véhicule trouvé</p>
                <p className="text-gray-500 mt-2">
                    {searchTerm ? "Aucun résultat ne correspond à votre recherche" : "Commencez par ajouter votre premier véhicule"}
                </p>
            </div>
        )}
    </div>
</div>  
                </div>
            ) : (
                // VUE UTILISATEUR
                <div className="min-h-screen p-6">
                    {/* Carousel Véhicules */}
                    {vehiculeConnecter.length > 0 && (
                        <div className="mb-8">
                            <div className="relative h-80 overflow-hidden rounded-2xl bg-gray-900 shadow-xl md:h-96">
                                {vehiculesAvecMarque.map((v, index) => (
                                    <div
                                        key={v.id}
                                        className={`absolute inset-0 transition-opacity duration-700 ${
                                            index === current ? 'opacity-100' : 'opacity-0'
                                        }`}
                                    >
                                        <img src={`/storage/${v.photo}`} alt={v.marqueNom} className="h-full w-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                        <div className="absolute bottom-6 left-6 text-white">
                                            <h2 className="text-2xl font-bold md:text-3xl">
                                                {v.marqueNom} {v.model}
                                            </h2>
                                            <p className="mt-2 text-gray-300">
                                                Immatriculation : <span className="font-semibold">{v.immatriculation}</span>
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    onClick={prevSlide}
                                    className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-all hover:bg-black/70"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-all hover:bg-black/70"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>

                                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
                                    {vehiculeConnecter.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrent(index)}
                                            className={`h-2 w-2 rounded-full transition-all ${index === current ? 'bg-white' : 'bg-white/50'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Cartes de statistiques utilisateur */}
                    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="rounded-xl bg-gradient-to-br from-blue-700/90 to-blue-800/50 p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-white">Mes véhicules</p>
                                    <p className="text-2xl font-bold text-white">{stats.totalVehicules}</p>
                                </div>
                                <Car className="h-8 w-8 text-white" />
                            </div>
                        </div>

                        <div className="rounded-xl bg-gradient-to-r from-green-700/90 to-green-800/50 p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-white dark:text-gray-400">Assurances actives</p>
                                    <p className="text-2xl font-bold text-white">{stats.assurancesActives}</p>
                                </div>
                                <Shield className="h-8 w-8 text-white" />
                            </div>
                        </div>

                        <div className="rounded-xl bg-gradient-to-r from-yellow-700/90 to-yellow-800/50 p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-white dark:text-gray-400">Entretiens en cours</p>
                                    <p className="text-2xl font-bold text-white">{stats.entretiensEnCours}</p>
                                </div>
                                <Settings className="h-8 w-8 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Graphiques utilisateur */}
                    {/* Graphiques */}
                    <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="rounded-2xl bg-gray-900/100 p-6 shadow-lg lg:col-span-2 dark:bg-gray-800/90 backdrop-blur-md text-white">
                            <h3 className="mb-6 text-lg font-semibold text-white ">Dépenses mensuelles des véhicules en entretiens</h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                        <XAxis dataKey="mois" />
                                        <YAxis />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                borderRadius: '8px',
                                                border: 'none',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                            }}
                                        />
                                        <Legend />
                                        {vehiculeKeys.map((vehicule, index) => (
                                            <Bar
                                                key={vehicule}
                                                dataKey={vehicule}
                                                fill={['#4f46e5', '#16a34a', '#f59e0b', '#ef4444', '#0ea5e9'][index % 5]}
                                                name={vehicule}
                                                radius={[4, 4, 0, 0]}
                                            />
                                        ))}
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-gray-900/90 p-6 shadow-lg dark:bg-gray-800">
                            <h3 className="mb-6 text-lg justify-center flex font-semibold text-white">Statut des assurances</h3>    <div className="h-80">
                                {dataAssurance.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={dataAssurance}
                                                dataKey="count"
                                                nameKey="statut"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                            >
                                                {dataAssurance.map((entry, index) => (
                                                    <Cell key={index} fill={COLORS[entry.statut]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex h-full items-center justify-center">
                                        <p className="text-gray-500">Chargement des données...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Graphique carburant */}
                    <div className="bg-gray-800/40">
                        <PleinCarburantCharts />
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
