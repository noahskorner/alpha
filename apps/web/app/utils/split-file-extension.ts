export function splitFileExtension(path: string): { path: string; extension: string | null } {
  const lastDotIndex = path.lastIndexOf('.');
  if (lastDotIndex === -1 || lastDotIndex === 0) {
    return {
      path: path,
      extension: null,
    };
  }

  return {
    path: path.substring(0, lastDotIndex),
    extension: path.substring(lastDotIndex + 1),
  };
}
