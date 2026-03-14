/** @param {NS} ns */
export async function main(ns) {
  let scriptName = ns.args[0];
  let servers = ns.getPurchasedServers();

  for (let server of servers) {
    ns.killall(server);
    let freeRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
    let scriptRam = ns.getScriptRam(scriptName);
    let threads = Math.floor(freeRam / scriptRam);

    if (threads > 0) {
      ns.exec(scriptName, server, threads, server);
      ns.tprint(`Script run on ${server} (${threads} threads)`);
    }
  }
}
