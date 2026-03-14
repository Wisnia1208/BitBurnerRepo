/** @param {NS} ns */
export async function main(ns, hostname) {
  // Pobieramy pierwszy argument podany przy uruchamianiu
  const target = ns.args[0];

  // Sprawdzamy, czy użytkownik podał nazwę serwera
  if (!target) {
    ns.tprint(
      "Błąd: Musisz podać nazwę serwera! Przykład: run universalHack.js n00dles",
    );
    return;
  }

  // Definiujemy progi operacyjne
  const moneyThresh = ns.getServerMaxMoney(target) * 0.75; // Celujemy w 75% max kasy
  const securityThresh = ns.getServerMinSecurityLevel(target) + 5; // Tolerujemy +5 do trudności

  while (true) {
    if (ns.getServerSecurityLevel(target) > securityThresh) {
      // 1. Jeśli serwer jest zbyt trudny - osłabiamy go
      await ns.weaken(target);
    } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
      // 2. Jeśli jest mało pieniędzy - doładowujemy go
      await ns.grow(target);
    } else {
      // 3. Jeśli wszystko jest w normie - kradniemy!
      await ns.hack(target);
    }
  }
}
