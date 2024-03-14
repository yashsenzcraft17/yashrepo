const months = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec"
];

export function identifyType(inputString) {
  if (typeof inputString !== "string") {
    return "Invalid input";
  }

  const lowercasedMonth = inputString.slice(0, 3)?.toLowerCase();
  if (months.includes(lowercasedMonth)) {
    return "month";
  }

  const weekPattern = /^Week \d+$/i;

  if (weekPattern.test(inputString)) {
    return "week";
  }

  return "Unknown type";
}

export function identifyTypeArray(inputArray) {
  if (!Array.isArray(inputArray)) {
    return "Invalid input";
  }

  const typeCount = {
    month: 0,
    week: 0,
    unknown: 0
  };

  inputArray.forEach((item) => {
    const type = identifyType(item);
    typeCount[type]++;
  });

  const maxType = Object.keys(typeCount).reduce((a, b) =>
    typeCount[a] > typeCount[b] ? a : b
  );

  return maxType;
}

export function reduceYearByOne(inputString) {
  const match = inputString.match(/([a-zA-Z]+)([\s`'"]*)(\d+)/);
  if (!match) return null;

  const month = match[1]; // Retain the case of the month
  const separator = match[2]; // Retain the separator
  let number = parseInt(match[3], 10);

  // Reduce the year by one
  number--;

  // Ensure the result is a two-digit year
  const year = number < 10 ? `0${number}` : number.toString();

  // Format the result back into the original string format
  const outputString = `${month}${separator}${year}`;

  return outputString;
}
