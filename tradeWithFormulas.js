/**
 * tradeWithFormulas.js
 * BitBurner: automated stock trader using Formulas API.
 * Requirements: TIX API access + WSE account + stock market access.
 * Run with:
 * run tradeWithFormulas.js
 */

/** @param {NS} ns */
export async function main(ns) {
  if (!ns.stock.hasTIXAPIAccess()) {
    ns.tprint(
      "[tradeWithFormulas] Error: no TIX API access. Buy the Market Data upgrade first.",
    );
    return;
  }
  if (!ns.stock.hasWSEAccount()) {
    ns.tprint(
      "[tradeWithFormulas] Error: no WSE account. Buy the WSE account first.",
    );
    return;
  }

  ns.disableLog("sleep");
  ns.disableLog("stock.buy");
  ns.disableLog("stock.sell");

  const config = {
    checkIntervalMs: 5000,
    allocationPerStock: 0.16, // max % cash per symbol
    maxTotalAllocation: 0.7, // max 70% total capital in stocks
    longThreshold: 0.56,
    shortThreshold: 0.44,
    sellThreshold: 0.5,
    minForecastDelta: 0.02,
    maxSymbols: 10,
  };

  while (true) {
    try {
      const symbols = ns.stock.getSymbols();
      const cash = ns.getServerMoneyAvailable("home");
      const positions = symbols.map((sym) => {
        const [longShares, shortShares] = ns.stock.getPosition(sym);
        return { sym, longShares, shortShares };
      });

      // Evaluate each symbol using the Formulas API
      const symbolsData = symbols.map((sym) => {
        const forecast = ns.formulas.stock.getForecast(sym);
        const volatility = ns.formulas.stock.getVolatility(sym);
        const askPrice = ns.stock.getAskPrice(sym);
        const bidPrice = ns.stock.getBidPrice(sym);
        const maxShares = ns.formulas.stock.getMaxShares(sym);
        const position = ns.stock.getPosition(sym);
        const longShares = position[0];
        const shortShares = position[1];

        // Signal as deviation from neutral 0.5
        const signal = forecast - 0.5;
        const score = signal / Math.max(volatility, 0.0001);
        return {
          sym,
          forecast,
          volatility,
          askPrice,
          bidPrice,
          maxShares,
          longShares,
          shortShares,
          signal,
          score,
        };
      });

      // Sort by absolute signal strength (strongest opportunities first)
      symbolsData.sort((a, b) => Math.abs(b.signal) - Math.abs(a.signal));

      // Trade only top symbols
      const tradePool = symbolsData.slice(0, config.maxSymbols);

      // Close risky positions when forecast reverses
      for (const s of tradePool) {
        if (s.longShares > 0 && s.forecast < config.sellThreshold) {
          ns.stock.sell(s.sym, s.longShares);
          ns.print(
            `[tradeWithFormulas] Sold long ${s.sym} (${s.longShares}) forecast=${s.forecast.toFixed(4)}`,
          );
        }
        if (s.shortShares > 0 && s.forecast > 1 - config.sellThreshold) {
          ns.stock.sellShort(s.sym, s.shortShares);
          ns.print(
            `[tradeWithFormulas] Covered short ${s.sym} (${s.shortShares}) forecast=${s.forecast.toFixed(4)}`,
          );
        }
      }

      // Oblicz dostępną kwotę do nowych pozycji wg alokacji
      const targetTotal = cash * config.maxTotalAllocation;
      const currentSpend = symbolsData.reduce((sum, s) => {
        return sum + s.longShares * s.askPrice + s.shortShares * s.bidPrice;
      }, 0);
      const availableBuy = Math.max(0, targetTotal - currentSpend);

      for (const s of tradePool) {
        // Rule: if forecast > longThreshold, open long position
        if (s.forecast > config.longThreshold) {
          const budget = Math.min(
            availableBuy,
            cash * config.allocationPerStock,
          );
          const qty = Math.floor(budget / s.askPrice);
          if (qty > 0 && s.longShares < s.maxShares) {
            const buyQty = Math.min(qty, s.maxShares - s.longShares);
            ns.stock.buy(s.sym, buyQty);
            ns.print(
              `[tradeWithFormulas] Bought long ${s.sym} x${buyQty} forecast=${s.forecast.toFixed(4)}`,
            );
            availableBuy -= buyQty * s.askPrice;
          }
        }

        // If forecast < shortThreshold, open short position
        if (s.forecast < config.shortThreshold) {
          const budget = Math.min(
            availableBuy,
            cash * config.allocationPerStock,
          );
          const qty = Math.floor(budget / s.bidPrice);
          if (qty > 0 && s.shortShares < s.maxShares) {
            const sellQty = Math.min(qty, s.maxShares - s.shortShares);
            ns.stock.sellShort(s.sym, sellQty);
            ns.print(
              `[tradeWithFormulas] Opened short ${s.sym} x${sellQty} forecast=${s.forecast.toFixed(4)}`,
            );
            availableBuy -= sellQty * s.bidPrice;
          }
        }
      }

      ns.print(
        `[tradeWithFormulas] Iteration complete. cash=${ns.nFormat(ns.getServerMoneyAvailable("home"), "$0.00a")}`,
      );
    } catch (error) {
      ns.tprint(`[tradeWithFormulas] Error: ${error}`);
    }
    await ns.sleep(config.checkIntervalMs);
  }
}
