import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useSaveVideoAsset } from '../../hooks/useQueries';
import { uploadVideoBlob } from '../../lib/blobStorage';
import { toast } from 'sonner';

interface VideoUploadFormProps {
  contentPackageId: bigint;
  onSuccess: () => void;
}

export default function VideoUploadForm({ contentPackageId, onSuccess }: VideoUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const saveVideo = useSaveVideoAsset();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please select a video file');
      return;
    }

    setIsUploading(true);
    try {
      const videoUrl = await uploadVideoBlob(file, (progress) => {
        setUploadProgress(progress);
      });

      await saveVideo.mutateAsync({
        contentPackageId,
        video: {
          id: BigInt(Date.now()),
          url: videoUrl,
          prompt,
          duration: BigInt(parseInt(duration) || 0),
          aspectRatio,
          status: 'Draft',
        },
      });

      toast.success('Video uploaded successfully');
      onSuccess();
    } catch (error) {
      toast.error('Failed to upload video');
      console.error(error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="file">Video File</Label>
        <Input
          id="file"
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          disabled={isUploading}
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
          disabled={isUploading}
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
            disabled={isUploading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="aspectRatio">Aspect Ratio</Label>
          <Input
            id="aspectRatio"
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
            placeholder="16:9"
            disabled={isUploading}
          />
        </div>
      </div>

      {isUploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} />
          <p className="text-sm text-muted-foreground text-center">{uploadProgress}% uploaded</p>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isUploading || !file}>
        {isUploading ? 'Uploading...' : 'Upload Video'}
      </Button>
    </form>
  );
}
