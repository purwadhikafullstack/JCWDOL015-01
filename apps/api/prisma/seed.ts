import { PrismaClient } from "@prisma/client";

const Prisma = new PrismaClient()

async function main() {
    const user = await Prisma.user.create({
        data: {
            email: 'drdre@email.com',
            password: 'blyad123',
            name: 'Matthew Blakov',
            address: '23rd Gre Street',
            education: 'University of Almaty',
            birthDate: new Date('1990-02-05'),
        }
    })

    console.log("User Created: ", user)
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
       Prisma.$disconnect();
    })