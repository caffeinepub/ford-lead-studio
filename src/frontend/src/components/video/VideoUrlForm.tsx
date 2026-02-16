import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSaveVideoAsset } from '../../hooks/useQueries';
import { toast } from 'sonner';

interface VideoUrlFormProps {
  contentPackageId: bigint;
  onSuccess: () => void;
}

export default function VideoUrlForm({ contentPackageId, onSuccess }: VideoUrlFormProps) {
  const [url, setUrl] = useState('');
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');

  const saveVideo = useSaveVideoAsset();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url) {
      toast.error('Please enter a video URL');
      return;
    }

    try {
      await saveVideo.mutateAsync({
        contentPackageId,
        video: {
          id: BigInt(Date.now()),
          url,
          prompt,
          duration: BigInt(parseInt(duration) || 0),
          aspectRatio,
          status: 'Draft',
        },
      });

      toast.success('Video added successfully');
      onSuccess();
    } catch (error) {
      toast.error('Failed to add video');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="url">Video URL</Label>
        <Input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/video.mp4"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="prompt">Prompt (Optional)</Label>
        <Textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the video content or generation prompt..."
          rows={3}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (seconds)</Label>
          <Input
            id="duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="30"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="aspectRatio">Aspect Ratio</Label>
          <Input
            id="aspectRatio"
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
            placeholder="16:9"
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={saveVideo.isPending || !url}>
        {saveVideo.isPending ? 'Adding...' : 'Add Video'}
      </Button>
    </form>
  );
}
