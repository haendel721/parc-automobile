import { router, useForm, usePage } from '@inertiajs/react';
import { AlertTriangle, Calendar, Gauge, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {route} from 'ziggy-js';
interface KilometrageModalProps {
    isOpen: boolean;
    onClose: () => void;
    vehiculeId: number;
    vehiculeData?: {
        immatriculation: string;
        model: string;
        kilometrique: number;
        releve_km_cumule: number;
    };
    dernierReleve?: {
        kilometrage: number;
        date_releve: string;
        // autres champs si nécessaire
    };
}

const KilometrageModal: React.FC<KilometrageModalProps> = ({
    isOpen,
    onClose,
    vehiculeId,
    vehiculeData,
    dernierReleve,
}) => {
    const { auth } = usePage().props as any;
    const { data, setData, post, processing, errors, reset } = useForm({
        vehicule_id: vehiculeId,
        user_id: auth.user.id,
        date_releve: new Date().toISOString().split('T')[0],
        kilometrage: '',
    });

    const [prediction, setPrediction] = useState<any>(null);
    const [apiError, setApiError] = useState<string>('');

    useEffect(() => {
        if (isOpen) {
            reset();
            setData({
                vehicule_id: vehiculeId,
                user_id: auth.user.id,
                date_releve: new Date().toISOString().split('T')[0],
                kilometrage: '',
            });
            setApiError('');
        }
    }, [isOpen, vehiculeId]);

    //  Vérification robuste de dernierReleve
    const getDernierKm = () => {
        console.log('dernierReleve:', dernierReleve); // Debug
        console.log('vehiculeData:', vehiculeData); // Debug
        
        // Si dernierReleve existe et a la propriété kilometrage
        if (dernierReleve && typeof dernierReleve.kilometrage === 'number') {
            return dernierReleve.kilometrage;
        }
        
        // Sinon, utiliser le kilométrique du véhicule
        if (vehiculeData && typeof vehiculeData.kilometrique === 'number') {
            return vehiculeData.kilometrique;
        }
        
        // Valeur par défaut
        return 0;
    };

    const getCumulActuel = () => {
        return vehiculeData?.releve_km_cumule || 0;
    };

    const dernierKm = getDernierKm();
    const cumulActuel = getCumulActuel();

    // Debug pour vérifier les valeurs
    useEffect(() => {
        console.log('Calculs - dernierKm:', dernierKm, 'cumulActuel:', cumulActuel);
    }, [dernierKm, cumulActuel]);

    // Calcul de prédiction
    useEffect(() => {
        if (data.kilometrage) {
            const nouveauKm = parseInt(data.kilometrage);

            if (!isNaN(nouveauKm) && nouveauKm >= dernierKm) {
                const difference = nouveauKm - dernierKm;
                const nouveauCumul = cumulActuel + difference;
                const atteintSeuil = nouveauCumul >= 5000;

                setPrediction({
                    difference,
                    nouveauCumul,
                    atteintSeuil,
                });
                setApiError('');
            } else if (!isNaN(nouveauKm)) {
                setPrediction(null);
                setApiError(`Le kilométrage doit être supérieur ou égal à ${dernierKm.toLocaleString()} km`);
            }
        } else {
            setPrediction(null);
            setApiError('');
        }
    }, [data.kilometrage, dernierKm, cumulActuel]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setApiError('');
        
        post(route('kilometrages.store'), {
            onSuccess: () => {
                reset();
                onClose();
                router.reload({ only: ['vehicule', 'dernierReleve'] });
            },
            onError: (errors) => {
                if (errors.kilometrage) {
                    setApiError(errors.kilometrage);
                } else if (errors.error) {
                    setApiError(errors.error);
                } else {
                    setApiError("Erreur lors de l'enregistrement du relevé");
                }
            },
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-md rounded-2xl border border-gray-700 bg-gray-800 p-6 shadow-2xl">
                {/* En-tête */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
                            <Gauge className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Relevé Kilométrique</h2>
                            <p className="text-sm text-gray-400">
                                {vehiculeData?.immatriculation} • {vehiculeData?.model}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-700 hover:text-gray-200">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Erreur API */}
                {apiError && (
                    <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/20 p-3">
                        <p className="text-sm text-red-300">{apiError}</p>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Informations actuelles */}
                    <div className="grid grid-cols-2 gap-4 rounded-xl bg-gray-700/50 p-4">
                        <div>
                            <p className="text-sm text-gray-400">Km actuel</p>
                            <p className="font-mono text-lg font-bold text-white">{dernierKm.toLocaleString()} km</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Cumul actuel</p>
                            <p className="font-mono text-lg font-bold text-orange-400">{cumulActuel.toLocaleString()} km</p>
                        </div>
                    </div>

                    {/* Date de relevé */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Date du relevé</label>
                        <div className="relative">
                            <Calendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="date"
                                required
                                value={data.date_releve}
                                onChange={(e) => setData('date_releve', e.target.value)}
                                className="w-full rounded-lg border border-gray-600 bg-gray-700 py-2.5 pr-4 pl-10 text-white transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        {errors.date_releve && <p className="text-sm text-red-400">{errors.date_releve}</p>}
                    </div>

                    {/* Kilométrage */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Nouveau kilométrage *</label>
                        <div className="relative">
                            <Gauge className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="number"
                                required
                                value={data.kilometrage}
                                onChange={(e) => {
                                    setData('kilometrage', e.target.value);
                                    setApiError('');
                                }}
                                min={dernierKm}
                                placeholder={`Minimum: ${dernierKm.toLocaleString()} km`}
                                className="w-full rounded-lg border border-gray-600 bg-gray-700 py-2.5 pr-4 pl-10 font-mono text-white transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        {errors.kilometrage && <p className="text-sm text-red-400">{errors.kilometrage}</p>}
                    </div>

                    {/* Prédiction */}
                    {prediction && (
                        <div className="rounded-xl border border-gray-600 bg-gray-700/30 p-4">
                            <h3 className="mb-3 text-sm font-medium text-gray-300">Prévision du relevé</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-400">Distance parcourue:</span>
                                    <span className="font-mono text-sm font-semibold text-green-400">
                                        +{prediction.difference.toLocaleString()} km
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-400">Nouveau cumul:</span>
                                    <span className="font-mono text-sm font-semibold text-orange-400">
                                        {prediction.nouveauCumul.toLocaleString()} km
                                    </span>
                                </div>
                                {prediction.atteintSeuil && (
                                    <div className="flex items-center gap-2 rounded-lg bg-yellow-500/20 p-2">
                                        <AlertTriangle className="h-4 w-4 text-yellow-400" />
                                        <span className="text-sm text-yellow-300">Entretien programmé à 5 000 km</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">   
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-lg border border-gray-600 bg-gray-700 px-4 py-2.5 text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-gray-600 hover:text-white"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={processing || !data.kilometrage}
                            className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {processing ? 'Enregistrement...' : 'Enregistrer le relevé'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default KilometrageModal;