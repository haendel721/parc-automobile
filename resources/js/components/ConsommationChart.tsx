import axios from 'axios';
import {
    CategoryScale,
    ChartData,
    ChartDataset,
    Chart as ChartJS,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import { AlertCircle, RefreshCw, TrendingUp } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface WeekData {
    week: string;
    litres: number;
    km: number;
    consommation: number;
    vehicule_id: number;
    vehicule_nom: string;
}

interface ApiResponse {
    success: boolean;
    weeksData: WeekData[];
    total: number;
    message?: string;
}

function Consommation() {
    const [chartData, setChartData] = useState<ChartData<'line', number[], string>>({ labels: [], datasets: [] });
    const [originalData, setOriginalData] = useState<WeekData[]>([]); // 🔥 Stocker les données originales
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchData = useCallback(async (signal?: AbortSignal) => {
        try {
            setLoading(true);
            setError(null);

            // 🔹 Appel API backend (Laravel)
            const response = await axios.get<ApiResponse>('/api/consommation', { signal });
            const data = response.data.weeksData ?? [];

            // 🔥 Stocker les données originales pour le tableau
            setOriginalData(data);

            if (!data.length) {
                setChartData({ labels: [], datasets: [] });
                return;
            }

            // 🔹 Extraire les semaines uniques (labels)
            const allWeeks = Array.from(new Set(data.map((d) => d.week)));

            // 🔹 Tri chronologique des semaines
            allWeeks.sort((a, b) => {
                // Format: "2024-W42"
                const [yearA, weekA] = a.split('-W').map(Number);
                const [yearB, weekB] = b.split('-W').map(Number);
                return yearA !== yearB ? yearA - yearB : weekA - weekB;
            });

            // 🔹 Grouper les données par véhicule
            const vehiculesMap = new Map<number, { id: number; nom: string; data: WeekData[] }>();
            
            data.forEach((item) => {
                const key = item.vehicule_id;
                if (!vehiculesMap.has(key)) {
                    vehiculesMap.set(key, {
                        id: item.vehicule_id,
                        nom: item.vehicule_nom,
                        data: [],
                    });
                }
                vehiculesMap.get(key)!.data.push(item);
            });

            // 🔹 Palette de couleurs (6 couleurs max, bouclées)
            const colorPalette = [
                { border: 'rgb(79, 70, 229)', background: 'rgba(79, 70, 229, 0.1)' },
                { border: 'rgb(16, 185, 129)', background: 'rgba(16, 185, 129, 0.1)' },
                { border: 'rgb(245, 158, 11)', background: 'rgba(245, 158, 11, 0.1)' },
                { border: 'rgb(239, 68, 68)', background: 'rgba(239, 68, 68, 0.1)' },
                { border: 'rgb(139, 92, 246)', background: 'rgba(139, 92, 246, 0.1)' },
                { border: 'rgb(14, 165, 233)', background: 'rgba(14, 165, 233, 0.1)' },
            ];

            const vehicules = Array.from(vehiculesMap.values());

            // 🔹 Construire les datasets pour le graphique
            const datasets: ChartDataset<'line', number[]>[] = vehicules.map((veh, idx) => {
                // Créer un map pour accéder rapidement aux données par semaine
                const indexByWeek = new Map(veh.data.map((d) => [d.week, d.consommation]));
                
                // Pour chaque semaine, récupérer la consommation ou 0 si pas de données
                const dataPoints = allWeeks.map((week) => indexByWeek.get(week) ?? 0);
                
                const color = colorPalette[idx % colorPalette.length];

                return {
                    label: veh.nom,
                    data: dataPoints,
                    borderColor: color.border,
                    backgroundColor: color.background,
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: color.border,
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: color.border,
                    pointHoverBorderColor: '#ffffff',
                    pointHoverBorderWidth: 3,
                } as ChartDataset<'line', number[]>;
            });

            // 🔹 Mise à jour du graphique
            setChartData({
                labels: allWeeks,
                datasets,
            });
            setLastUpdated(new Date());
        } catch (err: any) {
            if (axios.isCancel(err)) return;
            console.error('Erreur lors du chargement des données:', err);
            setError('Impossible de charger les données de consommation');
        } finally {
            setLoading(false);
        }
    }, []);

    // 🔁 Chargement initial
    useEffect(() => {
        const controller = new AbortController();
        fetchData(controller.signal);
        return () => controller.abort();
    }, [fetchData]);

    // 🔧 Options du graphique
    const chartOptions = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top' as const,
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle' as const,
                        padding: 20,
                        font: { family: 'Arial, sans-serif', size: 14, weight: 500 },
                        color: '#ffffff',
                    },
                },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        title: (tooltipItems: any) => tooltipItems[0].label,
                        label: (context: any) =>
                            `${context.dataset.label}: ${context.formattedValue} L/100km`,
                    },
                },
                title: {
                    display: true,
                    text: 'Consommation de carburant par semaine',
                    color: '#ffffff',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        color: '#ddd',
                        maxRotation: 0,
                        minRotation: 0,
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Consommation (L/100km)',
                        color: '#ccc',
                        font: { size: 14 },
                    },
                    ticks: { 
                        color: '#ddd',
                        callback: function(value: any) {
                            return value + ' L';
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
            },
            interaction: { 
                mode: 'index' as const, 
                intersect: false 
            },
            elements: {
                line: {
                    tension: 0.4
                }
            }
        }),
        [],
    );

    // 🔥 Préparer les données pour le tableau
    const tableData = useMemo(() => {
        if (!originalData.length) return [];
        
        return originalData
            .filter(data => data.consommation > 0) // Filtrer les données valides
            .sort((a, b) => {
                // Trier par semaine puis par véhicule
                const weekCompare = a.week.localeCompare(b.week);
                if (weekCompare !== 0) return weekCompare;
                return a.vehicule_nom.localeCompare(b.vehicule_nom);
            });
    }, [originalData]);

    // 🧭 Gestion des états (chargement / erreur / vide / affichage)
    if (loading) {
        return (
            <div className="flex h-80 items-center justify-center rounded-2xl bg-gray-900 shadow-lg">
                <div className="text-center">
                    <RefreshCw className="mx-auto h-8 w-8 animate-spin text-blue-500" />
                    <p className="mt-3 text-sm text-gray-400">Chargement des données de consommation...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-80 items-center justify-center rounded-2xl bg-gray-900 shadow-lg">
                <div className="text-center">
                    <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
                    <p className="mt-3 text-sm text-red-400">{error}</p>
                    <button
                        onClick={() => fetchData()}
                        className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 transition-colors"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    if (chartData.datasets.length === 0) {
        return (
            <div className="flex h-80 items-center justify-center rounded-2xl bg-gray-900 shadow-lg">
                <div className="text-center">
                    <TrendingUp className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-3 text-sm text-gray-400">Aucune donnée de consommation disponible</p>
                    <button
                        onClick={() => fetchData()}
                        className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 transition-colors"
                    >
                        Actualiser
                    </button>
                </div>
            </div>
        );
    }

    // ✅ Affichage du graphique
    return (
        <div className="mb-8 w-full bg-gray-900/100 rounded-2xl shadow-lg">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="m-4">
                    <h3 className="text-lg font-semibold text-white">Évolution de la consommation de carburant</h3>
                    <p className="text-sm text-gray-300">
                        Consommation hebdomadaire par véhicule (L/100km)
                        {lastUpdated && (
                            <span className="ml-2 text-xs text-gray-400">
                                (Mise à jour : {lastUpdated.toLocaleTimeString('fr-FR')})
                            </span>
                        )}
                    </p>
                </div>
                <button
                    onClick={() => fetchData()}
                    disabled={loading}
                    className="m-4 flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Actualiser
                </button>
            </div>

            <div className="bg-gray-900/80 p-6 rounded-b-2xl">
                <div className="h-80 w-full">
                    <Line data={chartData} options={chartOptions} />
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-gray-700 pt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="flex h-3 w-3 items-center justify-center rounded-full bg-blue-500">
                            <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                        </div>
                        <span>{chartData.datasets.length} véhicule(s) suivi(s)</span>
                    </div>
                    <div className="text-xs text-gray-400">Données en Litres/100km</div>
                </div>
            </div>

            {/* 🔥 Tableau des données détaillées - VERSION CORRIGÉE */}
            <div className="mt-8 p-6 bg-gray-800/50 rounded-lg">
                <h4 className="text-lg font-semibold text-white mb-4">Détails des données</h4>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-900/50 rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-gray-700">
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Semaine</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Véhicule</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Litres</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Km parcourus</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Consommation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {tableData.length > 0 ? (
                                tableData.map((data, index) => (
                                    <tr key={`${data.vehicule_id}-${data.week}-${index}`} className="hover:bg-gray-700/50 transition-colors">
                                        <td className="px-4 py-3 text-sm text-gray-300">{data.week}</td>
                                        <td className="px-4 py-3 text-sm text-gray-300">{data.vehicule_nom}</td>
                                        <td className="px-4 py-3 text-sm text-gray-300 text-right">{data.litres.toFixed(1)} L</td>
                                        <td className="px-4 py-3 text-sm text-gray-300 text-right">{data.km} km</td>
                                        <td className="px-4 py-3 text-sm font-semibold text-right">
                                            <span className="text-blue-400">{data.consommation.toFixed(2)} L/100km</span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-4 py-4 text-center text-sm text-gray-400">
                                        Aucune donnée détaillée disponible
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 🔥 Statistiques récapitulatives */}
                {tableData.length > 0 && (
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-700">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-400">
                                {chartData.datasets.length}
                            </div>
                            <div className="text-sm text-gray-400">Véhicules suivis</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-400">
                                {tableData.length}
                            </div>
                            <div className="text-sm text-gray-400">Enregistrements</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-400">
                                {Math.max(...tableData.map(d => d.consommation)).toFixed(1)} L
                            </div>
                            <div className="text-sm text-gray-400">Consommation max</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Consommation;