import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/routes/verification';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';
import { 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Shield,
  BadgeCheck,
  Save,
  CheckCircle2
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Profile settings',
    href: edit().url,
  },
];

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
  const { auth } = usePage<SharedData>().props;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Profile settings" />

      <SettingsLayout>
        <div className="space-y-8">
          {/* Header Section */}
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <User className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <HeadingSmall 
                title="Profile Information" 
                description="Manage your personal and professional details"
                className="text-white"
              />
            </div>
          </div>

          <Form
            {...ProfileController.update.form()}
            options={{
              preserveScroll: true,
            }}
            className="space-y-8"
          >
            {({ processing, recentlySuccessful, errors }) => (
              <>
                {/* Personal Information Grid */}
                <div className="bg-gray-800/30 rounded-2xl border border-gray-700/50 p-6">
                  <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-400" />
                    Personal Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-300 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        First Name
                      </Label>
                      <Input
                        id="name"
                        className="bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-blue-500/20 transition-all duration-200"
                        defaultValue={auth.user.name}
                        name="name"
                        required
                        autoComplete="name"
                        placeholder="Enter your first name"
                      />
                      <InputError className="mt-1" message={errors.name} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="prenom" className="text-gray-300 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Last Name
                      </Label>
                      <Input
                        id="prenom"
                        className="bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-blue-500/20 transition-all duration-200"
                        defaultValue={auth.user.prenom}
                        name="prenom"
                        required
                        autoComplete="family-name"
                        placeholder="Enter your last name"
                      />
                      <InputError className="mt-1" message={errors.prenom} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-300 flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        className="bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-blue-500/20 transition-all duration-200"
                        defaultValue={auth.user.phone}
                        name="phone"
                        required
                        autoComplete="tel"
                        placeholder="+1 (555) 000-0000"
                      />
                      <InputError className="mt-1" message={errors.phone} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300 flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        className="bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-blue-500/20 transition-all duration-200"
                        defaultValue={auth.user.email}
                        name="email"
                        required
                        autoComplete="email"
                        placeholder="your.email@example.com"
                      />
                      <InputError className="mt-1" message={errors.email} />
                    </div>
                  </div>
                </div>

                {/* Professional Information Grid */}
                <div className="bg-gray-800/30 rounded-2xl border border-gray-700/50 p-6">
                  <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-green-400" />
                    Professional Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="statut" className="text-gray-300 flex items-center gap-2">
                        <BadgeCheck className="h-4 w-4" />
                        Status
                      </Label>
                      <Input
                        id="statut"
                        className="bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-blue-500/20 transition-all duration-200"
                        defaultValue={auth.user.statut}
                        name="statut"
                        required
                        autoComplete="off"
                        placeholder="Your current status"
                      />
                      <InputError className="mt-1" message={errors.statut} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fonction" className="text-gray-300 flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        Position
                      </Label>
                      <Input
                        id="fonction"
                        className="bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-blue-500/20 transition-all duration-200"
                        defaultValue={auth.user.fonction}
                        name="fonction"
                        required
                        autoComplete="organization-title"
                        placeholder="Your job title"
                      />
                      <InputError className="mt-1" message={errors.fonction} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-gray-300 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Role
                      </Label>
                      <Input
                        id="role"
                        className="bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-blue-500/20 transition-all duration-200"
                        defaultValue={auth.user.role}
                        name="role"
                        required
                        disabled
                        autoComplete="off"
                        placeholder="Your role"
                      />
                      <InputError className="mt-1" message={errors.role} />
                    </div>
                  </div>
                </div>

                {/* Email Verification Section */}
                {mustVerifyEmail && auth.user.email_verified_at === null && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-yellow-400 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-yellow-400 font-semibold mb-2">
                          Email Verification Required
                        </h4>
                        <p className="text-yellow-300/80 text-sm mb-3">
                          Your email address is unverified. Please verify your email to access all features.
                        </p>
                        <Link
                          href={send()}
                          as="button"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 rounded-lg text-yellow-300 text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-yellow-500/10"
                        >
                          <Mail className="h-4 w-4" />
                          Resend Verification Email
                        </Link>
                      </div>
                    </div>

                    {status === 'verification-link-sent' && (
                      <Transition
                        show={true}
                        enter="transition-all duration-300 ease-out"
                        enterFrom="opacity-0 translate-y-2"
                        enterTo="opacity-100 translate-y-0"
                        className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
                      >
                        <div className="flex items-center gap-2 text-green-400 text-sm">
                          <CheckCircle2 className="h-4 w-4" />
                          A new verification link has been sent to your email address.
                        </div>
                      </Transition>
                    )}
                  </div>
                )}

                {/* Save Button Section */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-700/50">
                  <div className="flex items-center gap-4">
                    <Button 
                      disabled={processing} 
                      className="relative overflow-hidden group"
                    >
                      <div className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        {processing ? 'Enregistrement...' : 'Enregistrer les modifications'}
                      </div>
                      <div className="absolute inset-0  text-white bg-blue-700/20 hover:bg-blue-700/40 group-hover:opacity-100 transition-opacity duration-300" />
                    </Button>

                    <Transition
                      show={recentlySuccessful}
                      enter="transition-all duration-300 ease-out"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="transition-all duration-300 ease-in"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <div className="flex items-center gap-2 text-green-400 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-lg">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-sm font-medium">Modifications enregistrées avec succès</span>
                      </div>
                    </Transition>
                  </div>

                  <div className="text-xs text-gray-500 hidden sm:block">
                    Last updated: {new Date().toLocaleDateString()}
                  </div>
                </div>
              </>
            )}
          </Form>

          {/* Account Management Section */}
          <div className="pt-8 border-t border-gray-700/50">
            <DeleteUser />
          </div>
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}