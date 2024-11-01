// import { PrismaClient } from '@prisma/client';

// export default new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
