import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { register } from '@/routes';
import { request } from '@/routes/password';
import { Form, Head, Link } from '@inertiajs/react';
import { ArrowRight, Eye, EyeOff, LoaderCircle, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import welcomeBackground from '../../../images/back v blue.jpg';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ canResetPassword }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <Head title="Connexion - AutoPlus">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div
                className="min-h-screen bg-cover bg-center bg-no-repeat font-sans text-white"
                style={{
                    backgroundImage: `url('${welcomeBackground}')`,
                }}
            >
                <div className="flex min-h-screen bg-black/40">
                    <div className="flex flex-1 items-center justify-center px-4">
                        <div className="w-full max-w-2xl rounded-2xl border border-white/20 bg-gradient-to-br from-gray-900/80 to-gray-800/20 p-8 backdrop-blur-sm sm:p-12 lg:p-16">
                            {/* Icône maison en haut à gauche */}
                            <div className="absolute top-6 left-6 text-blue-400">
                                <Link href="/" className="transition-transform hover:scale-110 hover:text-blue-500">
                                    <svg
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="transition-transform hover:scale-110 hover:text-blue-500"
                                    >
                                        <path
                                            d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </Link>
                            </div>

                            <div className="mb-10 text-center">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-center gap-5">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                            <path
                                                d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                        <h2 className="text-2xl font-bold text-white sm:text-3xl">Connexion</h2>
                                    </div>

                                    <p className="text-sm text-gray-100 sm:text-base">Connectez-vous pour accéder à votre espace</p>
                                </div>
                            </div>

                            <Form {...AuthenticatedSessionController.store.form()} resetOnSuccess={['password']} className="space-y-6">
                                {({ processing, errors }) => (
                                    <>
                                        {/* Champ email */}
                                        <div className="space-y-3">
                                            <Label htmlFor="email" className="text-sm font-medium text-white">
                                                E-mail
                                            </Label>
                                            <div className="relative">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <Mail className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    required
                                                    autoFocus
                                                    tabIndex={1}
                                                    autoComplete="email"
                                                    placeholder="votre@email.com"
                                                    className="h-12 border-gray-800 bg-gray-900 pl-10 text-white transition-all duration-200 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                                />
                                            </div>
                                            <InputError message={errors.email} />
                                        </div>

                                        {/* Champ mot de passe */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="password" className="text-sm font-medium text-white">
                                                    Mot de passe
                                                </Label>
                                                {canResetPassword && (
                                                    <TextLink
                                                        href={request()}
                                                        className="text-xs text-blue-400 transition-colors hover:text-blue-300"
                                                        tabIndex={5}
                                                    >
                                                        Mot de passe oublié ?
                                                    </TextLink>
                                                )}
                                            </div>
                                            <div className="relative">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <Lock className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <Input
                                                    id="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="password"
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="current-password"
                                                    placeholder="Votre mot de passe"
                                                    className="h-12 border-gray-800 bg-gray-900 pr-10 pl-10 text-white transition-all duration-200 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute inset-y-0 right-0 flex items-center rounded-md p-1 pr-3 transition-colors hover:bg-gray-800"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    aria-label={showPassword ? 'Cacher le mot de passe' : 'Afficher le mot de passe'}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                                                    ) : (
                                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                                                    )}
                                                </button>
                                            </div>
                                            <InputError message={errors.password} />
                                        </div>

                                        {/* Remember me */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <Checkbox
                                                    id="remember"
                                                    name="remember"
                                                    tabIndex={3}
                                                    className="border-gray-700 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                                                />
                                                <Label htmlFor="remember" className="cursor-pointer text-sm text-gray-300 select-none">
                                                    Se souvenir de moi
                                                </Label>
                                            </div>
                                        </div>

                                        {/* Bouton de connexion */}
                                        <Button
                                            type="submit"
                                            className="group h-12 w-full transform bg-gradient-to-r from-blue-600 to-blue-700 font-medium text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-lg"
                                            tabIndex={4}
                                            disabled={processing}
                                        >
                                            {processing ? (
                                                <span className="flex items-center justify-center">
                                                    <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                                                    Connexion en cours...
                                                </span>
                                            ) : (
                                                <span className="flex items-center justify-center">
                                                    Se connecter
                                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                </span>
                                            )}
                                        </Button>

                                        {/* Séparateur */}
                                        <div className="relative my-6">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-gray-800"></div>
                                            </div>
                                            <div className="relative flex justify-center text-sm">
                                                <span className="bg-gray-950 px-4 text-gray-500">Nouveau client ?</span>
                                            </div>
                                        </div>

                                        {/* Lien d'inscription */}
                                        <div className="flex text-center">
                                            <TextLink
                                                href={register()}
                                                tabIndex={5}
                                                className="inline-flex w-full items-center justify-center rounded-lg border border-gray-800 px-6 py-3 font-medium text-gray-400 transition-colors hover:border-gray-700 hover:bg-gray-900/50 hover:text-white"
                                            >
                                                Créer un compte
                                            </TextLink>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
