/**
 * The one place that decides whether something counts as "on sale".
 * Display is driven by the data, not by the `sale` tag: a tagged product with
 * no old price shows a plain price, and a stale old price left behind after
 * the tag is removed never strikes through on its own.
 */
export const saleInfo = (price: number, compareAt?: number | null) => {
  const onSale = compareAt != null && compareAt > price;
  return {
    onSale,
    percentOff: onSale ? Math.round((1 - price / compareAt) * 100) : 0,
  };
};
