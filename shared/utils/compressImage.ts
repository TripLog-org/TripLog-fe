// @ts-nocheck
import * as FileSystem from 'expo-file-system'; // @ts-ignore
import * as ImageManipulator from 'expo-image-manipulator';

const MAX_SIZE_BYTES = 1 * 1024 * 1024; // 1MB

export async function compressImage(uri: string): Promise<string> {
  let quality = 0.8;
  let result = await ImageManipulator.manipulateAsync(uri, [], {
    compress: quality,
    format: ImageManipulator.SaveFormat.JPEG,
  });

  let info = await FileSystem.getInfoAsync(result.uri);

  while (info.exists && info.size > MAX_SIZE_BYTES && quality > 0.1) {
    quality -= 0.1;
    result = await ImageManipulator.manipulateAsync(uri, [], {
      compress: quality,
      format: ImageManipulator.SaveFormat.JPEG,
    });
    info = await FileSystem.getInfoAsync(result.uri);
  }

  return result.uri;
}
