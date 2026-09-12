import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = global._mongooseCache ?? {
  conn: null,
  promise: null,
};
global._mongooseCache = cache;

// IMPORTANT: MONGODB_URI is read here, inside connectDB(), rather than at
// module-load time. Reading it as a top-level `const` meant this module
// captured whatever process.env.MONGODB_URI happened to be the instant it
// was first imported — which broke standalone scripts (e.g. `tsx
// scripts/seed.ts`) that load .env.local via dotenv *after* their other
// imports have already run, since dotenv hadn't populated process.env yet
// by the time this module's top-level code executed. Reading it lazily
// inside the function means it's evaluated only when connectDB() is
// actually called, by which point any dotenv.config() call earlier in the
// caller's script has already run.
export async function connectDB() {
  if (cache.conn) return cache.conn;

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not set. Add it to .env.local (for `next dev`/`next build`) " +
        "— standalone scripts like `npm run seed` also need it available via dotenv.",
    );
  }

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(MONGODB_URI, { bufferCommands: false })
      .then((m) => m);
  }
  cache.conn = await cache.promise;
  return cache.conn;
}
