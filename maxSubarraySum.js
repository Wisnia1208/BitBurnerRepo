/** @param {NS} ns */
export async function main(ns) {
  const arr = [
    7, 2, -8, 6, -7, 2, 8, -3, -2, -2, -4, -8, 10, 9, 4, 7, -1, -10, -6,
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
