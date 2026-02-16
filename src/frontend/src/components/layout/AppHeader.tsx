import { Link, useNavigate } from '@tanstack/react-router';
import LoginButton from '../auth/LoginButton';
import { useGetCallerUserProfile } from '../../hooks/useQueries';
import { LayoutDashboard, FileText, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AppHeader() {
  const navigate = useNavigate();
  const { data: userProfile } = useGetCallerUserProfile();

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/assets/generated/ford-lead-studio-logo.dim_512x512.png"
                alt="Ford Lead Studio"
                className="h-10 w-auto"
              />
            </Link>
            <nav className="hidden md:flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: '/' })}
                className="gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: '/content/new' })}
                className="gap-2"
              >
                <FileText className="w-4 h-4" />
                Create Content
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: '/leads' })}
                className="gap-2"
              >
                <Users className="w-4 h-4" />
                Leads
              </Button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {userProfile && (
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {userProfile.name}
              </span>
            )}
            <LoginButton />
          </div>
        </div>
      </div>
    </header>
  );
}
