import { useForm } from '@inertiajs/react';
import { Calendar, Gauge, X } from 'lucide-react';
import { useEffect } from 'react';
import { route } from 'ziggy-js';

const KilometrageModal = ({ isOpen, onClose, vehiculeId }) => {
    // useForm pour gérer le formulaire
    const { data, setData, post, errors, processing, reset } = useForm({
        kilometrage: '',
        date_releve: new Date().toISOString().split('T')[0],
        type_releve: 'normal',
        vehicule_id: vehiculeId,
    });

    // Met à jour vehicule_id si le prop change
    useEffect(() => {
        setData('vehicule_id', vehiculeId);
    }, [vehiculeId]);

    // Validation simple côté client
    const validateForm = () => {
        if (!data.kilometrage) return false;
        if (!/^\d+$/.test(data.kilometrage)) return false;
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        post(route('kilometrages.store'), {
            onSuccess: () => {
                handleClose();
            },
            onError: (err) => console.log(err),
        });
    };

    const handleClose = () => {
        reset('kilometrage', 'date_releve', 'type_releve'); // reset uniquement ces champs
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 backdrop-blur-sm transition-opacity duration-500"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md scale-100 transform opacity-100 transition-all duration-300">
                <div className="overflow-hidden rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900 p-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-900/30 p-2">
                                <Gauge className="h-6 w-6 text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white">Relevé Kilométrique</h2>
                                <p className="mt-1 text-sm text-gray-400">Mettre à jour le kilométrage du véhicule</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="rounded-lg p-2 text-gray-400 transition-colors duration-200 hover:bg-gray-800 hover:text-white"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6 p-6">
                        {/* Kilométrage Input */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                <Gauge className="h-4 w-4 text-blue-400" />
                                Kilométrage actuel
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="kilometrage"
                                    value={data.kilometrage}
                                    onChange={(e) => setData('kilometrage', e.target.value)}
                                    placeholder="Entrez le kilométrage..."
                                    className={`w-full rounded-xl border bg-gray-800 px-4 py-3 text-white placeholder-gray-500 transition-all duration-200 focus:border-transparent focus:ring-2 focus:outline-none ${
                                        errors.kilometrage
                                            ? 'border-red-500 focus:ring-red-500/50'
                                            : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/50'
                                    }`}
                                />
                                <span className="absolute top-1/2 right-4 -translate-y-1/2 transform text-sm text-gray-400">km</span>
                            </div>
                            {errors.kilometrage && (
                                <p className="flex items-center gap-1 text-sm text-red-400">{errors.kilometrage}</p>
                            )}
                        </div>

                        {/* Date Input */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                <Calendar className="h-4 w-4 text-blue-400" />
                                Date de relevé
                            </label>
                            <input
                                type="date"
                                name="date_releve"
                                value={data.date_releve}
                                onChange={(e) => setData('date_releve', e.target.value)}
                                className={`w-full rounded-xl border bg-gray-800 px-4 py-3 text-white transition-all duration-200 focus:border-transparent focus:ring-2 focus:outline-none ${
                                    errors.date_releve
                                        ? 'border-red-500 focus:ring-red-500/50'
                                        : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/50'
                                }`}
                            />
                            {errors.date_releve && <p className="text-sm text-red-400">{errors.date_releve}</p>}
                        </div>

                        {/* Type de relevé */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Type de relevé</label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { value: 'normal', label: 'Normal', desc: 'Relevé périodique' },
                                    { value: 'vidange', label: 'Vidange', desc: 'Avant vidange' },
                                ].map((type) => (
                                    <label
                                        key={type.value}
                                        className={`relative flex cursor-pointer flex-col rounded-xl border p-4 transition-all duration-200 ${
                                            data.type_releve === type.value
                                                ? 'border-blue-500 bg-blue-900/20 ring-2 ring-blue-500/20'
                                                : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="type_releve"
                                            value={type.value}
                                            checked={data.type_releve === type.value}
                                            onChange={() => setData('type_releve', type.value)}
                                            className="sr-only"
                                        />
                                        <span className="text-sm font-medium text-white">{type.label}</span>
                                        <span className="mt-1 text-xs text-gray-400">{type.desc}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 border-t border-gray-700 pt-4">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex-1 rounded-xl border border-gray-600 bg-gray-800 px-4 py-3 font-medium text-gray-300 transition-all duration-200 hover:bg-gray-700 focus:ring-2 focus:ring-gray-500/50 focus:outline-none"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 font-medium text-white transition-all duration-200 hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Enregistrement...
                                    </>
                                ) : (
                                    <>
                                        <Gauge className="h-4 w-4" />
                                        Enregistrer
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default KilometrageModal;
