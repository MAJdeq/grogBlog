import { prisma } from "../lib/db";
import bcrypt from "bcrypt";

const email = process.env.ADMIN_EMAIL!;
const password = process.env.ADMIN_PASSWORD!;
const name = process.env.ADMIN_NAME!;

async function main() {
  // Check if admin exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`✅ User already exists: ${email}`);

    if (existing.role != "ADMIN"){
      const updateUser = await prisma.user.update({
        where: {
          email: existing.email,
        },
        data: {
          role: "ADMIN",
        },
      })
      console.log(`Updated user: ${updateUser}`)
    }
    return;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create admin
  const admin = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: "ADMIN",
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