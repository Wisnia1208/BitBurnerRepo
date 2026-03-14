/** @param {NS} ns */
export async function main(ns) {
  const visited = new Set(["home"]);
  const queue = [{ host: "home", path: ["home"] }];
  const hostsWithContracts = [];

  while (queue.length) {
    const { host, path } = queue.shift();

    const contracts = ns.ls(host, ".cct");
    if (contracts.length > 0) {
      hostsWithContracts.push({
        host,
        contractCount: contracts.length,
        contracts,
        path,
      });
    }

    const neighbors = ns.scan(host);
    for (const next of neighbors) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push({ host: next, path: [...path, next] });
      }
    }
  }

  if (hostsWithContracts.length === 0) {
    ns.tprint("No coding contracts found on scanned hosts.");
    return;
  }

  ns.tprint(`Found coding contracts on ${hostsWithContracts.length} host(s):`);
  for (const data of hostsWithContracts) {
    ns.tprint(`- ${data.host}: ${data.contractCount} contract(s)`);
    ns.tprint(`    Path: ${data.path.join(" -> ")}`);
    for (const contractFile of data.contracts) {
      ns.tprint(`    - ${contractFile}`);
    }
  }

  // Optional: return structured result for scripts that call this script via run
  return hostsWithContracts;
}
