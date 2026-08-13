export function formatLength(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return "";
  const str = String(val).trim();
  if (!str) return "";
  const isNumeric = /^\d+(\.\d+)?$/.test(str);
  if (isNumeric) {
    return `${str} MTR`;
  }
  return str;
}

export function formatLengthShort(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return "";
  const str = String(val).trim();
  if (!str) return "";
  const isNumeric = /^\d+(\.\d+)?$/.test(str);
  if (isNumeric) {
    return `${str}m`;
  }
  return str;
}
