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

interface PleinCarburantData {
    vehicule_id: number;
    annee: number;
    semaine: number;
    total_hebdomadaire: number;
    immatriculation: string;
    model: string;
    periode: string; // ex: "Semaine 42 - 2025"
}

interface VehiculeGrouped {
    id: number;
    immatriculation: string;
    model: string;
    data: PleinCarburantData[];
}

function GrapheParVehicule() {
    const [chartData, setChartData] = useState<ChartData<'line', number[], string>>({ labels: [], datasets: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchData = useCallback(async (signal?: AbortSignal) => {
        try {
            setLoading(true);
            setError(null);

            // 🔹 Appel API backend (Laravel)
            const response = await axios.get<PleinCarburantData[]>('/graphe-variation-plein-carburant', { signal });
            const data = response.data ?? [];

            if (!data.length) {
                setChartData({ labels: [], datasets: [] });
                return;
            }

            // 🔹 Extraire les semaines uniques (labels)
            const allWeeks = Array.from(new Set(data.map((d) => d.periode)));

            // 🔹 Tri chronologique (année + semaine)
            allWeeks.sort((a, b) => {
                const getWeek = (p: string) => Number((p.match(/Semaine\s+(\d+)/) ?? [])[1]) || 0;
                const getYear = (p: string) => Number((p.match(/(\d{4})$/) ?? [])[1]) || 0;
                const aYear = getYear(a);
                const bYear = getYear(b);
                const aWeek = getWeek(a);
                const bWeek = getWeek(b);
                return aYear !== bYear ? aYear - bYear : aWeek - bWeek;
            });

            // 🔹 Grouper les données par véhicule
            const vehiculesMap = new Map<number, VehiculeGrouped>();
            data.forEach((item) => {
                const key = item.vehicule_id;
                if (!vehiculesMap.has(key)) {
                    vehiculesMap.set(key, {
                        id: item.vehicule_id,
                        immatriculation: item.immatriculation,
                        model: item.model,
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
                const indexByWeek = new Map(veh.data.map((d) => [d.periode, d.total_hebdomadaire]));
                const dataPoints = allWeeks.map((k) => indexByWeek.get(k) ?? 0);
                const color = colorPalette[idx % colorPalette.length];

                return {
                    label: `${veh.immatriculation}`,
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
            setError('Impossible de charger les données des carburants');
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
                            `${context.dataset.label}: ${context.formattedValue} Ar`,
                    },
                },
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        color: '#ddd',
                        maxRotation: 0,
                        minRotation: 0,
                    },
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Coût (Ariary)',
                        color: '#ccc',
                        font: { size: 14 },
                    },
                    ticks: { color: '#ddd' },
                },
            },
            interaction: { mode: 'index' as const, intersect: false },
        }),
        [],
    );

    // 🧭 Gestion des états (chargement / erreur / vide / affichage)
    if (loading) {
        return (
            <div className="flex h-80 items-center justify-center rounded-2xl bg-gray-900 shadow-lg">
                <div className="text-center">
                    <RefreshCw className="mx-auto h-8 w-8 animate-spin text-blue-500" />
                    <p className="mt-3 text-sm text-gray-400">Chargement des données carburant...</p>
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
                        className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-sm text-white"
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
                    <p className="mt-3 text-sm text-gray-400">Aucune donnée carburant disponible</p>
                    <button
                        onClick={() => fetchData()}
                        className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-sm text-white"
                    >
                        Actualiser
                    </button>
                </div>
            </div>
        );
    }

    // ✅ Affichage du graphique
    return (
        <div className="mb-8 w-full bg-gray-900/100">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="m-4">
                    <h3 className="text-lg font-semibold text-white">Évolution hebdomadaire du coût du carburant</h3>
                    <p className="text-sm text-gray-300">
                        Coûts hebdomadaires par véhicule
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
                    className="m-4 flex items-center gap-2 rounded-lg bg-blue-200 px-4 py-2 text-sm font-medium text-gray-700"
                >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Actualiser
                </button>
            </div>

            <div className="bg-gray-900/80 p-6 shadow-lg">
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
                    <div className="text-xs text-gray-400">Données en Ariary (Ar)</div>
                </div>
            </div>
        </div>
    );
}

export default GrapheParVehicule;
