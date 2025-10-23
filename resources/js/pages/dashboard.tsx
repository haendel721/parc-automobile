import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import { Eye, Search, SquarePen, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { route } from 'ziggy-js';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
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
    // Récupère les données envoyées par le controller

    const { entretiens, vehicules, users, assurances, userConnecter, marques, typeVehicule, carburant } = usePage<Props>().props;
    const vehiculeConnecter = vehicules.filter((v) => v.user_id === userConnecter.id);
    const assuranceConnecter = assurances.filter((a) => a.user_id === userConnecter.id);
    const entretiensConnecter = entretiens.filter((e) => e.user_id === userConnecter.id);
    // console.log(JSON.stringify(stats, null, 2));
    // console.log('typeVehicule' + typeVehicule);
    // console.log(assuranceConnecter);
    const vehiculesAvecMarque = vehiculeConnecter.map((v) => {
        const marque = marques.find((m) => m.id === v.marque_id);
        return {
            ...v,
            marqueNom: marque ? marque.nom : 'Marque inconnue',
        };
    });
    entretiensConnecter?.forEach((e) => console.log(e.statut));

    const [current, setCurrent] = useState(0);

    // Fonction pour aller à l'image suivante
    const nextSlide = () => {
        setCurrent((prev) => (prev === vehiculeConnecter.length - 1 ? 0 : prev + 1));
    };

    // Fonction pour aller à l'image précédente
    const prevSlide = () => {
        setCurrent((prev) => (prev === 0 ? vehiculeConnecter.length - 1 : prev - 1));
    };
    // Optionnel : défilement automatique toutes les 3 secondes
    useEffect(() => {
        const timer = setInterval(nextSlide, 10000);
        return () => clearInterval(timer);
    }, [current]);
    const vehicule = vehiculeConnecter[current];
    // console.log('Vehicules ' + vehicules.map((v) => v.immatriculation));
    const [searchTerm, setSearchTerm] = useState('');

    // 🔍 Filtrage dynamique
    const filteredVehicules = vehicules.filter(
        (v) =>
            v.immatriculation.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(v.marque_id).toLowerCase().includes(searchTerm.toLowerCase()),
    );
    const [data, setData] = useState<DepenseData[]>([]);
    const [vehiculeKeys, setVehiculeKeys] = useState<string[]>([]);

    useEffect(() => {
        axios.get('/depenses-vehicules').then((response) => {
            const json = response.data;
            setData(json);

            if (json.length > 0) {
                // Récupère les noms de colonnes sauf "mois"
                setVehiculeKeys(Object.keys(json[0]).filter((key) => key !== 'mois'));
            }
        });
    }, []);
    const COLORS = {
        'Sans assurance': '#ff0004ff', // rouge
        Expirées: '#FFD700', // jaune
        Assurées: '#14882bff', // vert
    };
    const [dataAssurance, setDataAssurance] = useState<{ statut: string; count: number }[]>([]);
    // console.log(
    //     vehicules.map((v) => v.id),
    //     '\n',
    //     filteredVehicules.map((fv) => fv.id),
    // );
    useEffect(() => {
        axios
            .get('/assurance-expirer')
            .then((res) => {
                console.log('Assurances:', res.data); // 🔍 vérifier ici
                setDataAssurance(res.data);
            })
            .catch((err) => console.error(err));
    }, []);
    const { processing, delete: destroy } = useForm();
    const handleDelete = (id: number, immatriculation: string) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer cette vehicule : ${immatriculation} ?`)) {
            destroy(route('vehicules.destroy', id));
        }
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            {userConnecter.role === 'admin' ? (
                <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    <div className="grid gap-6 md:grid-cols-3">
                        {/* Graphe - 2/3 */}
                        <div className="rounded-2xl bg-white p-6 shadow-md md:col-span-2 dark:bg-gray-800">
                            <h2 className="mb-6 text-center text-xl font-semibold text-gray-900 dark:text-gray-100">
                                Dépenses mensuelles des véhicules (sans assurance)
                            </h2>

                            <div style={{ width: '100%', height: 500 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                        <XAxis dataKey="mois" tick={{ fill: '#6b7280', fontSize: 14 }} />
                                        <YAxis
                                            label={{ value: 'Coût (Ar)', angle: -90, position: 'insideLeft', fill: '#6b7280', fontSize: 14 }}
                                            tick={{ fill: '#6b7280', fontSize: 12 }}
                                        />
                                        <Tooltip contentStyle={{ backgroundColor: '#f9fafb', borderRadius: '8px', border: 'none' }} />
                                        <Legend verticalAlign="top" height={36} />

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

                        {/* Placeholder ou info - 1/3 */}
                        <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-md md:col-span-1 dark:bg-gray-800">
                            {/* Titre du graphique */}
                            <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-100">Statistiques des Assurances</h2>{' '}
                            {/* <PlaceholderPattern className="h-full w-full stroke-neutral-300 dark:stroke-neutral-500" /> */}
                            <div style={{ width: '100%', height: 400 }}>
                                {dataAssurance.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={dataAssurance}
                                                dataKey="count"
                                                nameKey="statut"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={140}
                                                innerRadius={70}
                                                paddingAngle={2}
                                                label={({ percent }) => ` ${percent ? (percent * 100).toFixed(0) : 0}%`}
                                            >
                                                {dataAssurance.map((entry, index) => (
                                                    <Cell key={index} fill={COLORS[entry.statut]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#f9fafb', borderRadius: '8px', border: 'none' }}
                                                formatter={(value: number, name: string) => [`${value} assurances`, name]}
                                            />
                                            <Legend
                                                verticalAlign="bottom"
                                                height={36}
                                                formatter={(value: string) => {
                                                    const item = dataAssurance.find((d) => d.statut === value);
                                                    return `${value}: ${item?.count ?? 0}`; 
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <p className="text-center text-gray-500">Chargement des données...</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                        {/* <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" /> */}
                        {vehicules.length > 0 && (
                            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-xl">
                                {/* HEADER + BARRE DE RECHERCHE */}
                                <div className="mb-6 flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-gray-800">Liste des véhicules avec jour restant de l'assurance</h2>
                                    <div className="relative w-64">
                                        <Search className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Par immatricule, model..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full rounded-xl border border-gray-300 py-2 pr-4 pl-10 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="overflow-x-auto rounded-lg">
                                    <Table className="min-w-full rounded-xl border border-gray-200 bg-white">
                                        <TableHeader className="bg-blue-50 text-blue-700">
                                            <TableRow>
                                                <TableHead></TableHead>
                                                <TableHead>Id</TableHead>
                                                <TableHead>Immatriculation</TableHead>
                                                <TableHead>Marque</TableHead>
                                                <TableHead>Modèle</TableHead>
                                                <TableHead>Carburant</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Durée de l'assurance</TableHead>
                                                <TableHead className="text-center">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredVehicules.length > 0 ? (
                                                filteredVehicules.map((v, i) => (
                                                    <TableRow
                                                        key={v.id}
                                                        className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} transition hover:bg-blue-50`}
                                                    >
                                                        <TableCell>
                                                            <div className="flex items-center space-x-3">
                                                                <img
                                                                    src={v.photo ? `/storage/${v.photo}` : '/images/default-car.png'}
                                                                    alt={v.model}
                                                                    className="h-12 w-12 rounded-full border border-gray-200 object-cover shadow-sm"
                                                                />
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{v.id}</TableCell>
                                                        <TableCell className="font-medium">{v.immatriculation}</TableCell>

                                                        <TableCell>{marques.map((m) => (m.id === v.marque_id ? m.nom : ''))}</TableCell>
                                                        <TableCell>{v.model}</TableCell>
                                                        <TableCell>{carburant.map((c) => (c.id === v.carburant_id ? c.type : ''))}</TableCell>
                                                        <TableCell>{typeVehicule.map((t) => (t.id === v.typeVehicule_id ? t.nom : ''))}</TableCell>
                                                        <TableCell>
                                                            {(() => {
                                                                const assuranceV = assurances.find((a) => a.vehicule_id === v.id);
                                                                if (!assuranceV) return "pas d'assurance";
                                                                return (
                                                                    <span
                                                                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                                                            assuranceV.jour_restant === 0
                                                                                ? 'bg-red-100 text-red-800'
                                                                                : assuranceV.jour_restant < 8
                                                                                  ? 'bg-yellow-100 text-yellow-800'
                                                                                  : 'bg-green-100 text-green-800'
                                                                        }`}
                                                                    >
                                                                        {assuranceV.jour_restant === -1 ? "Expiré" : (assuranceV.jour_restant === 0 ? 0 : assuranceV.jour_restant + " Jour(s)")}
                                                                    </span>
                                                                );
                                                            })()}
                                                        </TableCell>

                                                        <TableCell className="text-center">
                                                            <div className="flex justify-center gap-2">
                                                                <Link href={route('vehicules.edit', v.id)}>
                                                                    <Button size="icon" className="bg-slate-600 hover:bg-slate-700">
                                                                        <SquarePen className="h-4 w-4" />
                                                                    </Button>
                                                                </Link>
                                                                <Button
                                                                    disabled={processing}
                                                                    size="icon"
                                                                    onClick={() => handleDelete(v.id, v.immatriculation)}
                                                                    className="bg-red-500 hover:bg-red-700"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                                <Link href={route('vehicules.show', v.id)}>
                                                                    <Button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                </Link>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={8} className="py-6 text-center text-gray-500">
                                                        Aucun véhicule trouvé
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="relative flex min-h-screen flex-col items-center overflow-hidden p-2">
                    {/* Image de la voiture */}
                    <div className="relative mb-8 h-96 w-full overflow-hidden rounded-xl bg-gray-900 shadow-lg">
                        {/* --- Image du véhicule --- */}
                        {vehiculesAvecMarque.map((v, index) => (
                            <img
                                key={v.id}
                                src={`/storage/${v.photo}`}
                                alt={v.marqueNom}
                                className={`absolute top-0 left-0 h-full w-full object-cover transition-opacity duration-700 ${
                                    index === current ? 'opacity-100' : 'opacity-0'
                                }`}
                            />
                        ))}

                        {/* --- Dégradé pour lisibilité du texte --- */}
                        <div className="absolute right-0 bottom-0 left-0 h-40 bg-gradient-to-t from-black to-transparent"></div>

                        {/* --- Informations du véhicule --- */}
                        <div className="absolute bottom-4 left-6 text-white">
                            <h2 className="text-2xl font-bold">
                                {vehiculesAvecMarque[current].marqueNom} : {vehiculesAvecMarque[current].model}
                            </h2>
                            <p className="mt-1 text-sm text-gray-200">
                                Immatriculation : <span className="font-semibold">{vehiculesAvecMarque[current].immatriculation}</span>
                            </p>
                        </div>

                        {/* --- Boutons navigation --- */}
                        <button
                            onClick={prevSlide}
                            className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/70"
                        >
                            ❮
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/70"
                        >
                            ❯
                        </button>

                        {/* --- Indicateurs (petits points) --- */}
                        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 space-x-2">
                            {vehiculeConnecter.map((_, index) => (
                                <div
                                    key={index}
                                    onClick={() => setCurrent(index)}
                                    className={`h-2 w-2 cursor-pointer rounded-full ${index === current ? 'bg-white' : 'bg-gray-500'}`}
                                ></div>
                            ))}
                        </div>
                    </div>
                    <div className="max-w-10xl mx-auto grid grid-cols-1 gap-1 md:grid-cols-2">
                        {/* -------------------- Tableau Véhicules & Assurances -------------------- */}
                        <div className="rounded-xl bg-white p-6 shadow-lg">
                            <div className="rounded-2xl bg-white p-6 shadow-md md:col-span-2 dark:bg-gray-800">
                            <h2 className="mb-6 text-center text-xl font-semibold text-gray-900 dark:text-gray-100">
                                Dépenses mensuelles des véhicules (sans assurance) 
                            </h2>

                            <div style={{ width: '100%', height: 500 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                        <XAxis dataKey="mois" tick={{ fill: '#6b7280', fontSize: 14 }} />
                                        <YAxis
                                            label={{ value: 'Coût (Ar)', angle: -90, position: 'insideLeft', fill: '#6b7280', fontSize: 14 }}
                                            tick={{ fill: '#6b7280', fontSize: 12 }}
                                        />
                                        <Tooltip contentStyle={{ backgroundColor: '#f9fafb', borderRadius: '8px', border: 'none' }} />
                                        <Legend verticalAlign="top" height={36} />

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
                        </div>

                        {/* -------------------- Cartes Entretiens -------------------- */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                            {vehiculeConnecter.map((vehicule) => {
                                // Compter les entretiens validés pour ce véhicule
                                const nbEntretiens = entretiensConnecter.filter(
                                    (e) => e.vehicule_id === vehicule.id && e.statut?.toLowerCase() === 'validé',
                                ).length;

                                return (
                                    <div
                                        key={vehicule.id}
                                        className="relative flex flex-col items-center rounded-2xl bg-gradient-to-br from-green-500 via-green-400 to-emerald-400 p-6 text-white shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl"
                                    >
                                        {/* Image véhicule */}
                                        <div className="mb-4 h-20 w-32 overflow-hidden rounded-lg border-2 border-white">
                                            <img
                                                src={vehicule.photo ? `/storage/${vehicule.photo}` : '/images/default-car.png'}
                                                alt={vehicule.immatriculation}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>

                                        {/* Infos véhicule */}
                                        <h3 className="text-lg font-bold">{vehicule.immatriculation}</h3>
                                        <p className="mt-1 text-sm text-white/80">Nombre d’entretiens validés : {nbEntretiens}</p>

                                        {/* Badge dynamique */}
                                        <div
                                            className={`mt-3 rounded-full px-3 py-1 text-sm font-medium ${
                                                nbEntretiens === 0
                                                    ? 'bg-red-200 text-red-800'
                                                    : nbEntretiens < 3
                                                      ? 'bg-yellow-200 text-yellow-800'
                                                      : 'bg-green-200 text-green-800'
                                            }`}
                                        >
                                            {nbEntretiens} entretien{nbEntretiens > 1 ? 's' : ''}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
