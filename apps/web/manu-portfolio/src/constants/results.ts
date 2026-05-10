export interface ResultItem {
  context:     string;
  value:       string;
  numericPart: number;
  suffix:      string;
  label:       string;
}

export const results: ResultItem[] = [
  {
    context:     "Fashion DTC",
    value:       "3×",
    numericPart: 3,
    suffix:      "×",
    label:       "Instagram followers in 90 days",
  },
  {
    context:     "Fashion DTC",
    value:       "+40%",
    numericPart: 40,
    suffix:      "%",
    label:       "DM inquiries on a fashion brand",
  },
  {
    context:     "B2B SaaS",
    value:       "+250%",
    numericPart: 250,
    suffix:      "%",
    label:       "LinkedIn engagement on a B2B client",
  },
  {
    context:     "Personal Brand",
    value:       "500K+",
    numericPart: 500,
    suffix:      "K+",
    label:       "Impressions on a single brand post",
  },
];
