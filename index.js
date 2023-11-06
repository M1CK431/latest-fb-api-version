import http from "node:http";
import { execFile } from "node:child_process";
import { argv, exit } from "node:process";
import { JSDOM } from "jsdom";

const {
  HOST = "0.0.0.0",
  PORT = 3000,
  UPDATE_INTERVAL = 86400,
  ON_CHANGE
} = process.env;
const changelogURL =
  "https://developers.facebook.com/docs/graph-api/changelog?locale=en_US";

let state, expires;

const onChange = async ({ version, updatedAt }) => {
  console.info(`${updatedAt.toISOString()} - New API version is ${version}`);
  if (!ON_CHANGE) return;

  if (URL.canParse(ON_CHANGE))
    return fetch(ON_CHANGE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ version, updatedAt })
    });

  try {
    execFile(ON_CHANGE, [version, updatedAt.toISOString()]);
  } catch {}
};

const init = async () => {
  const dom = await JSDOM.fromURL(changelogURL);
  const version =
    dom.window.document.querySelector("h1 + table code").textContent;
  const updatedAt = new Date();

  state && state.version !== version && onChange({ version, updatedAt });

  state = { version, updatedAt };
  expires = new Date(
    new Date(updatedAt).setSeconds(updatedAt.getSeconds() + UPDATE_INTERVAL)
  );
  setInterval(init, UPDATE_INTERVAL * 1000);
};

await init();
if (argv[2] === "--cli") {
  console.info(state.version);
  exit();
}

const server = http.createServer((_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Expires", expires.toUTCString());
  res.end(JSON.stringify(state));
});

server.listen(PORT, HOST, () =>
  console.log(`Listening on http://${HOST}:${PORT}`)
);
