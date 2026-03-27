export const todayIsoDate = (): string => new Date().toISOString().slice(0, 10);

export const calcDailyProfit = (sales: number, purchases: number, expenses: number): number => {
  return sales - purchases - expenses;
};

export const calcCurrentStock = (
  openingStock: number,
  purchases: number,
  sales: number,
  waste: number
): number => {
  return openingStock + purchases - sales - waste;
};
