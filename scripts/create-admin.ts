import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as readline from "readline";

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.log("\n=== Create Admin User ===\n");

  const email = await question("Email: ");
  if (!email || !email.includes("@")) {
    console.error("Invalid email format.");
    process.exit(1);
  }

  const password = await question("Password: ");
  if (!password || password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  const confirm = await question("Confirm Password: ");
  if (password !== confirm) {
    console.error("Passwords do not match.");
    process.exit(1);
  }

  const name = await question("Full Name: ") || "Admin";

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      hashedPassword,
      role: "SUPER_ADMIN",
      name,
    },
    create: {
      email,
      hashedPassword,
      role: "SUPER_ADMIN",
      name,
    },
  });

  console.log(`\n✅ Admin user created successfully!`);
  console.log(`   Email: ${user.email}`);
  console.log(`   Role: SUPER_ADMIN\n`);

  rl.close();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
