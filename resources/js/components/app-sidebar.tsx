import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookLock, BookOpen, Car, FileSliders, Folder, Fuel, Hammer, LayoutGrid, PackagePlus, UsersRound, Wrench } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItemsAdmin: NavItem[] = [
    {
        title: 'Tableau de bord',
        href: dashboard(),
        icon: LayoutGrid,
    },
    // {
    //     title: 'Products',
    //     href: '/products',
    //     icon: PackageSearch,
    // },
    {
        title: 'Utilisateurs',
        href: '/utilisateurs',
        icon: UsersRound,
    },
    {
        title: 'Vehicules',
        href: '/vehicules',
        icon: Car,
    },
    {
        title: 'Assurances',
        href: '/assurances',
        icon: BookLock,
    },
    {
        title: 'Fournisseur',
        href: '/fournisseurs',
        icon: PackagePlus,
    },
    {
        title: 'Pièce',
        href: '/pieces',
        icon: Wrench,
    },
    {
        title: 'Plein Carburants',
        href: '/pleinCarburants',
        icon: Fuel,
    },
    {
        title: 'Entretien et Réparations',
        href: '/entretiens',
        icon: Hammer,
    },
    {
        title: 'Gestion administrative',
        href: '/gestionAdmin',
        icon: FileSliders,
    },
];

const mainNavItemsUtilisateur: NavItem[] = [
    {
        title: 'Tableau de bord',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Plein Carburants',
        href: '/pleinCarburants',
        icon: Fuel,
    },
    {
        title: 'Entretien et Réparations',
        href: '/entretiens',
        icon: Hammer,
    },
];
const mainNavItemsMecanicien: NavItem[] = [
    {
        title: 'Tableau de bord',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Vehicules',
        href: '/vehicules',
        icon: Car,
    },
    {
        title: 'Assurances',
        href: '/assurances',
        icon: BookLock,
    },
    {
        title: 'Plein Carburants',
        href: '/pleinCarburants',
        icon: Fuel,
    },
    {
        title: 'Entretien et Réparations',
        href: '/entretiens',
        icon: Hammer,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props as any;
    let navItems = [];

    // Vérifie le rôle de l'utilisateur connecté
    if (auth?.user?.role === 'admin') {
        navItems = mainNavItemsAdmin;
    } else if (auth?.user?.role === 'mecanicien') {
        navItems = mainNavItemsMecanicien;
    } else {
        navItems = mainNavItemsUtilisateur;
    }
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="justify-center">
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
