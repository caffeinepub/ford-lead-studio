import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetNextContentPackageId, useCreateContentPackage, useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { generateContentPackage } from '../lib/templates/contentTemplates';
import { toast } from 'sonner';
import { Sparkles, Save } from 'lucide-react';
import { Platform, CampaignObjective, Model, Tone, CTA } from '../backend';

export default function ContentGeneratorPage() {
  const navigate = useNavigate();
  const { data: nextId } = useGetNextContentPackageId();
  const { data: userProfile } = useGetCallerUserProfile();
  const createPackage = useCreateContentPackage();

  const [platform, setPlatform] = useState<Platform>(Platform.instagram);
  const [objective, setObjective] = useState<CampaignObjective>(CampaignObjective.leadGeneration);
  const [model, setModel] = useState<Model>(Model.f150);
  const [tone, setTone] = useState<Tone>(Tone.excited);
  const [cta, setCta] = useState<CTA>(CTA.scheduleTestDrive);
  const [price, setPrice] = useState('45000');
  const [discount, setDiscount] = useState('5000');
  const [mileage, setMileage] = useState('0');

  const [generated, setGenerated] = useState<ReturnType<typeof generateContentPackage> | null>(null);
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [shotList, setShotList] = useState<string[]>([]);
  const [checklist, setChecklist] = useState<string[]>([]);

  const handleGenerate = () => {
    const result = generateContentPackage({
      platform,
      objective,
      model,
      tone,
      cta,
      price: parseInt(price) || 0,
      discount: parseInt(discount) || 0,
      mileage: parseInt(mileage) || 0,
    });
    setGenerated(result);
    setCaption(result.caption);
    setHashtags(result.hashtags);
    setShotList(result.shotList);
    setChecklist(result.postingChecklist);
  };

  const handleSave = async () => {
    if (!nextId || !userProfile) {
      toast.error('Unable to save content package');
      return;
    }

    try {
      await createPackage.mutateAsync({
        id: nextId,
        platform,
        campaignObjective: objective,
        model,
        tone,
        cta,
        offerDetails: {
          price: BigInt(parseInt(price) || 0),
          discount: BigInt(parseInt(discount) || 0),
          mileage: BigInt(parseInt(mileage) || 0),
        },
        caption,
        hashtags,
        shotList,
        postingChecklist: checklist,
        videoAssets: [],
        createdBy: userProfile.name,
        createdAt: BigInt(Date.now() * 1000000),
      });
      toast.success('Content package saved!');
      navigate({ to: '/content/$id', params: { id: nextId.toString() } });
    } catch (error) {
      toast.error('Failed to save content package');
      console.error(error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Content Package</h1>
        <p className="text-muted-foreground mt-2">
          Generate optimized social media content for your Ford dealership
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content Settings</CardTitle>
          <CardDescription>Configure your content package parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select value={platform} onValueChange={(v) => setPlatform(v as Platform)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Platform.facebook}>Facebook</SelectItem>
                  <SelectItem value={Platform.instagram}>Instagram</SelectItem>
                  <SelectItem value={Platform.tiktok}>TikTok</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Campaign Objective</Label>
              <Select value={objective} onValueChange={(v) => setObjective(v as CampaignObjective)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CampaignObjective.brandAwareness}>Brand Awareness</SelectItem>
                  <SelectItem value={CampaignObjective.leadGeneration}>Lead Generation</SelectItem>
                  <SelectItem value={CampaignObjective.testDrive}>Test Drive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Model</Label>
              <Select value={model} onValueChange={(v) => setModel(v as Model)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Model.f150}>F-150</SelectItem>
                  <SelectItem value={Model.mustang}>Mustang</SelectItem>
                  <SelectItem value={Model.explorer}>Explorer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Tone.excited}>Excited</SelectItem>
                  <SelectItem value={Tone.trustedAdvisor}>Trusted Advisor</SelectItem>
                  <SelectItem value={Tone.communityFocused}>Community Focused</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Call to Action</Label>
              <Select value={cta} onValueChange={(v) => setCta(v as CTA)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CTA.visitDealership}>Visit Dealership</SelectItem>
                  <SelectItem value={CTA.scheduleTestDrive}>Schedule Test Drive</SelectItem>
                  <SelectItem value={CTA.getQuote}>Get Quote</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Price ($)</Label>
              <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Discount ($)</Label>
              <Input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Mileage</Label>
              <Input type="number" value={mileage} onChange={(e) => setMileage(e.target.value)} />
            </div>
          </div>

          <Button onClick={handleGenerate} className="w-full" size="lg">
            <Sparkles className="w-5 h-5 mr-2" />
            Generate Content
          </Button>
        </CardContent>
      </Card>

      {generated && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Content</CardTitle>
            <CardDescription>Review and edit before saving</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Caption</Label>
              <Textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={6}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label>Hashtags</Label>
              <Input
                value={hashtags.join(' ')}
                onChange={(e) => setHashtags(e.target.value.split(' ').filter(Boolean))}
              />
            </div>

            <div className="space-y-2">
              <Label>Shot List</Label>
              <Textarea
                value={shotList.join('\n')}
                onChange={(e) => setShotList(e.target.value.split('\n').filter(Boolean))}
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label>Posting Checklist</Label>
              <Textarea
                value={checklist.join('\n')}
                onChange={(e) => setChecklist(e.target.value.split('\n').filter(Boolean))}
                rows={4}
                className="resize-none"
              />
            </div>

            <Button onClick={handleSave} disabled={createPackage.isPending} className="w-full" size="lg">
              <Save className="w-5 h-5 mr-2" />
              {createPackage.isPending ? 'Saving...' : 'Save Content Package'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
