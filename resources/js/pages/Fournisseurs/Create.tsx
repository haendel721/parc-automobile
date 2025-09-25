import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { CircleAlert } from 'lucide-react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Créer un nouveaux fournisseur ',
        href: '/fournisseurs/create',
    },
];

export default function Index() {
    // const { props } = usePage();
    // const { carburants, typesfournisseurs, marques } = props; // données envoyées depuis Laravel
    const { data, setData, post, processing, errors } = useForm({
        nom: '',
        type: '',
        addresse: '',
        phone: '',
        email: '',
        siteWeb: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        console.log(data);
        e.preventDefault();
        post(route('fournisseurs.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Créer un nouveaux fournisseur" />
            <div className="w-8/12 p-4">
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4" enctype="multipart/form-data">
                    {/* display errors */}

                    {Object.keys(errors).length > 0 && (
                        <Alert>
                            <CircleAlert />
                            <AlertTitle>Errors !</AlertTitle>
                            <AlertDescription>
                                <ul>
                                    {Object.entries(errors).map(([key, message]) => (
                                        <li key={key}>{message as string}</li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}
                    <div className="gap-1.5">
                        <Label htmlFor="fournisseur nom">Nom</Label>
                        <Input
                            type="text"
                            value={data.nom}
                            onChange={(e) => setData('nom', e.target.value)}
                        />
                    </div>
                    
                    <div className="gap-1.5">
                        <Label htmlFor="fournisseur type ">Type</Label>
                        <Input type="text" placeholder="Garage" value={data.type} onChange={(e) => setData('type', e.target.value)} />
                    </div>
                    
                    <div className="gap-1.5">
                        <Label htmlFor="fournisseur address ">Addresse</Label>
                        <Input type="text" placeholder="Manjakaray" value={data.addresse} onChange={(e) => setData('addresse', e.target.value)} />
                    </div>
                    
                    <div className="gap-1.5">
                        <Label htmlFor="fournisseur numéro portable ">Numéro de téléphone</Label>
                        <Input placeholder="numéro de téléphone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                    </div>
                    <div className="gap-1.5">
                        <Label htmlFor="Année de fabrication">E-Mail</Label>
                        <Input type="string" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                    </div>
                    <div className="gap-1.5">
                        <Label htmlFor="siteWeb">Site web</Label>
                        <Input type="string" value={data.siteWeb} onChange={(e) => setData('siteWeb', e.target.value)} />
                    </div>
                    <Button disabled={processing} className="t-4" type="submit">
                        Ajouter
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
