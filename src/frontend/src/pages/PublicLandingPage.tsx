import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetContentPackage, useGetNextLeadId, useCreateLead } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { LeadStatus } from '../backend';

export default function PublicLandingPage() {
  const { id } = useParams({ from: '/landing/$id' });
  const navigate = useNavigate();
  const { data: contentPackage } = useGetContentPackage(id);
  const { data: nextLeadId } = useGetNextLeadId();
  const createLead = useCreateLead();

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [vehicleInterest, setVehicleInterest] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [consent, setConsent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !contact || !vehicleInterest || !timeframe || !consent) {
      toast.error('Please fill in all fields and accept the terms');
      return;
    }

    if (!nextLeadId) {
      toast.error('Unable to submit lead');
      return;
    }

    try {
      await createLead.mutateAsync({
        id: nextLeadId,
        name,
        contactInfo: contact,
        vehicleInterest,
        timeframe,
        consent,
        contentPackageId: BigInt(id),
        status: LeadStatus.new_,
        notes: [],
        nextFollowUpDate: BigInt(0),
      });

      navigate({ to: '/confirmation' });
    } catch (error) {
      toast.error('Failed to submit lead');
      console.error(error);
    }
  };

  if (!contentPackage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <img
              src="/assets/generated/ford-lead-studio-logo.dim_512x512.png"
              alt="Ford Lead Studio"
              className="h-16 w-auto mx-auto"
            />
            <h1 className="text-4xl font-bold tracking-tight">Get Your Dream Ford Today</h1>
            <p className="text-lg text-muted-foreground">{contentPackage.caption}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Request More Information</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you shortly</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact">Email or Phone *</Label>
                  <Input
                    id="contact"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="john@example.com or (555) 123-4567"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicle">Vehicle Interest *</Label>
                  <Select value={vehicleInterest} onValueChange={setVehicleInterest} required>
                    <SelectTrigger id="vehicle">
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ford F-150">Ford F-150</SelectItem>
                      <SelectItem value="Ford Mustang">Ford Mustang</SelectItem>
                      <SelectItem value="Ford Explorer">Ford Explorer</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeframe">Purchase Timeframe *</Label>
                  <Select value={timeframe} onValueChange={setTimeframe} required>
                    <SelectTrigger id="timeframe">
                      <SelectValue placeholder="When are you looking to buy?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Immediately">Immediately</SelectItem>
                      <SelectItem value="Within 1 month">Within 1 month</SelectItem>
                      <SelectItem value="1-3 months">1-3 months</SelectItem>
                      <SelectItem value="3-6 months">3-6 months</SelectItem>
                      <SelectItem value="Just browsing">Just browsing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox id="consent" checked={consent} onCheckedChange={(checked) => setConsent(!!checked)} />
                  <Label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer">
                    I agree to be contacted by the dealership regarding my inquiry and understand that my information
                    will be used in accordance with the privacy policy. *
                  </Label>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={createLead.isPending}>
                  {createLead.isPending ? 'Submitting...' : 'Submit Request'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
