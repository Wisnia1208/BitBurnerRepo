/** @param {NS} ns **/
export async function main(ns) {
  while (true) {
    await ns.share(); // Ta funkcja trwa zawsze 10 sekund
  }
}
