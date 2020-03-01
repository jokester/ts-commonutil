export const getDebugNamespace = (rootDir: string, stripCodeExt = true) => (srcFile: string) => {
  const namespace = srcFile.startsWith(rootDir)
    ? srcFile
        .slice(rootDir.length, srcFile.length)
        .replace(/^\//, '')
        .replace(/\//g, ':')
    : srcFile.replace(/^\//, '').replace(/\//g, ':');

  return stripCodeExt ? namespace.replace(/\.(ts|js)x?$/i, '') : namespace;
};
