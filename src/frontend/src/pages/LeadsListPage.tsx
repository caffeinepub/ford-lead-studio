import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetAllLeads } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { LeadStatus } from '../backend';

export default function LeadsListPage() {
  const navigate = useNavigate();
  const { data: leads = [], isLoading } = useGetAllLeads();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.contactInfo.toLowerCase().includes(search.toLowerCase()) ||
      lead.vehicleInterest.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
        <p className="text-muted-foreground mt-2">Manage and track your dealership leads</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Leads ({filteredLeads.length})</CardTitle>
          <CardDescription>Search and filter your leads</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, contact, or vehicle..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value={LeadStatus.new_}>New</SelectItem>
                <SelectItem value={LeadStatus.contacted}>Contacted</SelectItem>
                <SelectItem value={LeadStatus.qualified}>Qualified</SelectItem>
                <SelectItem value={LeadStatus.testDriveScheduled}>Test Drive</SelectItem>
                <SelectItem value={LeadStatus.won}>Won</SelectItem>
                <SelectItem value={LeadStatus.lost}>Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">Loading leads...</p>
          ) : filteredLeads.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No leads found</p>
          ) : (
            <div className="space-y-2">
              {filteredLeads.map((lead) => (
                <div
                  key={lead.id.toString()}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => navigate({ to: '/leads/$id', params: { id: lead.id.toString() } })}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-medium">{lead.name}</p>
                      <Badge className={getStatusColor(lead.status)}>{formatStatus(lead.status)}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {lead.contactInfo} • {lead.vehicleInterest} • {lead.timeframe}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
