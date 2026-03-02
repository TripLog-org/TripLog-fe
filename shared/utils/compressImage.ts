import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { File } from 'expo-file-system';

const MAX_SIZE_BYTES = 1 * 1024 * 1024; // 1MB

export async function compressImage(uri: string): Promise<string> {
  let quality = 0.8;

  const compress = async (q: number) => {
    const context = ImageManipulator.manipulate(uri);
    const rendered = await context.renderAsync();
    const saved = await rendered.saveAsync({
      compress: q,
      format: SaveFormat.JPEG,
    });
    rendered.release();
    return saved.uri;
  };

  let resultUri = await compress(quality);
  let fileSize = new File(resultUri).size;

  while (fileSize > MAX_SIZE_BYTES && quality > 0.1) {
    quality -= 0.1;
    resultUri = await compress(quality);
    fileSize = new File(resultUri).size;
  }

  return resultUri;
}
