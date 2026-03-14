/** @param {NS} ns */
export async function main(ns) {
  const arr = [
    4, -4, 6, 5, -4, -5, 8, -1, 9, 10, 0, -3, -1, 3, -9, 4, 1, 4, 5, 10, 7, 2,
    -6, 7, -8, 6, 4, -2, -5, 5, -3, -5, 6, 3, -3,
  ];
  if (arr.length === 0) {
    ns.tprint(0);
    return 0;
  }

  let maxEndingHere = arr[0];
  let maxSoFar = arr[0];

  for (let i = 1; i < arr.length; i++) {
    maxEndingHere = Math.max(arr[i], maxEndingHere + arr[i]);
    maxSoFar = Math.max(maxSoFar, maxEndingHere);
  }

  ns.tprint(`Maximum subarray sum: ${maxSoFar}`);
  return maxSoFar;
}
