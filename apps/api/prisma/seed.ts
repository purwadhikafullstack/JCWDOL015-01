import { DeveloperRole, PrismaClient } from "@prisma/client";
import { genSalt, hash } from "bcrypt";
import dotenv from "dotenv";

const Prisma = new PrismaClient()
dotenv.config()

async function main() {
    const mail_user = process.env.MAIL_USER
    const mail_pass = process.env.MAIL_PASS

    if (!mail_user || !mail_pass) {
        console.error("Email atau password tidak ditemukan di .env");
        process.exit(1);
    }

    const salt = await genSalt(10)
    const hashedPass = await hash(mail_pass, salt)

    const developer = await Prisma.developer.create({
        data: {
            email: mail_user,
            password: hashedPass,
            role: DeveloperRole.ADMIN,
        }
    })
    console.log('Developer Account was Created', developer)
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        Prisma.$disconnect();
    })