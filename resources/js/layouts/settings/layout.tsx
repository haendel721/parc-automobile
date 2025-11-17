import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { appearance } from '@/routes';
import { edit as editPassword } from '@/routes/password';
import { edit } from '@/routes/profile';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { 
  User, 
  Lock, 
  Palette,
  ChevronRight,
  Settings2
} from 'lucide-react';

const sidebarNavItems: NavItem[] = [
  {
    title: 'Profil',
    href: edit(),
    icon: User,
  },
  {
    title: 'Mot de passe',
    href: editPassword(),
    icon: Lock,
  },
//   {
//     title: 'Apparence',
//     href: appearance(),
//     icon: Palette,
//   },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
  // When server-side rendering, we only render the layout on the client...
  if (typeof window === 'undefined') {
    return null;
  }

  const currentPath = window.location.pathname;

  return (
    <div className="min-h-screen  px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <Settings2 className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <Heading 
              title="Paramètre" 
              description="Gérez votre profil et les paramètres de votre compte"
              className="text-white"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation - Modern Card Design */}
          <aside className="w-full lg:w-64">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 shadow-2xl">
              <nav className="space-y-2">
                {sidebarNavItems.map((item, index) => {
                  const isActive = currentPath === (typeof item.href === 'string' ? item.href : item.href.url);
                  
                  return (
                    <Button
                      key={`${typeof item.href === 'string' ? item.href : item.href.url}-${index}`}
                      size="lg"
                      variant="ghost"
                      asChild
                      className={cn(
                        'w-full justify-start group transition-all duration-200 rounded-xl border-2 border-transparent',
                        {
                          'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 shadow-lg shadow-blue-500/10': isActive,
                          'hover:bg-gray-700/50 hover:border-gray-600/50 hover:shadow-lg': !isActive,
                        }
                      )}
                    >
                      <Link href={item.href} prefetch className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {item.icon && (
                            <div className={cn(
                              'p-2 rounded-lg transition-colors duration-200',
                              {
                                'bg-blue-500/20 text-blue-400': isActive,
                                'bg-gray-700/50 text-gray-400 group-hover:text-gray-300': !isActive,
                              }
                            )}>
                              <item.icon className="h-4 w-4" />
                            </div>
                          )}
                          <span className={cn(
                            'font-medium transition-colors duration-200',
                            {
                              'text-white': isActive,
                              'text-gray-400 group-hover:text-gray-300': !isActive,
                            }
                          )}>
                            {item.title}
                          </span>
                        </div>
                        <ChevronRight className={cn(
                          'h-4 w-4 transition-all duration-200',
                          {
                            'text-blue-400': isActive,
                            'text-gray-500 group-hover:text-gray-400': !isActive,
                            'opacity-0 group-hover:opacity-100': !isActive,
                          }
                        )} />
                      </Link>
                    </Button>
                  );
                })}
              </nav>
              
              {/* Additional Info Section */}
              <div className="mt-8 p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
                <p className="text-xs text-gray-400 text-center">
                  Gestion sécurisée et privée des paramètres
                </p>
              </div>
            </div>
          </aside>

          {/* Mobile Separator */}
          <Separator className="my-6 lg:hidden bg-gray-700/50" />

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 lg:p-8 shadow-2xl">
              <section className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {sidebarNavItems.find(item => 
                        currentPath === (typeof item.href === 'string' ? item.href : item.href.url)
                      )?.title || 'Settings'}
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Configure your preferences and security settings
                    </p>
                  </div>
                  <div className="hidden lg:block">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Content Container */}
                <div className="bg-gray-900/30 rounded-xl border border-gray-700/30 p-6">
                  {children}
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Your privacy and security are our top priority
          </p>
        </div>
      </div>
    </div>
  );
}