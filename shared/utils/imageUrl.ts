/** http 이미지 URL을 https로 보정 */
export function normalizeRemoteImageUri(uri?: string | null): string | undefined {
  if (!uri?.trim()) return undefined;
  const trimmed = uri.trim();
  if (trimmed.startsWith('https://')) return trimmed;
  if (trimmed.startsWith('http://')) return `https://${trimmed.slice(7)}`;
  return trimmed;
}
