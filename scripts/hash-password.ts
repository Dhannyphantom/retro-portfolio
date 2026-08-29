/**
 * Generates the admin password hash and prints it ready to paste into
 * .env.local.
 *
 * Why base64 instead of the raw bcrypt hash: bcrypt hashes contain `$`
 * characters (e.g. $2b$10$...), and Next.js's env loader (@next/env, which
 * wraps dotenv + dotenv-expand) treats `$word` as a variable reference and
 * silently strips it — whether or not the value is quoted. Storing the hash
 * base64-encoded removes every `$` from the file, so this can't happen
 * regardless of quoting. The app decodes it back before comparing.
 *
 * Usage: npm run hash -- "yourpassword"
 */
import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error("Usage: npm run hash -- \"yourpassword\"");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
const encoded = Buffer.from(hash, "utf8").toString("base64");

console.log("\nAdd this line to .env.local:\n");
console.log(`ADMIN_PASSWORD_HASH_B64=${encoded}\n`);
