import dns from "node:dns/promises";

console.log(await dns.resolve4("google.com"));