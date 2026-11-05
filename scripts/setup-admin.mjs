import { createRequire } from "node:module";
import { createInterface } from "node:readline/promises";
import { Writable } from "node:stream";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const require = createRequire(import.meta.url);
require("@next/env").loadEnvConfig(process.cwd());
const email = (process.env.ADMIN_EMAIL || "ronidev39@gmail.com")
  .trim()
  .toLowerCase();
if (!process.env.MONGODB_URI)
  throw Error("Set MONGODB_URI in .env.local first");
try {
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 8000,
  });
  const users = mongoose.connection.collection("users");
  let user = await users.findOne({ email });
  if (user?.deletedAt)
    throw Error(
      "The owner account is disabled. Restore it in your database before setup.",
    );
  {
    if (!process.stdin.isTTY)
      throw Error("Run this script in an interactive terminal.");
    let muted = false;
    const output = new Writable({
      write(chunk, encoding, done) {
        if (!muted) process.stdout.write(chunk);
        done();
      },
    });
    const input = createInterface({
      input: process.stdin,
      output,
      terminal: true,
    });
    process.stdout.write(
      `${user ? "Verify existing" : "Create"} owner account ${email}\nPassword (8–72 characters; hidden): `,
    );
    muted = true;
    const password = await input.question("");
    muted = false;
    process.stdout.write("\n");
    input.close();
    if (password.length < 8 || password.length > 72)
      throw Error("Password must be 8–72 characters");
    if (user) {
      if (!(await bcrypt.compare(password, user.password)))
        throw Error(
          "The existing account password did not match. No changes were made.",
        );
    } else {
      const result = await users.insertOne({
        email,
        name: "Roni dev",
        password: await bcrypt.hash(password, 12),
        favorites: [],
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      user = { _id: result.insertedId };
    }
  }
  console.log(
    `Owner account ready. Add these to Vercel Production environment variables, then redeploy:\nADMIN_EMAIL=${email}\nADMIN_USER_ID=${user._id}\nExisting passwords are never changed by this script.`,
  );
} finally {
  await mongoose.disconnect();
}
