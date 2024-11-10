import prisma from "@/prisma";

class JobModel {
    static delete(id: number) {
      throw new Error('Method not implemented.');
    }
    static async findById(id: number) {
        return await prisma.job.findUnique({ where: { id } });
    }

    static async update(id: number, updateData: any) {
        const job = await this.findById(id);
        if (!job) return null; // Job not found

        return await prisma.job.update({
            where: { id },
            data: updateData,
        });
    }

    // Add more methods as needed
}

export default JobModel;
