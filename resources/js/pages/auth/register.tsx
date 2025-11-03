import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { login } from '@/routes';
import { Form, Head, Link } from '@inertiajs/react';
import { ArrowRight, Briefcase, Eye, EyeOff, Heart, LoaderCircle, Lock, Mail, Phone, User } from 'lucide-react';
import { useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import welcomeBackground from '../../../images/back v blue.jpg';
export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <>
            <Head title="Créer un compte - AutoPlus">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div
                className="min-h-screen bg-cover bg-center bg-no-repeat font-sans text-white"
                style={{
                    backgroundImage: `url('${welcomeBackground}')`,
                }}
            >
                <div className="flex h-full min-h-screen bg-black/40">
                    <div className="flex flex-1 items-center justify-center px-4">
                        <div className="w-full max-w-2xl rounded-2xl border border-white/20 bg-gradient-to-br from-gray-900/80 to-gray-800/20 p-8 backdrop-blur-sm sm:p-12 lg:p-16">
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
                            </div>{' '}
                            <div className="mb-10 text-center">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-center gap-5">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                            <path
                                                d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                            <path
                                                d="M20 8V14"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                            <path
                                                d="M23 11H17"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                        <h2 className="text-2xl font-bold text-white sm:text-3xl">Créer un compte</h2>
                                    </div>

                                    <p className="text-sm text-gray-100 sm:text-base">Entrez vos coordonnées ci-dessous pour créer votre compte</p>
                                </div>
                            </div>
                            <Form
                                {...RegisteredUserController.store.form()}
                                resetOnSuccess={['password', 'password_confirmation']}
                                disableWhileProcessing
                                className="space-y-6"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        {/* Grille pour Nom et Prénom */}
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            {/* Champ Nom */}
                                            <div className="space-y-3">
                                                <Label htmlFor="name" className="text-sm font-medium text-white">
                                                    Nom
                                                </Label>
                                                <div className="relative">
                                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                        <User className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <Input
                                                        id="name"
                                                        type="text"
                                                        required
                                                        autoFocus
                                                        tabIndex={1}
                                                        autoComplete="name"
                                                        name="name"
                                                        placeholder="Votre nom"
                                                        className="h-12 border-gray-800 bg-gray-900 pl-10 text-white transition-all duration-200 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                                    />
                                                </div>
                                                <InputError message={errors.name} />
                                            </div>

                                            {/* Champ Prénom */}
                                            <div className="space-y-3">
                                                <Label htmlFor="prenom" className="text-sm font-medium text-white">
                                                    Prénom
                                                </Label>
                                                <div className="relative">
                                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                        <User className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <Input
                                                        id="prenom"
                                                        type="text"
                                                        required
                                                        tabIndex={2}
                                                        autoComplete="given-name"
                                                        name="prenom"
                                                        placeholder="Votre prénom"
                                                        className="h-12 border-gray-800 bg-gray-900 pl-10 text-white transition-all duration-200 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                                    />
                                                </div>
                                                <InputError message={errors.prenom} />
                                            </div>
                                        </div>

                                        {/* Grille pour Téléphone et Email */}
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            {/* Champ Téléphone */}
                                            <div className="space-y-3">
                                                <Label htmlFor="phone" className="text-sm font-medium text-white">
                                                    Téléphone
                                                </Label>
                                                <div className="relative">
                                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                        <Phone className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <Input
                                                        id="phone"
                                                        type="tel"
                                                        required
                                                        tabIndex={3}
                                                        autoComplete="tel"
                                                        name="phone"
                                                        placeholder="784651..."
                                                        className="h-12 border-gray-800 bg-gray-900 pl-10 text-white transition-all duration-200 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                                    />
                                                </div>
                                                <InputError message={errors.phone} />
                                            </div>

                                            {/* Champ Email */}
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
                                                        required
                                                        tabIndex={4}
                                                        autoComplete="email"
                                                        name="email"
                                                        placeholder="email@example.com"
                                                        className="h-12 border-gray-800 bg-gray-900 pl-10 text-white transition-all duration-200 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                                    />
                                                </div>
                                                <InputError message={errors.email} />
                                            </div>
                                        </div>

                                        {/* Grille pour Statut et Fonction */}
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            {/* Champ Statut */}
                                            <div className="space-y-3">
                                                <Label htmlFor="statut" className="text-sm font-medium text-white">
                                                    Statut
                                                </Label>
                                                <div className="relative">
                                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                        <Heart className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <Input
                                                        id="statut"
                                                        type="text"
                                                        required
                                                        tabIndex={5}
                                                        autoComplete="off"
                                                        name="statut"
                                                        placeholder="En couple"
                                                        className="h-12 border-gray-800 bg-gray-900 pl-10 text-white transition-all duration-200 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                                    />
                                                </div>
                                                <InputError message={errors.statut} />
                                            </div>

                                            {/* Champ Fonction */}
                                            <div className="space-y-3">
                                                <Label htmlFor="fonction" className="text-sm font-medium text-white">
                                                    Fonction
                                                </Label>
                                                <div className="relative">
                                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                        <Briefcase className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <Input
                                                        id="fonction"
                                                        type="text"
                                                        required
                                                        tabIndex={6}
                                                        autoComplete="organization-title"
                                                        name="fonction"
                                                        placeholder="Designer"
                                                        className="h-12 border-gray-800 bg-gray-900 pl-10 text-white transition-all duration-200 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                                    />
                                                </div>
                                                <InputError message={errors.fonction} />
                                            </div>
                                        </div>

                                        {/* Champ Rôle caché */}
                                        <Input type="hidden" id="role" required autoComplete="role" value={'utilisateur'} name="role" />

                                        {/* Grille pour Mot de passe et Confirmation */}
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            {/* Champ Mot de passe */}
                                            <div className="space-y-3">
                                                <Label htmlFor="password" className="text-sm font-medium text-white">
                                                    Mot de passe
                                                </Label>
                                                <div className="relative">
                                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                        <Lock className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <Input
                                                        id="password"
                                                        type={showPassword ? 'text' : 'password'}
                                                        required
                                                        tabIndex={7}
                                                        autoComplete="new-password"
                                                        name="password"
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

                                            {/* Champ Confirmation mot de passe */}
                                            <div className="space-y-3">
                                                <Label htmlFor="password_confirmation" className="text-sm font-medium text-white">
                                                    Confirmer le mot de passe
                                                </Label>
                                                <div className="relative">
                                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                        <Lock className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <Input
                                                        id="password_confirmation"
                                                        type={showConfirmPassword ? 'text' : 'password'}
                                                        required
                                                        tabIndex={8}
                                                        autoComplete="new-password"
                                                        name="password_confirmation"
                                                        placeholder="Confirmer le mot de passe"
                                                        className="h-12 border-gray-800 bg-gray-900 pr-10 pl-10 text-white transition-all duration-200 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute inset-y-0 right-0 flex items-center rounded-md p-1 pr-3 transition-colors hover:bg-gray-800"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        aria-label={showConfirmPassword ? 'Cacher le mot de passe' : 'Afficher le mot de passe'}
                                                    >
                                                        {showConfirmPassword ? (
                                                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                                                        ) : (
                                                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                                                        )}
                                                    </button>
                                                </div>
                                                <InputError message={errors.password_confirmation} />
                                            </div>
                                        </div>

                                        {/* Bouton d'inscription */}
                                        <Button
                                            type="submit"
                                            className="group h-12 w-full transform bg-gradient-to-r from-blue-600 to-blue-700 font-medium text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-lg"
                                            tabIndex={9}
                                            disabled={processing}
                                        >
                                            {processing ? (
                                                <span className="flex items-center justify-center">
                                                    <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                                                    Création du compte...
                                                </span>
                                            ) : (
                                                <span className="flex items-center justify-center">
                                                    Créer un compte
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
                                                <span className="bg-gray-950 px-4 text-gray-500">Déjà un compte ?</span>
                                            </div>
                                        </div>

                                        {/* Lien de connexion */}
                                        <div className="text-center">
                                            <TextLink
                                                href={login()}
                                                tabIndex={10}
                                                className="inline-flex w-full items-center justify-center rounded-lg border border-gray-800 px-6 py-3 font-medium text-gray-400 transition-colors hover:border-gray-700 hover:bg-gray-900/50 hover:text-white"
                                            >
                                                Se connecter
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
