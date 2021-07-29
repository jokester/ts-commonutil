export const getDebugNamespace =
  (rootDir: string, stripCodeExt = true) =>
  (srcFile: string, appendee?: string) => {
    const namespace = srcFile.startsWith(rootDir)
      ? srcFile.slice(rootDir.length, srcFile.length).replace(/^\//, '').replace(/\//g, ':')
      : srcFile.replace(/^\//, '').replace(/\//g, ':');

    const striped = stripCodeExt ? namespace.replace(/\.(ts|js)x?$/i, '') : namespace;
    return appendee ? `${striped}:${appendee}` : striped;
  };
