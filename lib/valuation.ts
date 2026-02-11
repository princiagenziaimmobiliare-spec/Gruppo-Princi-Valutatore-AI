import { Coefficient, Locality, Settings } from "@prisma/client";

export function getFloorKey(floor?: number | null) {
  if (floor === undefined || floor === null) return "1";
  if (floor <= 0) return "terra";
  if (floor >= 4) return "4_plus";
  return String(floor);
}

export function getYearKey(year?: number | null) {
  if (!year) return null;
  if (year < 1970) return "lt_1970";
  if (year <= 1999) return "1970_1999";
  if (year <= 2014) return "2000_2014";
  return "gte_2015";
}

export function calculateValuation(params: {
  mq: number;
  condition: string;
  floor?: number | null;
  hasElevator?: boolean | null;
  features: string[];
  buildYear?: number | null;
  comune: string;
  zona?: string | null;
  localities: Locality[];
  coefficients: Coefficient[];
  settings: Settings;
}) {
  const { mq, condition, floor, hasElevator, features, buildYear, comune, zona, localities, coefficients, settings } = params;

  const locality = localities.find((l) => l.comune === comune && (l.zona || null) === (zona || null) && l.isActive)
    || localities.find((l) => l.comune === comune && !l.zona && l.isActive);

  const basePrice = locality?.basePriceEur ?? settings.provinceFallbackPrice;
  const baseValue = mq * basePrice;

  const coeffMap = new Map(coefficients.map((c) => [`${c.group}:${c.key}`, c.value]));
  const conditionCoeff = coeffMap.get(`condition:${condition}`) ?? 1;
  const floorCoeff = coeffMap.get(`floor:${getFloorKey(floor)}`) ?? 1;
  const elevatorCoeff = hasElevator === false && (floor ?? 0) >= 2 ? (coeffMap.get("elevator:no") ?? 1) : (coeffMap.get("elevator:si") ?? 1);
  const yearKey = getYearKey(buildYear);
  const yearCoeff = yearKey ? (coeffMap.get(`year:${yearKey}`) ?? 1) : 1;
  const featuresCoeff = features.reduce((acc, feature) => acc * (coeffMap.get(`feature:${feature}`) ?? 1), 1);

  const combinedCoeff = conditionCoeff * floorCoeff * elevatorCoeff * yearCoeff * featuresCoeff;
  const center = baseValue * combinedCoeff;
  const delta = center * (settings.rangePercentage / 100);

  return {
    locality,
    basePrice,
    coefficientUsed: combinedCoeff,
    valueCenter: center,
    valueMin: center - delta,
    valueMax: center + delta
  };
}
