export const getDebugNamespace = (rootDir: string) => (srcFile: string) => {
  if (srcFile.startsWith(rootDir)) {
    return srcFile
      .slice(rootDir.length, srcFile.length)
      .replace(/^\//, '')
      .replace(/\//g, ':');
  }
  return srcFile.replace(/^\//, '').replace(/\//g, ':');
};
