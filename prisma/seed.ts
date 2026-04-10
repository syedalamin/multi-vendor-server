import { UserRole, Gender, Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../src/utils/share/prisma";

const seedAdmin = async () => {
  const existingUser = await prisma.user.findUnique({
    where: { email: "trustyshoptbd@gmail.com" },
  });

  if (existingUser) {
    console.log("Admin already exists");
    return;
  }

  const hashedPassword: string = await bcrypt.hash("trustyshoptbd@gmail.com", 12);

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const user = await tx.user.create({
      data: {
        email: "trustyshoptbd@gmail.com",
        password: hashedPassword,
        role: UserRole.ADMIN,
      },
    });

    await tx.admin.create({
      data: {
        firstName: "Syed",
        lastName: "Alamin",
        email: user.email,
        contactNumber: "01315831065",
        gender: Gender.MALE,
        profilePhoto: "https://example.com/profile.jpg",
        address: "Dhaka, Bangladesh",
      },
    });
  });

  console.log("Admin seeded successfully");
};

const createHomePageImages = async () => {
  const existing = await prisma.homePageImages.findUnique({
    where: { id: "home_page_single_entry" },
  });

  if (!existing) {
    await prisma.homePageImages.create({
      data: { id: "home_page_single_entry" },
    });
    console.log("Home page images entry created");
  }
};

export const seedDatabase = {
  seedAdmin,
  createHomePageImages,
};