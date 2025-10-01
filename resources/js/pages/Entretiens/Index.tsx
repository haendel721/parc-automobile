import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { BellDot, SquarePen, Trash2 } from 'lucide-react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Entretien',
        href: '/entretiens',
    },
];

interface vehicule {
    immatriculation: string;
}
interface fournisseur {
    nom: string;
}
interface user {
    id: number;
    role: string;
    name: string;
}

interface entretiens {
    id: number;
    vehicule_id: number;
    fournisseur_id: number;
    user_id: number;
    type: string;
    cout: number;
    piece_remplacee: string;
    probleme: string;
    recommandation: string;
    prochaine_visite: string;
    description: string;
    dernier_visite: string;
    derniere_vidange: string;
    statut: string;

    vehicule: vehicule;
    fournisseur: fournisseur;
    user: user
}

type PageProps = {
    flash: {
        message?: string;
    };
    user: {
        id: number;
        role: string;
        name: string;
    };
    entretiens: entretiens[];
};

export default function Index() {
    const { flash, user, entretiens } = usePage<PageProps>().props;
    const { processing, delete: destroy } = useForm();
    const handleDelete = (id: number, immatriculation: string) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer l'entretien pour le vehicule: ${immatriculation} ?`)) {
            destroy(route('entretiens.destroy', id));
        }
    };
    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="entretiens" />

                <div className="m-4">
                    <Link href={route('entretiens.create')}>
                        <Button>Demander une nouvelle entretien</Button>
                    </Link>
                </div>
                <>
                    <div className="m-4">
                        <div>
                            {flash.message && (
                                <Alert>
                                    <BellDot />
                                    <AlertTitle>Notification !</AlertTitle>
                                    <AlertDescription>{flash.message}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </div>
                    {entretiens.length > 0 && (
                        <div className="m-4">
                            <Table>
                                {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Immatricule du Vehicule</TableHead>
                                        {user.role === 'admin' ? (
                                            <>
                                                <TableHead className="w-[100px]">Id</TableHead>
                                                <TableHead>Nom du fournisseur</TableHead>
                                                <TableHead>Utilisateur</TableHead>
                                                <TableHead>type d'entretien</TableHead>
                                                <TableHead>coût</TableHead>
                                                <TableHead>recommandation</TableHead>
                                                <TableHead>Pièce remplacée</TableHead>
                                                <TableHead>Dernier visite</TableHead>
                                                <TableHead>Prochaine visite</TableHead>
                                                <TableHead>Dernier vidange</TableHead>
                                            </>
                                        ) : (
                                            <>
                                                <TableHead>probleme</TableHead>
                                                <TableHead>Description</TableHead>
                                                <TableHead>Statut</TableHead>
                                                <TableHead className="text-center">Action</TableHead>
                                            </>
                                        )}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {entretiens.map((entretien) => {
                                        // const vehicule = vehicules.find((v) => v.id === entretien.vehicule_id);
                                        // const fournisseur = fournisseurs.find((f) => f.id === entretien.fournisseur_id);
                                        // const user = fournisseurs.find((u) => u.id === entretien.user_id);
                                        // console.log(vehicule);
                                        return (
                                            <TableRow key={entretien.id}>
                                                <TableCell>{entretien.vehicule?.immatriculation ?? '-'}</TableCell>
                                                {user.role === 'admin' ? (
                                                    <>
                                                        <TableCell className="font-medium">{entretien.id}</TableCell>
                                                        <TableCell>{entretien.fournisseur?.nom ?? 'Fournisseur inconnu'}</TableCell>
                                                        <TableCell>{entretien.user?.name ?? 'Utilisateur inconnu'}</TableCell>
                                                        <TableCell>{entretien.type}</TableCell>
                                                        <TableCell>{entretien.cout}</TableCell>
                                                        <TableCell>{entretien.recommandation}</TableCell>
                                                        <TableCell>{entretien.piece_remplacee}</TableCell>
                                                        <TableCell>{entretien.dernier_visite}</TableCell>
                                                        <TableCell>{entretien.prochaine_visite}</TableCell>
                                                        <TableCell>{entretien.derniere_vidange}</TableCell>
                                                    </>
                                                ) : (
                                                    <>
                                                        <TableCell>{entretien.probleme}</TableCell>
                                                        <TableCell>{entretien.description}</TableCell>
                                                        <TableCell>{entretien.statut}</TableCell>
                                                    </>
                                                )}

                                                <TableCell className="text-center">
                                                    <div className="flex justify-center gap-2">
                                                        <Link href={route('entretiens.edit', entretien.id)}>
                                                            <Button className="bg-slate-600 hover:bg-slate-700">
                                                                <SquarePen />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            disabled={processing}
                                                            onClick={() => handleDelete(entretien.id, entretien.vehicule.immatriculation)}
                                                            className="bg-red-500 hover:bg-red-700"
                                                        >
                                                            <Trash2 />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </>
            </AppLayout>
        </>
    );
}
