import { Deferred } from '../concurrency/deferred';

interface ImgDimension {
  width: number;
  height: number;
}

export async function measureImgSize(imageBlob: Blob): Promise<ImgDimension> {
  const url = URL.createObjectURL(imageBlob);
  const finished = new Deferred<ImgDimension>();

  const img = new Image();
  img.onabort = img.onerror = (e) => finished.reject(e);
  img.onload = () => finished.fulfill({ width: img.naturalWidth, height: img.naturalHeight });
  img.src = url;
  // seemingly no need to document.body.appendChild(img);

  try {
    return await finished;
  } finally {
    URL.revokeObjectURL(url);
    img.remove();
  }
}
