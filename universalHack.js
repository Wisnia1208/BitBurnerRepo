/** @param {NS} ns */
export async function main(ns, hostname) {
  // Get the first argument passed at runtime
  const target = ns.args[0];

  // Check if user provided a target server
  if (!target) {
    ns.tprint(
      "Error: You must provide a server name! Example: run universalHack.js n00dles",
    );
    return;
  }

  // Define thresholds
  const moneyThresh = ns.getServerMaxMoney(target) * 0.75; // Aim for 75% max money
  const securityThresh = ns.getServerMinSecurityLevel(target) + 5; // Allow +5 security

  while (true) {
    if (ns.getServerSecurityLevel(target) > securityThresh) {
      // 1. If server is too high security - weaken it
      await ns.weaken(target);
    } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
      // 2. If server has too little money - grow it
      await ns.grow(target);
    } else {
      // 3. If everything is okay - hack it
      await ns.hack(target);
    }
  }
}
