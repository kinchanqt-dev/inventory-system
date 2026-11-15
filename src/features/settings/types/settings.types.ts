export interface ShopBranding {
  shopTitle: string;
  tagline: string | null;
  logoPath: string | null;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  currencySymbol: string;
  salesTaxPercent: number;
  pricesIncludeTax: boolean;
  targetFoodCostPercent: number;
  dashboardYear: number;
}
