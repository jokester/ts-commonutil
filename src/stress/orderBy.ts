/**
 * (for more complicated case, consider fp-ts Order<T> typeclass)
 * @param values
 * @param key
 * @param asc
 */
export function orderBy<T, O>(values: T[], key: (v: T) => O, asc = false): T[] {
  const indexes = values.map((v, i) => ({ v, i }));
  return indexes.sort((a, b) => (asc ? compare(a.v, b.v) : -compare(a.v, b.v))).map((_) => _.v);
}

function compare(a: any, b: any): number {
  if (a < b) {
    return -1;
  } else if (a > b) {
    return 1;
  } else return 0;
}
