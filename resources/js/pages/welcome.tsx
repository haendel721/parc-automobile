// import Login from '@/Pages/Auth/Login';
// import Register from '@/Pages/Auth/Register';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import welcomeBackground from '../../images/back v blue.jpg';
import dgsr from '../../images/dgsr-removebg-preview.png';
export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    // const [showLogin, setShowLogin] = useState(false);
    // const [showRegister, setShowRegister] = useState(false);
    const [showAcceuil, setShowAcceuil] = useState(true);
    const [activeButton, setActiveButton] = useState('accueil');

    return (
        <>
            <Head title="Bienvenue">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div
                className="min-h-screen bg-cover bg-center bg-no-repeat font-sans text-white"
                style={{
                    backgroundImage: `url('${welcomeBackground}')`,
                }}
            >
                {/* Overlay sombre pour améliorer la lisibilité */}
                <div className="min-h-screen bg-black/85">
                    {/* Navigation */}
                    <header className="px-8 py-4">
                        <nav className="flex items-center justify-between">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-2 shadow-sm">
                                <img src={`${dgsr}`} alt="Logo dgsr" className="h-10 w-10 object-contain" />
                            </div>

                            <div className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="rounded-lg bg-blue-600 px-6 py-2 font-medium transition-colors hover:bg-blue-700"
                                    >
                                        Tableau de bord
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            onClick={() => {
                                                setShowAcceuil(true);
                                                // setShowLogin(false);
                                                setActiveButton('accueil');
                                            }}
                                            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors sm:px-6 sm:text-base ${
                                                activeButton === 'accueil'
                                                    ? 'border-blue-600 bg-blue-600 text-white' // bouton actif
                                                    : 'border-gray-300 text-white hover:border-blue-400 hover:bg-white/10' // normal
                                            }`}
                                        >
                                            Accueil
                                        </Link>

                                        {auth.user ? (
                                            ''
                                        ) : (
                                            <>
                                                <Link
                                                    href={login()}
                                                    // onClick={(e) => {
                                                    //     e.preventDefault();
                                                    //     setShowAcceuil(false);
                                                    //     setShowRegister(false);
                                                    //     setShowLogin(true);
                                                    //     setActiveButton('connexion');
                                                    // }}
                                                    className={`rounded-lg border px-6 py-2 font-medium transition-colors ${
                                                        activeButton === 'connexion'
                                                            ? 'border-blue-600 bg-blue-600 text-white'
                                                            : 'border-gray-300 text-white hover:border-blue-400 hover:bg-white/10'
                                                    }`}
                                                >
                                                    Connexion
                                                </Link>
                                                <Link
                                                    href={register()}
                                                    // onClick={(e) => {
                                                    //     e.preventDefault();
                                                    //     setShowAcceuil(false);
                                                    //     setShowRegister(true);
                                                    //     setShowLogin(false);
                                                    //     setActiveButton('inscription');
                                                    // }}
                                                    className={`rounded-lg px-6 py-2 font-medium transition-colors ${
                                                        activeButton === 'inscription'
                                                            ? 'bg-blue-600'
                                                            : 'border border-gray-300 bg-transparent text-white hover:border-blue-400 hover:bg-white/10'
                                                    }`}
                                                >
                                                    Inscription
                                                </Link>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </nav>
                    </header>

                    {showAcceuil ? (
                        <main className="flex flex-col items-center justify-center px-4 pt-20 pb-32 text-center">
                            <h1 className="mb-6 text-4xl font-bold md:text-6xl">
                                Gérez votre flotte de véhicules <span className="text-blue-400">efficacement</span>
                            </h1>

                            <p className="mb-12 max-w-3xl text-xl leading-relaxed text-gray-100 md:text-2xl">
                                Optimisez la gestion de vos véhicules dès aujourd’hui ! Confiez-les à notre parc automobile pour un suivi complet
                                incluant l’assurance, l’entretien et la maintenance, en toute tranquillité.
                            </p>
                            <div className="mt-10 grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                                <div className="rounded-lg bg-gray-800 p-6 transition-colors hover:bg-gray-700">
                                    <div className="mb-4 flex justify-center text-3xl">
                                        <svg className="h-12 w-12 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                                        </svg>
                                    </div>
                                    <p className="text-center text-gray-400">Gestion des véhicules</p>
                                </div>

                                <div className="rounded-lg bg-gray-800 p-6 transition-colors hover:bg-gray-700">
                                    <div className="mb-4 flex justify-center text-3xl">
                                        <svg className="h-12 w-12 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                                        </svg>
                                    </div>
                                    <p className="text-center text-gray-400">Gestion des assurances des véhicules</p>
                                </div>

                                <div className="rounded-lg bg-gray-800 p-6 transition-colors hover:bg-gray-700">
                                    <div className="mb-4 flex justify-center text-3xl">
                                        <svg className="h-12 w-12 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
                                        </svg>
                                    </div>
                                    <p className="text-center text-gray-400">Gestion des entretiens</p>
                                </div>

                                <div className="rounded-lg bg-gray-800 p-6 transition-colors hover:bg-gray-700">
                                    <div className="mb-4 flex justify-center text-3xl">
                                        <svg className="h-12 w-12 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77zM12 10H6V5h6v5zm6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
                                        </svg>
                                    </div>
                                    <p className="text-center text-gray-400">Gestion du plein carburant</p>
                                </div>
                            </div>
                        </main>
                    ) : (
                        ''
                    )}
{/* 
                    {showLogin ? <Login canResetPassword={true} /> : ''}
                    {showRegister ? <Register /> : ''} */}
                    {/* Footer */}
                    <footer className="mt-5 border-t border-white/20 py-8 text-center text-gray-300">
                        <div className="mx-auto max-w-6xl px-4">
                            <p>© 2025 Haendel. Tous droits réservés.</p>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
}
