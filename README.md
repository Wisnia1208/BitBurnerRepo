# BitBurnerRepo

This repository contains scripts for the BitBurner game (JavaScript/TypeScript scripts run in the game terminal). The goal is to manage and develop automated bots in BitBurner from VS Code.

## Structure

- `test.js` - sample hack/grow/weaken loop for server `n00dles`
- `universalHack.js` - universal loop script that accepts target server as argument
- `serverArmy.js` - runs a specified script on purchased servers (max threads)
- `share.js` - continuous `ns.share()` script
- `backdoorAll.js` - scans network and attempts to backdoor available servers
- `sendToAllAutomate.js` - copies and runs a script on all reachable servers
- `n00dles.js`, `hackSelf.js` - auto-farm variants for one specific target
- `findContracts.js` - scans all reachable hosts and prints ones with coding contracts + paths
- `sendToAllAutomate.js` - copies and runs a script on all reachable servers
- `backdoorAll.js` - scans and installs backdoors on servers
- `caesarCipher.js`, `CaesarCipher.java` - Caesar cipher example code
- `algorithmicStockTraderIII.js` - coding contract solution for 2-transactions stock trader
- `maxSubarraySum.js` - maximum subarray sum (Kadane) contract helper

## How to use

1. Copy or edit scripts in this repo (e.g. `universalHack.js`).
2. In BitBurner on server `home`, create the file with `nano <filename>.js` and paste the code, or use `scp` if you have a file transfer method.
3. Run the script in BitBurner:

```sh
run universalHack.js n00dles
```

Or for `serverArmy.js`:

```sh
run serverArmy.js universalHack.js
```

## Tips

- Before running, ensure you have root access and required programs (e.g. `BruteSSH.exe`, `FTPCrack.exe`).
- For RAM-heavy scripts, check `ns.getScriptRam(...)` and `ns.getServerMaxRam(...)`.

## Note

BitBurner stores files virtually inside the game. You can:

- Copy code manually from VS Code to `nano` in BitBurner.
- Use a BitBurner extension/plugin (like [Bitburner VSCode Plugin](https://marketplace.visualstudio.com/items?itemName=bitburner.vscode-bitburner)) to upload scripts directly from your workspace to the game server, without manual copy/paste.
- Use in-game `scp` to transfer files if you have a transfer method.

Using a plugin is usually much faster and keeps your local repo and game files in sync.
