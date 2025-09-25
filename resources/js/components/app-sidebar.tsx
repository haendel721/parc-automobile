import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, PackageSearch ,UsersRound  ,PackagePlus ,Wrench  ,Car ,Hammer,Cog ,FileSliders ,BookLock   } from 'lucide-react';
import AppLogo from './app-logo';

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
        icon: UsersRound ,
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
        icon: Wrench ,
    },
    {
        title: 'Entretien',
        href: '/entretiens',
        icon: Hammer ,
    },
    {
        title: 'Maintenance et réparations',
        href: '/maintenance',
        icon: Cog,
    },
    {
        title: 'Gestion administrative',
        href: '/gestionAdmin',
        icon: FileSliders  ,
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

            <SidebarContent className='justify-center'>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
