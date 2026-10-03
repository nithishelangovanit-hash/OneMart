/**
 * Compare Lens Scoring Engine (P09)
 * Computes min-max normalized weighted scores across products of the SAME category.
 * Generates transparent rule-based English reasons without AI hallucinations.
 */

import { Product, CompareWeights, CompareProductScore } from '../../shared/types.ts';

export function calculateCompareScores(
  products: Product[],
  weights: CompareWeights
): CompareProductScore[] {
  if (products.length === 0) return [];

  const totalWeight = weights.price + weights.rating + weights.newest;
  const wPrice = totalWeight > 0 ? weights.price / totalWeight : 0.33;
  const wRating = totalWeight > 0 ? weights.rating / totalWeight : 0.33;
  const wNewest = totalWeight > 0 ? weights.newest / totalWeight : 0.33;

  const prices = products.map(p => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const ratings = products.map(p => p.rating);
  const minRating = Math.min(...ratings);
  const maxRating = Math.max(...ratings);

  const years = products.map(p => p.releaseYear);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);

  const scored = products.map(product => {
    // Price: lower is better
    const scaledPrice =
      maxPrice === minPrice
        ? 1.0
        : (maxPrice - product.price) / (maxPrice - minPrice);

    // Rating: higher is better
    const scaledRating =
      maxRating === minRating
        ? 1.0
        : (product.rating - minRating) / (maxRating - minRating);

    // Year: newer is better
    const scaledYear =
      maxYear === minYear
        ? 1.0
        : (product.releaseYear - minYear) / (maxYear - minYear);

    const totalScore = Number(
      (wPrice * scaledPrice + wRating * scaledRating + wNewest * scaledYear).toFixed(3)
    );

    const reasons: string[] = [];
    if (scaledPrice === 1.0 && maxPrice !== minPrice) {
      reasons.push(`Lowest price in the compared group (₹${product.price.toLocaleString('en-IN')})`);
    }
    if (scaledRating === 1.0 && maxRating !== minRating) {
      reasons.push(`Highest user satisfaction rating (${product.rating}★ across ${product.reviewCount} verified reviews)`);
    }
    if (scaledYear === 1.0 && maxYear !== minYear) {
      reasons.push(`Newest generation release (${product.releaseYear})`);
    }
    if (reasons.length === 0) {
      reasons.push('Balanced specifications across cost, user satisfaction, and hardware generation');
    }

    return {
      product,
      scaledPrice,
      scaledRating,
      scaledYear,
      totalScore,
      rank: 1,
      isTie: false,
      reasons
    };
  });

  // Sort descending by totalScore
  scored.sort((a, b) => b.totalScore - a.totalScore);

  // Assign ranks and detect ties (spread < 0.03 is considered a tie)
  for (let i = 0; i < scored.length; i++) {
    if (i > 0 && Math.abs(scored[i].totalScore - scored[i - 1].totalScore) < 0.03) {
      scored[i].rank = scored[i - 1].rank;
      scored[i].isTie = true;
      scored[i - 1].isTie = true;
    } else {
      scored[i].rank = i + 1;
    }
  }

  return scored;
}
