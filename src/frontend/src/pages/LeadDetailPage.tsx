import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetAllLeads, useUpdateLeadStatus, useAddLeadNote } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Mail, Phone, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { LeadStatus } from '../backend';

export default function LeadDetailPage() {
  const { id } = useParams({ from: '/authenticated/leads/$id' });
  const navigate = useNavigate();
  const { data: leads = [] } = useGetAllLeads();
  const updateStatus = useUpdateLeadStatus();
  const addNote = useAddLeadNote();

  const [newNote, setNewNote] = useState('');

  const lead = leads.find((l) => l.id.toString() === id);

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

  const handleStatusChange = async (newStatus: LeadStatus) => {
    if (!lead) return;
    try {
      await updateStatus.mutateAsync({
        id: lead.id,
        status: newStatus,
      });
      toast.success('Status updated');
    } catch (error) {
      toast.error('Failed to update status');
      console.error(error);
    }
  };

  const handleAddNote = async () => {
    if (!lead || !newNote.trim()) return;
    try {
      const timestamp = new Date().toLocaleString();
      await addNote.mutateAsync({
        id: lead.id,
        note: `[${timestamp}] ${newNote.trim()}`,
      });
      setNewNote('');
      toast.success('Note added');
    } catch (error) {
      toast.error('Failed to add note');
      console.error(error);
    }
  };

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-muted-foreground">Lead not found</p>
        <Button onClick={() => navigate({ to: '/leads' })}>Back to Leads</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/leads' })}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <div>
        <div className="flex items-start justify-between mb-2">
          <h1 className="text-3xl font-bold tracking-tight">{lead.name}</h1>
          <Badge className={getStatusColor(lead.status)}>{formatStatus(lead.status)}</Badge>
        </div>
        <p className="text-muted-foreground">Lead ID: {lead.id.toString()}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span>{lead.contactInfo}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>{lead.contactInfo}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vehicle Interest</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Model</p>
              <p className="font-medium">{lead.vehicleInterest}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Timeframe</p>
              <p className="font-medium">{lead.timeframe}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lead Status</CardTitle>
          <CardDescription>Update the current status of this lead</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={lead.status} onValueChange={(v) => handleStatusChange(v as LeadStatus)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={LeadStatus.new_}>New</SelectItem>
              <SelectItem value={LeadStatus.contacted}>Contacted</SelectItem>
              <SelectItem value={LeadStatus.qualified}>Qualified</SelectItem>
              <SelectItem value={LeadStatus.testDriveScheduled}>Test Drive Scheduled</SelectItem>
              <SelectItem value={LeadStatus.won}>Won</SelectItem>
              <SelectItem value={LeadStatus.lost}>Lost</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Notes
          </CardTitle>
          <CardDescription>Add notes and track follow-ups</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Add a note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={3}
            />
            <Button onClick={handleAddNote} disabled={!newNote.trim() || addNote.isPending}>
              {addNote.isPending ? 'Adding...' : 'Add Note'}
            </Button>
          </div>

          {lead.notes.length > 0 && (
            <div className="space-y-3 pt-4 border-t">
              {lead.notes.map((note, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-muted">
                  <p className="text-sm">{note}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
