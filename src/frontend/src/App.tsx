import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import DashboardPage from './pages/DashboardPage';
import ContentGeneratorPage from './pages/ContentGeneratorPage';
import ContentDetailPage from './pages/ContentDetailPage';
import LeadsListPage from './pages/LeadsListPage';
import LeadDetailPage from './pages/LeadDetailPage';
import PublicLandingPage from './pages/PublicLandingPage';
import LeadConfirmationPage from './pages/LeadConfirmationPage';
import AppLayout from './components/layout/AppLayout';
import ProfileSetupDialog from './components/auth/ProfileSetupDialog';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

function AuthenticatedLayout() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  
  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5">
        <div className="text-center space-y-6 p-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Ford Lead Studio</h1>
            <p className="text-muted-foreground text-lg">Please sign in to continue</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <AppLayout>
        <Outlet />
      </AppLayout>
      {showProfileSetup && <ProfileSetupDialog />}
    </>
  );
}

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster />
    </>
  ),
});

const authenticatedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'authenticated',
  component: AuthenticatedLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/',
  component: DashboardPage,
});

const contentGeneratorRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/content/new',
  component: ContentGeneratorPage,
});

const contentDetailRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/content/$id',
  component: ContentDetailPage,
});

const leadsListRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/leads',
  component: LeadsListPage,
});

const leadDetailRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/leads/$id',
  component: LeadDetailPage,
});

const publicLandingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/landing/$id',
  component: PublicLandingPage,
});

const confirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/confirmation',
  component: LeadConfirmationPage,
});

const routeTree = rootRoute.addChildren([
  authenticatedRoute.addChildren([
    dashboardRoute,
    contentGeneratorRoute,
    contentDetailRoute,
    leadsListRoute,
    leadDetailRoute,
  ]),
  publicLandingRoute,
  confirmationRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
