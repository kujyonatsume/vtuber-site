import fs from "fs";
import { config } from "dotenv";
import { exec, execSync } from "child_process";

config();

const { NAME, DOMAIN, PORT } = process.env;

// tunnel.cmd create [name] [hostname] [localPort]
// tunnel.cmd run [name]
// tunnel.cmd delete [name]
// tunnel.cmd list

if (fs.existsSync("D:/#/tunnel.cmd")) {
  if (!fs.existsSync(`C:/Users/adam2/.cloudflared/config-${NAME}.yml`))
    execSync(`D:/#/tunnel.cmd create ${NAME} ${DOMAIN} ${PORT}`);

  const tunnel = exec(`D:/#/tunnel.cmd run ${NAME}`);
  process.on("exit", () => {
    console.log("kill tunnel");
    tunnel.kill();
  });
}


import("./.output/server/index.mjs");
console.log("https://" + DOMAIN);
