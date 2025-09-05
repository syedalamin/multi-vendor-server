import { UserRole, Gender } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../src/utils/share/prisma";
import ApiError from "../src/utils/share/apiError";
import status from "http-status";

const seedAdmin = async () => {
  try {
    const isUserExist = await prisma.admin.findFirst({
      where: {
        email: "syedalamin@gmail.com",
      },
    });

    if (isUserExist) {
      throw new ApiError(status.CONFLICT, "User is already exists");
    }

    const hashedPassword: string = await bcrypt.hash("syedalamin@gmail", 12);

    const userData = {
      email: "syedalamin@gmail.com",
      password: hashedPassword,
      role: UserRole.ADMIN,
    };

    const result = await prisma.$transaction(async (transactionClient) => {
      const user = await transactionClient.user.create({
        data: userData,
      });
      const createdAdminData = await transactionClient.admin.create({
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

      return createdAdminData;
    });

    console.log("Admin Seed completed:", result);
  } catch (err) {
    console.error("Admin Seed failed:", err);
  } finally {
    await prisma.$disconnect();
  }
};

seedAdmin();
