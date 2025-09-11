import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { CircleAlert } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create a new product',
        href: '/products/create',
    },
];

export default function Index() {
    const {data, setData, post, processing, errors} = useForm({
        name: '',
        price: '',
        description: ''
    }); 
        
    const handleSubmit = (e: React.FormEvent) => {
        console.log(data);
        e.preventDefault();
        post(route('products.store'));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create a new product" />
            <div className='w-8/12 p-4'>
                <form onSubmit={handleSubmit} className='space-y-4 flex flex-col'>
                    {/* display errors */}

                    {Object.keys(errors).length > 0 && (
                        <Alert >
                        <CircleAlert />
                        <AlertTitle>Errors !</AlertTitle>
                        <AlertDescription>
                            <ul>
                                {Object.entries(errors).map(([key,message]) => (
                                    <li key={key}>{message as string}</li>
                                ))}
                            </ul>
                        </AlertDescription>
                        </Alert>
                    )}
                    <div className='gap-1.5'>
                        <Label htmlFor='product name '>Name</Label>
                        <Input type="text" placeholder='name' value={data.name} onChange={(e)=>setData('name',e.target.value)} />
                    </div>
                    <div className='gap-1.5'>
                        <Label htmlFor='product price '>Price</Label>
                        <Input type="text" placeholder='price' value={data.price} onChange={(e)=>setData('price',e.target.value)} />
                    </div>
                    <div className='gap-1.5'>
                        <Label htmlFor='product description '>description</Label>
                        <Textarea placeholder='description' value={data.description} onChange={(e)=>setData('description',e.target.value)} />
                    </div>
                    <Button disabled={processing} className='t-4' type='submit'>Add product</Button>
                </form>
            </div>
            
        </AppLayout>
    );
}
