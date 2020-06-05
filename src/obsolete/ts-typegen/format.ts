/**
 * Format of ts types
 */
const isIdentifier = /^\w+$/;

/**
 * @param tokens tokens returned by TSType#
 * @param indentBase
 */
export function format(tokens: string[], indentBase = 2): string[] {
  let currentLine = '';
  const lines: string[] = [];

  let indent = 0;

  tokens.forEach((t, index) => {
    const prevT = tokens[index - 1];
    const nextT = tokens[index + 1];
    currentLine = currentLine || spaces(indent);

    if (t === ':') {
      currentLine += ': ';
    } else if (t === '{' && nextT === '}') {
      currentLine += ' {';
      indent += indentBase;
    } else if (t === '{') {
      currentLine += ' {';
      lines.push(currentLine);
      indent += indentBase;
      currentLine = '';
    } else if (t === '}' && prevT === '{') {
      currentLine += '}';
      lines.push(currentLine);
      indent -= indentBase;
      currentLine = '';
    } else if (t === '}') {
      lines.push(currentLine);
      indent -= indentBase;
      lines.push(`${spaces(indent)}}`);
      currentLine = '';
    } else if (t === ';') {
      currentLine += ';';
      lines.push(currentLine);
      currentLine = '';
    } else {
      currentLine += t;
      if (isIdentifier.exec(t) && isIdentifier.exec(nextT)) {
        currentLine += ' ';
      }
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.filter(nonBlankLine);
}

/**
 * @param len num of spaces
 */
function spaces(len: number) {
  const spaces = [];
  for (let index = 0; index < len; index++) {
    spaces.push(' ');
  }
  return spaces.join('');
}

function nonBlankLine(line: string) {
  return !/^\s*$/.exec(line);
}
