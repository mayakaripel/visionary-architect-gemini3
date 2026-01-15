/**
 * Extracts frames from a video file.
 * Returns an array of base64 strings representing frames at different intervals.
 */
export const extractFramesFromVideo = async (videoFile: File, frameCount: number = 3): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const frames: string[] = [];
    
    // Create URL for the video file
    const url = URL.createObjectURL(videoFile);
    video.src = url;
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = "anonymous";

    video.onloadedmetadata = async () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const duration = video.duration;
      
      // Calculate timestamps (e.g., 20%, 50%, 80%)
      const timestamps = Array.from({ length: frameCount }, (_, i) => 
        duration * ((i + 1) / (frameCount + 1))
      );

      try {
        for (const time of timestamps) {
          await seekToTime(video, time);
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            // Get base64 data, stripping the prefix for the API
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            const base64 = dataUrl.split(',')[1];
            frames.push(base64);
          }
        }
        resolve(frames);
      } catch (err) {
        reject(err);
      } finally {
        URL.revokeObjectURL(url);
        video.remove();
        canvas.remove();
      }
    };

    video.onerror = (e) => {
      reject(new Error("Failed to load video"));
    };
  });
};

const seekToTime = (video: HTMLVideoElement, time: number): Promise<void> => {
  return new Promise((resolve) => {
    const onSeeked = () => {
      video.removeEventListener('seeked', onSeeked);
      resolve();
    };
    video.addEventListener('seeked', onSeeked);
    video.currentTime = time;
  });
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Strip prefix
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};
