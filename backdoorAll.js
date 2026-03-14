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
        ns.tprint(`Instalowanie backdoora na ${target}...`);

        // Musisz tam "wejść" fizycznie
        ns.singularity.connect(target);

        // CZEKAMY na zakończenie instalacji (to jest Promise!)
        await ns.singularity.installBackdoor();

        ns.tprint(`Sukces: Backdoor zainstalowany na ${target}`);

        // Powrót na home, żeby móc połączyć się z kolejnym celem
        ns.singularity.connect("home");
      } catch (e) {
        ns.tprint(
          `Nie udało się zainstalować backdoora na ${target} (za niski skill?)`,
        );
        ns.singularity.connect("home"); // Wróć nawet jeśli błąd
      }
    }
  }
}
