import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdfkit'; // Library untuk membuat PDF

async function generateCV(userData: { name: string; education: string; address: string }) {
    const doc = new pdf();
    let buffers: any[] = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        return pdfData;
    });

    doc.fontSize(20).text(userData.name, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Education: ${userData.education || 'Tidak tersedia'}`);
    doc.moveDown();
    doc.fontSize(12).text(`Address: ${userData.address || 'Tidak tersedia'}`);
    doc.end();
}

export async function POST(req: NextRequest) {
    try {
        const { userId } = await req.json();

        const userData = {
            name: 'John Doe',
            education: 'Bachelor of Science in Computer Science',
            address: '123 Main Street, City, Country',
        };

        const pdfData = await generateCV(userData);

        return NextResponse.json(pdfData, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=CV.pdf',
            },
        });
    } catch (error) {
        console.error('Error generating CV:', error);
        return new NextResponse('Error generating CV', { status: 500 });
    }
}
