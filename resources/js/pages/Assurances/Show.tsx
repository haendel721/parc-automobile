import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { CalendarDays, DollarSign, FileText, ShieldCheck } from 'lucide-react';

type Assurance = {
    id: number;
    vehicule_id: number;
    NomCompagnie: string;
    NumContrat: string;
    dateDebut: string;
    dateFin: string;
    cout: number;
};

type Vehicule = {
    id: number;
    immatriculation: string;
    marque: string;
    photo?: string; // ✅ ajouter si tu as une image stockée
};

export default function Show() {
    const { assurance, vehicule } = usePage<{ assurance: Assurance; vehicule: Vehicule }>().props;

    // URL de l’image du véhicule ou image par défaut
    const bgImage = vehicule.photo
        ? `/storage/${vehicule.photo}`
        : '/images/default-car.png';

    return (
        <AppLayout>
            <Head title="Assurance du véhicule" />

            {/* 🔹 Section avec image de fond */}
            <div
                className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 py-10"
                style={{
                    backgroundImage: `url(${bgImage})`,
                }}
            >
                {/* 🔹 Overlay sombre pour améliorer la lisibilité */}
                <div className="absolute inset-0 bg-black/50"></div>

                {/* 🔹 Contenu principal */}
                <div className="relative z-10 w-full max-w-3xl rounded-2xl bg-gray-200 backdrop-blur-md p-8 shadow-2xl ring-1 ring-gray-200">
                    <h1 className="mb-8 text-center text-3xl font-bold text-gray-900">
                        Assurance du véhicule
                        <span className="block text-blue-700">{vehicule.immatriculation}</span>
                    </h1>

                    {/* Carte principale */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        {/* En-tête */}
                        <div className="mb-6 flex items-center justify-between border-b pb-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-blue-100 p-3">
                                    <ShieldCheck className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        {assurance.NomCompagnie}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Contrat n° {assurance.NumContrat}
                                    </p>
                                </div>
                            </div>

                            <span className="rounded-full bg-green-100 px-4 py-1 text-sm font-medium text-green-700">
                                Actif
                            </span>
                        </div>

                        {/* Informations principales */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="flex items-center gap-3">
                                <CalendarDays className="h-5 w-5 text-blue-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Date de début</p>
                                    <p className="font-medium text-gray-800">{assurance.dateDebut}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <CalendarDays className="h-5 w-5 text-red-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Date de fin</p>
                                    <p className="font-medium text-gray-800">{assurance.dateFin}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-gray-500" />
                                <div>
                                    <p className="text-sm text-gray-500">N° du contrat</p>
                                    <p className="font-medium text-gray-800">{assurance.NumContrat}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <DollarSign className="h-5 w-5 text-green-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Coût de l’assurance</p>
                                    <p className="text-lg font-semibold text-green-600">
                                        {assurance.cout.toLocaleString()} MGA
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Pied de carte */}
                        <div className="mt-8 flex justify-end">
                            <Button
                                className="rounded-lg bg-gray-800 px-6 py-2 text-white transition hover:bg-gray-700"
                                onClick={() => history.back()}
                            >
                                Retour
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
