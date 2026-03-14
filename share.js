/** @param {NS} ns **/
export async function main(ns) {
  while (true) {
    await ns.share(); // This function always lasts 10 seconds
  }
}
