import { useGetAllContentPackages, useGetAllLeads } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { FileText, Users, TrendingUp, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LeadStatus } from '../backend';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: contentPackages = [], isLoading: packagesLoading } = useGetAllContentPackages();
  const { data: leads = [], isLoading: leadsLoading } = useGetAllLeads();

  const leadsByPackage = leads.reduce((acc, lead) => {
    const key = lead.contentPackageId.toString();
    if (!acc[key]) acc[key] = [];
    acc[key].push(lead);
    return acc;
  }, {} as Record<string, typeof leads>);

  const topContent = contentPackages
    .map((pkg) => ({
      ...pkg,
      leadCount: leadsByPackage[pkg.id.toString()]?.length || 0,
    }))
    .sort((a, b) => b.leadCount - a.leadCount)
    .slice(0, 5);

  const getStatusColor = (status: LeadStatus) => {
    const colors: Record<LeadStatus, string> = {
      [LeadStatus.new_]: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
      [LeadStatus.contacted]: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
      [LeadStatus.qualified]: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
      [LeadStatus.testDriveScheduled]: 'bg-green-500/10 text-green-700 dark:text-green-400',
      [LeadStatus.won]: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
      [LeadStatus.lost]: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
    };
    return colors[status] || colors[LeadStatus.new_];
  };

  const formatStatus = (status: LeadStatus) => {
    const labels: Record<LeadStatus, string> = {
      [LeadStatus.new_]: 'New',
      [LeadStatus.contacted]: 'Contacted',
      [LeadStatus.qualified]: 'Qualified',
      [LeadStatus.testDriveScheduled]: 'Test Drive',
      [LeadStatus.won]: 'Won',
      [LeadStatus.lost]: 'Lost',
    };
    return labels[status] || 'Unknown';
  };

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border">
        <div className="absolute inset-0 opacity-10">
          <img
            src="/assets/generated/dealership-hero.dim_1600x900.png"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Welcome to Ford Lead Studio
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-6">
            Create compelling social media content, manage video assets, and track leads all in one place.
          </p>
          <Button size="lg" onClick={() => navigate({ to: '/content/new' })}>
            <Plus className="w-5 h-5 mr-2" />
            Create New Content
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Content</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {packagesLoading ? '...' : contentPackages.length}
            </div>
            <p className="text-xs text-muted-foreground">Content packages created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadsLoading ? '...' : leads.length}</div>
            <p className="text-xs text-muted-foreground">Leads captured</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contentPackages.length > 0
                ? `${((leads.length / contentPackages.length) * 100).toFixed(1)}%`
                : '0%'}
            </div>
            <p className="text-xs text-muted-foreground">Leads per content</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Content by Leads</CardTitle>
          <CardDescription>Content packages generating the most leads</CardDescription>
        </CardHeader>
        <CardContent>
          {topContent.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No content packages yet. Create your first one to get started!
            </p>
          ) : (
            <div className="space-y-4">
              {topContent.map((pkg) => (
                <div
                  key={pkg.id.toString()}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => navigate({ to: '/content/$id', params: { id: pkg.id.toString() } })}
                >
                  <div className="flex-1">
                    <p className="font-medium line-clamp-1">{pkg.caption}</p>
                    <p className="text-sm text-muted-foreground">
                      {pkg.platform} • {pkg.model}
                    </p>
                  </div>
                  <Badge variant="secondary" className="ml-4">
                    {pkg.leadCount} {pkg.leadCount === 1 ? 'lead' : 'leads'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Leads</CardTitle>
          <CardDescription>Latest lead submissions</CardDescription>
        </CardHeader>
        <CardContent>
          {leads.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No leads yet. Share your landing pages to start capturing leads!
            </p>
          ) : (
            <div className="space-y-3">
              {leads.slice(0, 5).map((lead) => (
                <div
                  key={lead.id.toString()}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => navigate({ to: '/leads/$id', params: { id: lead.id.toString() } })}
                >
                  <div>
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-sm text-muted-foreground">{lead.vehicleInterest}</p>
                  </div>
                  <Badge className={getStatusColor(lead.status)}>{formatStatus(lead.status)}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
