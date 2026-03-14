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

  let scriptName = ns.args[0];

  scanNetwork("home");
  let purchased = ns.getPurchasedServers();
  let targets = Array.from(allServers).filter(
    (host) => !purchased.includes(host) && host !== "home",
  );

  for (let target of targets) {
    await ns.scp(scriptName, target, "home");

    if (!ns.hasRootAccess(target)) {
      try {
        ns.httpworm(target);
        ns.sqlinject(target);
        ns.ftpcrack(target);
        ns.relaysmtp(target);
        ns.brutessh(target);
        ns.nuke(target);
      } catch (e) {
        ns.tprint(`Cannot get root privilege on ${target}`);
      }
    }

    ns.killall(target);
    let freeRam = ns.getServerMaxRam(target) - ns.getServerUsedRam(target);
    let scriptRam = ns.getScriptRam(scriptName);
    let threads = Math.floor(freeRam / scriptRam);

    if (threads > 0) {
      ns.exec(scriptName, target, threads, target);
      ns.tprint(`Script run on ${target} (${threads} threads)`);
    }
  }
}
