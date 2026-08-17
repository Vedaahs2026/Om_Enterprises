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

export function formatPrice(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) return "0.00";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "0.00";
  
  const isNegative = num < 0;
  const absNum = Math.abs(num);
  const fixed = absNum.toFixed(2);
  const [integerPart, decimalPart] = fixed.split('.');
  
  let formattedInteger = integerPart;
  if (integerPart.length > 3) {
    const lastThree = integerPart.substring(integerPart.length - 3);
    const remaining = integerPart.substring(0, integerPart.length - 3);
    const groups: string[] = [];
    let i = remaining.length;
    while (i > 0) {
      const start = Math.max(0, i - 2);
      groups.unshift(remaining.substring(start, i));
      i -= 2;
    }
    formattedInteger = [...groups, lastThree].join(',');
  }
  
  return `${isNegative ? "-" : ""}${formattedInteger}.${decimalPart}`;
}
