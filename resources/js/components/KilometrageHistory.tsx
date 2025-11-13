// components/KilometrageHistory.tsx - Version corrigée

import React, { useState, useEffect } from 'react';
import { Calendar, Gauge, User, TrendingUp } from 'lucide-react';
import { route } from 'ziggy-js';

interface KilometrageHistoryProps {
    vehiculeId: number;
}

interface KilometrageRecord {
    id: number;
    date_releve: string;
    kilometrage: number;
    difference: number;
    cumul_avant_reinitialisation: number;
    a_generer_entretien: boolean;
    user: {
        name: string;
    };
}

const KilometrageHistory: React.FC<KilometrageHistoryProps> = ({ vehiculeId }) => {
    const [records, setRecords] = useState<KilometrageRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchKilometrages();
    }, [vehiculeId]);

    // ✅ CORRECTION : Utilisation de route() pour l'URL
    const fetchKilometrages = async () => {
        try {
            const url = route('vehicules.kilometrages.index', { vehicule: vehiculeId });
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/json',
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setRecords(data);
            }
        } catch (error) {
            console.error('Erreur lors du chargement:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <div className="text-gray-400">Chargement de l'historique...</div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-6">Historique des relevés</h3>
            
            {records.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                    Aucun relevé enregistré
                </div>
            ) : (
                <div className="space-y-3">
                    {records.map((record) => (
                        <div
                            key={record.id}
                            className={`rounded-xl border p-4 transition-all duration-200 ${
                                record.a_generer_entretien
                                    ? 'border-yellow-500/30 bg-yellow-500/10'
                                    : 'border-gray-700 bg-gray-800/50'
                            }`}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20">
                                        <Gauge className="h-4 w-4 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="font-mono text-lg font-bold text-white">
                                            {record.kilometrage.toLocaleString()} km
                                        </p>
                                        <div className="flex items-center gap-4 text-sm text-gray-400">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {formatDate(record.date_releve)}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <User className="h-3 w-3" />
                                                {record.user.name}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {record.a_generer_entretien && (
                                    <span className="rounded-full bg-yellow-500/20 px-2 py-1 text-xs font-medium text-yellow-300">
                                        Entretien
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-400">Parcouru: </span>
                                    <span className="font-semibold text-green-400">
                                        +{record.difference.toLocaleString()} km
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Cumul: </span>
                                    <span className="font-semibold text-orange-400">
                                        {record.cumul_avant_reinitialisation.toLocaleString()} km
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default KilometrageHistory;