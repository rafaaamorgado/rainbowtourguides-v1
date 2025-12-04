export function obfuscateName(fullName: string): string {
  const parts = fullName.trim().split(" ");

  if (parts.length === 0) {
    return "Anonymous";
  }

  if (parts.length === 1) {
    return parts[0];
  }

  const firstName = parts[0];
  const lastNameInitial = parts[parts.length - 1].charAt(0).toUpperCase();

  return `${firstName} ${lastNameInitial}.`;
}

export function getMinimumPrice(prices: { h4: number; h6: number; h8: number }): number {
  return Math.min(prices.h4, prices.h6, prices.h8);
}

export function formatPriceRange(minPrice: number, currency: string = "USD"): string {
  const symbol = currency === "USD" ? "$" : currency;
  return `From ${symbol}${minPrice}`;
}
