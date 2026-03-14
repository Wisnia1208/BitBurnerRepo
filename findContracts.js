/** @param {NS} ns */
export async function main(ns) {
  const visited = new Set();
  const queue = ["home"];
  const hostsWithContracts = [];

  while (queue.length) {
    const host = queue.shift();
    if (visited.has(host)) continue;
    visited.add(host);

    const contracts = ns.ls(host, ".cct");
    if (contracts.length > 0) {
      hostsWithContracts.push({
        host,
        contractCount: contracts.length,
        contracts,
      });
    }

    const neighbors = ns.scan(host);
    for (const next of neighbors) {
      if (!visited.has(next)) queue.push(next);
    }
  }

  if (hostsWithContracts.length === 0) {
    ns.tprint("No coding contracts found on scanned hosts.");
    return;
  }

  ns.tprint(`Found coding contracts on ${hostsWithContracts.length} host(s):`);
  for (const data of hostsWithContracts) {
    ns.tprint(`- ${data.host}: ${data.contractCount} contract(s)`);
    for (const contractFile of data.contracts) {
      ns.tprint(`    - ${contractFile}`);
    }
  }

  // Optional: return structured result for scripts that call this script via run
  return hostsWithContracts;
}
