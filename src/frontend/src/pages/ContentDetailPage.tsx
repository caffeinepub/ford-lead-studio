import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetContentPackage, useGetAllLeads } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Copy, ExternalLink, Video } from 'lucide-react';
import { toast } from 'sonner';
import VideoAssetManager from '../components/video/VideoAssetManager';
import ContentLeadAttribution from '../components/analytics/ContentLeadAttribution';

export default function ContentDetailPage() {
  const { id } = useParams({ from: '/authenticated/content/$id' });
  const navigate = useNavigate();
  const { data: contentPackage, isLoading } = useGetContentPackage(id);
  const { data: leads = [] } = useGetAllLeads();

  const packageLeads = leads.filter((lead) => lead.contentPackageId.toString() === id);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const landingUrl = `${window.location.origin}/landing/${id}`;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!contentPackage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-muted-foreground">Content package not found</p>
        <Button onClick={() => navigate({ to: '/' })}>Go to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/' })}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <div>
        <div className="flex items-start justify-between mb-2">
          <h1 className="text-3xl font-bold tracking-tight">Content Package</h1>
          <div className="flex gap-2">
            <Badge variant="secondary">{contentPackage.platform}</Badge>
            <Badge variant="secondary">{contentPackage.model}</Badge>
          </div>
        </div>
        <p className="text-muted-foreground">
          Created by {contentPackage.createdBy} •{' '}
          {new Date(Number(contentPackage.createdAt) / 1000000).toLocaleDateString()}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Caption</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap mb-4">{contentPackage.caption}</p>
          <Button variant="outline" size="sm" onClick={() => copyToClipboard(contentPackage.caption)}>
            <Copy className="w-4 h-4 mr-2" />
            Copy Caption
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hashtags</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{contentPackage.hashtags.join(' ')}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(contentPackage.hashtags.join(' '))}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Hashtags
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shot List</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {contentPackage.shotList.map((shot, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-muted-foreground">{idx + 1}.</span>
                <span>{shot}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Posting Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {contentPackage.postingChecklist.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                Video Assets
              </CardTitle>
              <CardDescription>Upload or link video content</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <VideoAssetManager contentPackageId={BigInt(id)} videoAssets={contentPackage.videoAssets} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Landing Page</CardTitle>
          <CardDescription>Share this link to capture leads</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={landingUrl}
              readOnly
              className="flex-1 px-3 py-2 text-sm border rounded-md bg-muted"
            />
            <Button variant="outline" size="sm" onClick={() => copyToClipboard(landingUrl)}>
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.open(landingUrl, '_blank')}>
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <ContentLeadAttribution contentPackageId={id} leads={packageLeads} />
    </div>
  );
}
