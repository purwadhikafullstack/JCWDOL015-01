import { Request, Response } from 'express';
import pdf from 'pdfkit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const generateCV = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body; 
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                name: true,
                education: true,
                address: true,
                profilePictureUrl: true,
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        // Buat PDF
        const doc = new pdf();
        let buffers: any[] = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            res
                .contentType('application/pdf')
                .setHeader('Content-Disposition', 'attachment; filename=CV.pdf')
                .send(pdfData);
        });


        doc.fontSize(20).text(user.name ?? "", { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Education: ${user.education || 'Tidak tersedia'}`);
        doc.moveDown();
        doc.fontSize(12).text('Experience')
        doc.moveDown();
        doc.text(`Address: ${user.address || 'Tidak tersedia'}`);

        doc.end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error dalam pembuatan CV' });
    }
};