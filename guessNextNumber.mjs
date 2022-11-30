export default function guessNextNumber(addresses, skipNumbers) {
  const defaultReturn = [undefined, []];

  const lastAddress = addresses[addresses.length - 1];
  const prev = addresses[addresses.length - 2];

  if (lastAddress === undefined || prev === undefined) {
    return defaultReturn;
  }

  let lNum = Number(lastAddress.numberOrName);
  let pNum = Number(prev.numberOrName);

  const justSkipped = lastAddress.skippedNumbers;

  if (justSkipped.length > 0) {
    pNum = justSkipped[justSkipped.length - 1]
  }

  if (isNaN(lNum) || isNaN(pNum)) {
    return defaultReturn;
  }

  const difference = lNum - pNum;

  let nextNumber = lNum + difference;

  if (![-2, -1, 1, 2].includes(difference)) {
    return defaultReturn;
  }

  const skippedNumbers = [];

  while (skipNumbers.includes(nextNumber)) {
    skippedNumbers.push(nextNumber);
    nextNumber += difference;
  }

  if (nextNumber < 1) {
    return defaultReturn;
  }

  return [nextNumber, skippedNumbers];
}
