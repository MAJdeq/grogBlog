import { prisma } from "../lib/db";
import bcrypt from "bcrypt";

const email = process.env.ADMIN_EMAIL!;
const password = process.env.ADMIN_PASSWORD!;
const name = process.env.ADMIN_NAME!;

async function main() {
  // Check if admin exists
  const existing = await prisma.user.findUnique({ where: { email } });
  
  if (existing) {
    console.log(`✅ User exists: ${email}`);
    
    if (existing.role != "SUPERADMIN") {
      const updateUser = await prisma.user.update({
        where: {
          email: existing.email,
        },
        data: {
          role: "SUPERADMIN",
        },
      });
      console.log(`✅ Updated user role to SUPERADMIN:`, updateUser);
    } else {
      console.log(`✅ User already has SUPERADMIN role`);
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
      role: "SUPERADMIN",
      name,
    },
  });
  
  console.log(`✅ Super Admin created:`, { id: admin.id, email: admin.email });
}

main()
  .catch((e) => {
    console.error("❌ Failed to create admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });