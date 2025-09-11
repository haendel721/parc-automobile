import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function Register() {
    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />
            <Form
                {...RegisteredUserController.store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nom</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="nom"
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="name">Prenom</Label>
                                <Input
                                    id="prenom"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={2}
                                    autoComplete="prenom"
                                    name="prenom"
                                    placeholder="prenom"
                                />
                                <InputError message={errors.prenom} className="mt-2" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="name">Phone</Label>
                                <Input
                                    id="phone"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={2}
                                    autoComplete="phone"
                                    name="phone"
                                    placeholder="phone"
                                />
                                <InputError message={errors.phone} className="mt-2" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Statut</Label>
                                <Input
                                    id="statut"
                                    type="statut"
                                    required
                                    tabIndex={2}
                                    autoComplete="statut"
                                    name="statut"
                                    placeholder="En couple"
                                />
                                <InputError message={errors.statut} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Fonction</Label>
                                <Input
                                    id="fonction"
                                    type="fonction"
                                    required
                                    tabIndex={2}
                                    autoComplete="fonction"
                                    name="fonction"
                                    placeholder="Designer"
                                />
                                <InputError message={errors.fonction} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Rôle</Label>
                                <Input
                                    id="role"
                                    type="role"
                                    required
                                    tabIndex={2}
                                    autoComplete="role"
                                    name="role"
                                    placeholder="Admin"
                                />
                                <InputError message={errors.role} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">Confirm password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirm password"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <Button type="submit" className="mt-2 w-full" tabIndex={5}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Create account
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <TextLink href={login()} tabIndex={6}>
                                Log in
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
