/** @param {NS} ns */
export async function main(ns) {
  const prices = [
    78, 45, 93, 200, 139, 172, 93, 12, 79, 125, 8, 48, 114, 191, 164, 128, 179,
    106, 121, 93, 161, 113, 188, 191, 8, 36, 130, 162, 7, 183, 33, 35, 157, 38,
    29, 28, 170, 86, 14, 4, 178, 13, 133, 37, 150, 48, 45, 9, 133, 96,
  ];

  const maxTransactions = 2;
  const n = prices.length;
  if (n === 0) {
    ns.tprint(0);
    return 0;
  }

  // dp[t][i] = max profit up to day i using at most t transactions
  const dp = Array.from({ length: maxTransactions + 1 }, () =>
    Array(n).fill(0),
  );

  for (let t = 1; t <= maxTransactions; t++) {
    let maxDiff = -prices[0];
    for (let i = 1; i < n; i++) {
      dp[t][i] = Math.max(dp[t][i - 1], prices[i] + maxDiff);
      maxDiff = Math.max(maxDiff, dp[t - 1][i] - prices[i]);
    }
  }

  const result = dp[maxTransactions][n - 1];
  ns.tprint(
    `Max profit with at most ${maxTransactions} transactions: ${result}`,
  );
  return result;
}
