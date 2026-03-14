/** @param {NS} ns */
export async function main(ns) {
  let allServers = new Set(["home"]);

  function scanNetwork(current) {
    let neighbors = ns.scan(current);
    for (let next of neighbors) {
      if (!allServers.has(next)) {
        allServers.add(next);
        scanNetwork(next);
      }
    }
  }

  scanNetwork("home");
  let purchased = ns.getPurchasedServers();
  let targets = Array.from(allServers).filter(
    (host) => !purchased.includes(host) && host !== "home",
  );

  for (let target of targets) {
    if (!ns.hasRootAccess(target)) {
      try {
        ns.relaysmtp(target);
        ns.brutessh(target);
        ns.nuke(target);
      } catch (e) {
        ns.tprint(`Cannot get root privilege on ${target}`);
      }
    }

    const serverInfo = ns.getServer(target);
    if (ns.hasRootAccess(target) && !serverInfo.backdoorInstalled) {
      try {
        ns.tprint(`Installing backdoor on ${target}...`);

        // You have to connect to the target server physically
        ns.singularity.connect(target);

        // Wait for installation to complete (this is a Promise)
        await ns.singularity.installBackdoor();

        ns.tprint(`Success: Backdoor installed on ${target}`);

        // Return to home so you can connect to the next target
        ns.singularity.connect("home");
      } catch (e) {
        ns.tprint(`Failed to install backdoor on ${target} (maybe low skill?)`);
        ns.singularity.connect("home"); // Return even on error
      }
    }
  }
}
