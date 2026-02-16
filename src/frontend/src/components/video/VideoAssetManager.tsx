import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Video } from 'lucide-react';
import VideoUploadForm from './VideoUploadForm';
import VideoUrlForm from './VideoUrlForm';
import type { VideoAsset } from '../../backend';

interface VideoAssetManagerProps {
  contentPackageId: bigint;
  videoAssets: VideoAsset[];
}

export default function VideoAssetManager({ contentPackageId, videoAssets }: VideoAssetManagerProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-4">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Video
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Video Asset</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="upload">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload File</TabsTrigger>
              <TabsTrigger value="url">External URL</TabsTrigger>
            </TabsList>
            <TabsContent value="upload">
              <VideoUploadForm contentPackageId={contentPackageId} onSuccess={() => setDialogOpen(false)} />
            </TabsContent>
            <TabsContent value="url">
              <VideoUrlForm contentPackageId={contentPackageId} onSuccess={() => setDialogOpen(false)} />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {videoAssets.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          No video assets yet. Add your first video above.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {videoAssets.map((video) => (
            <div key={video.id.toString()} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-sm">Video {video.id.toString()}</span>
                </div>
                <Badge variant="secondary">{video.status}</Badge>
              </div>
              <video src={video.url} controls className="w-full rounded-md bg-black" />
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Duration: {video.duration.toString()}s</p>
                <p>Aspect Ratio: {video.aspectRatio}</p>
                {video.prompt && <p className="line-clamp-2">Prompt: {video.prompt}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
