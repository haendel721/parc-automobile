import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';
import welcomeBackground from '../../../images/back v blue.jpg';
export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <div
                    className="relative min-h-screen bg-cover bg-fixed bg-center bg-no-repeat font-sans text-white"
                    style={{
                        backgroundImage: `url('${welcomeBackground}')`,
                    }}
                >
                    {/* Overlay moderne */}
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-[1px]"></div>

                    {/* Contenu */}
                    <div className="relative">
                        {/* Header fixe */}
                        <div className="bg-gray-900/80">
                            <AppSidebarHeader breadcrumbs={breadcrumbs} />
                        </div>

                        {/* Contenu scrollable */}
                        <div className="pt-4">
                            {/* Padding pour compenser le header fixe */}
                            {children}
                        </div>
                    </div>
                </div>
            </AppContent>
        </AppShell>
    );
}
