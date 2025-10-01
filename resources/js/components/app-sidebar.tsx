import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookLock, BookOpen, Car, Cog, FileSliders, Folder, Hammer, LayoutGrid, PackagePlus, PackageSearch, UsersRound, Wrench } from 'lucide-react';
import { route } from 'ziggy-js';
import AppLogo from './app-logo';
import NotificationsDrawer from '@/components/NotificationsDrawer';

const mainNavItems: NavItem[] = [
    {
        title: 'Tableau de bord',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Products',
        href: '/products',
        icon: PackageSearch,
    },
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
        title: 'Entretien',
        href: '/entretiens',
        icon: Hammer,
    },
    {
        title: 'Maintenance et réparations',
        href: '/maintenance',
        icon: Cog,
    },
    {
        title: 'Gestion administrative',
        href: '/gestionAdmin',
        icon: FileSliders,
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
    const { unread_notifications_count, auth } = usePage().props as any;
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
            <div>
                {/* Cloche visible uniquement pour les admins */}
                {auth?.user?.role === 'admin' && (
                    <Link href={route('admin.notifications.index')} className="relative inline-block">
                        🔔
                        {unread_notifications_count > 0 && (
                            <span className="absolute -top-1 -right-3 rounded-full bg-red-600 px-1 text-xs text-white">
                                {unread_notifications_count}
                            </span>
                        )}
                    </Link>
                )}
                <div className="flex items-center gap-3">
                    {/* n'affiche la cloche que si admin (optionnel) */}
                    {auth?.user?.role === 'admin' && <NotificationsDrawer />}
                    {/* autre actions header */}
                </div>
            </div>
            <SidebarContent className="justify-center">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
