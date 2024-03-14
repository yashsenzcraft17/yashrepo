export const getRoundedValue = (numericValue, currencySymbol = "INR") => {
  if (
    isNaN(numericValue) ||
    numericValue === null ||
    numericValue === undefined ||
    numericValue === ""
  ) {
    return "-";
  }

  const absoluteValue = Math.abs(numericValue);
  const roundedValue = Math.round(absoluteValue);

  const formatter = Intl.NumberFormat("en", {
    style: "currency",
    currency: currencySymbol,
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
    notation: "compact"
  });
  const million = formatter.format(roundedValue);

  return million;
};

export const getFormattedNumber = (numericValue) => {
  if (
    numericValue === null ||
    numericValue === undefined ||
    numericValue === ""
  ) {
    return "0";
  }

  const cleanedValue = parseFloat(numericValue.replace(/,/g, ""));

  const absoluteValue = Math.abs(cleanedValue);
  const roundedValue = Math.round(absoluteValue);
  const formatter = Intl.NumberFormat("en", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
    notation: "compact"
  });

  return formatter.format(roundedValue);
};
