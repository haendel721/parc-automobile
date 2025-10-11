import { Breadcrumbs } from '@/components/breadcrumbs';
import NotificationsDrawer from '@/components/NotificationsDrawer';
import { Button } from '@/components/ui/button'; // ✅ pour les boutons shadcn/ui
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Link } from '@inertiajs/react'; // ✅ pour la navigation Inertia
import { route } from 'ziggy-js';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    return (
        <>
            <header className="flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
                {/* 🧭 Partie gauche : sidebar + fil d’Ariane */}
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="-ml-1" />
                    <Link href={route('vehicules.index')}>
                        <Button variant="outline" className="text-sm">
                            Véhicules
                        </Button>
                    </Link>
                    <Link href={route('assurances.index')}>
                        <Button variant="outline" className="text-sm">
                            Assurances
                        </Button>
                    </Link>
                </div>

                {/* 🚗 Partie droite : boutons d’action */}
                <div className="flex items-center gap-2">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
                <NotificationsDrawer />
            </header>
            {/* <hr /> */}
        </>
    );
}
