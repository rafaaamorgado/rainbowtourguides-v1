/**
 * Price Calculator for Rainbow Tour Guides
 *
 * Implements PRD pricing formula:
 * - 4h = base_rate_hour × 4
 * - 6h = base_rate_hour × 6 × 0.95 (5% discount)
 * - 8h = base_rate_hour × 8 × 0.90 (10% discount)
 */

export interface PriceBreakdown {
  subtotal: number;
  discount: number;
  discountPercentage: number;
  total: number;
  currency: string;
}

/**
 * Calculate price for a tour based on duration and hourly rate
 */
export function calculateTourPrice(
  baseRateHour: number,
  duration: 4 | 6 | 8,
  currency: string = "USD"
): PriceBreakdown {
  const rawSubtotal = baseRateHour * duration;
  let discountPercentage = 0;

  // Apply discounts per PRD
  if (duration === 6) {
    discountPercentage = 5; // 5% off
  } else if (duration === 8) {
    discountPercentage = 10; // 10% off
  }

  const discount = Math.round((rawSubtotal * discountPercentage) / 100);
  const subtotal = rawSubtotal;
  const total = rawSubtotal - discount;

  return {
    subtotal,
    discount,
    discountPercentage,
    total,
    currency,
  };
}

/**
 * Calculate price with travelers multiplier
 */
export function calculateGroupPrice(
  baseRateHour: number,
  duration: 4 | 6 | 8,
  travelers: number,
  currency: string = "USD"
): PriceBreakdown {
  const singlePrice = calculateTourPrice(baseRateHour, duration, currency);

  return {
    subtotal: singlePrice.subtotal * travelers,
    discount: singlePrice.discount * travelers,
    discountPercentage: singlePrice.discountPercentage,
    total: singlePrice.total * travelers,
    currency,
  };
}

/**
 * Format price for display
 */
export function formatPrice(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Get price description for a duration
 */
export function getPriceDescription(duration: 4 | 6 | 8): string {
  switch (duration) {
    case 4:
      return "4 hours (Standard rate)";
    case 6:
      return "6 hours (5% discount)";
    case 8:
      return "8 hours (10% discount)";
  }
}

/**
 * Calculate all duration prices for display
 */
export function calculateAllDurationPrices(baseRateHour: number, currency: string = "USD") {
  return {
    h4: calculateTourPrice(baseRateHour, 4, currency),
    h6: calculateTourPrice(baseRateHour, 6, currency),
    h8: calculateTourPrice(baseRateHour, 8, currency),
  };
}
