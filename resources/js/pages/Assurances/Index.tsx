import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import IndexAdmin from '../Assurances/IndexAdmin';
import IndexUser from '../Assurances/IndexUser';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Assurances',
        href: '/assurances',
    },
];
type assurances = {
    id: number;
    vehicule_id: number;
    NomCompagnie: number;
    NumContrat: string;
    cout: number;
    dateDebut: string;
    dateFin: number;
};
type vehicule = {
    id: number;
    immatriculation: string;
}
interface roleUser {
    role: string;
}
type PageProps = {
    assurances: assurances[];
    roleUser: roleUser;
    flash: {
        message?: string;
    };
    vehicule: vehicule [];
};

export default function Index() {
    const { roleUser, assurances , vehicule } = usePage<PageProps>().props;
    // console.log('roleUser', roleUser.role , '\nAssurance : ' + assurances , '\nVehicule :' + vehicule);
    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Assurance" />

                <div className="m-4">
                    <Link href={route('assurances.create')}>
                        <Button>Nouvel assurance</Button>
                    </Link>
                </div>
                {roleUser.role === 'admin' ? <IndexAdmin assurances={assurances} /> : <IndexUser assurances={assurances} />}
            </AppLayout>
        </>
    );
}
