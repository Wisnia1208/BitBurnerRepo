/** @param {NS} ns */
export async function main(ns) {
  const target = "phantasy";

  // Define thresholds
  const moneyThresh = ns.getServerMaxMoney(target) * 0.75; // Aim for 75% max money
  const securityThresh = ns.getServerMinSecurityLevel(target) + 5; // Allow +5 security

  while (true) {
    if (ns.getServerSecurityLevel(target) > securityThresh) {
      // 1. If server security is too high - weaken
      await ns.weaken(target);
    } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
      // 2. If server money is low - grow
      await ns.grow(target);
    } else {
      // 3. Otherwise - hack
      await ns.hack(target);
    }
  }
}
