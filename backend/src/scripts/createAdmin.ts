import { prisma } from "../lib/db";
import bcrypt from "bcrypt";

const email = process.env.ADMIN_EMAIL!;
const password = process.env.ADMIN_PASSWORD!;
const name = process.env.ADMIN_NAME!;

async function main() {
  // Check if admin exists
  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    console.log(`✅ Admin already exists: ${email}`);
    return;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create admin
  const admin = await prisma.admin.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  console.log(`✅ Admin created:`, { id: admin.id, email: admin.email });
}

main()
  .catch((e) => {
    console.error("❌ Failed to create admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });