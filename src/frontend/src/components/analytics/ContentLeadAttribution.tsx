import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users } from 'lucide-react';
import { Lead, LeadStatus } from '../../backend';

interface ContentLeadAttributionProps {
  contentPackageId: string;
  leads: Lead[];
}

export default function ContentLeadAttribution({ contentPackageId, leads }: ContentLeadAttributionProps) {
  const statusCounts = leads.reduce((acc, lead) => {
    const status = lead.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<LeadStatus, number>);

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Lead Attribution
        </CardTitle>
        <CardDescription>Leads generated from this content package</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-muted-foreground" />
            <span className="text-2xl font-bold">{leads.length}</span>
          </div>
          <span className="text-muted-foreground">Total Leads</span>
        </div>

        <div>
          <h4 className="font-medium mb-3">Status Breakdown</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(statusCounts).map(([status, count]) => (
              <Badge key={status} className={getStatusColor(status as LeadStatus)}>
                {formatStatus(status as LeadStatus)}: {count}
              </Badge>
            ))}
          </div>
        </div>

        {leads.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Recent Submissions</h4>
            <div className="space-y-2">
              {leads.slice(0, 5).map((lead) => (
                <div key={lead.id.toString()} className="flex items-center justify-between p-2 rounded border">
                  <div>
                    <p className="font-medium text-sm">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">{lead.vehicleInterest}</p>
                  </div>
                  <Badge className={getStatusColor(lead.status)} variant="secondary">
                    {formatStatus(lead.status)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
