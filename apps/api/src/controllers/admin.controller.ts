import prisma from '@/prisma';
import { Request, Response } from 'express';
import { compare, genSalt, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { sendMailAdmin } from '@/helper/nodemailer';

export class AdminController {
  async register(req: Request, res: Response) {
    try {
      const { companyName, email, password, phoneNumber } = req.body;

      const existingAccount = await prisma.admin.findUnique({
        where: { email },
      });

      if (existingAccount) throw new Error('Account already exists');

      const salt = await genSalt(10);
      const hashedPassword = await hash(password, salt);

      const newAdmin = await prisma.admin.create({
        data: {
          companyName,
          email,
          password: hashedPassword,
          phoneNumber,
          status: 'ACTIVE',
        },
      });

      await sendMailAdmin(newAdmin.email);

      return res.status(200).send({
        status: 'success',
        message: 'Register successful',
        data: newAdmin,
      });
    } catch (error) {
      return res.status(400).send({
        status: 'error',
        message: 'Register failed',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const Admin = await prisma.admin.findUnique({
        where: { email },
      });

      if (!Admin) throw new Error('Account not found');

      const isMatch = await compare(password, Admin.password);

      if (!isMatch) throw new Error('Password not match');

      const payload = { id: Admin.id, email: Admin.email };
      
      const token = sign(payload, process.env.JWT!);

      return res.status(200).send({
        status: 'success',
        message: 'Login successful',
        token,
        Admin,
      });
    } catch (error) {
      return res.status(400).send({
        status: 'error',
        message: 'Login failed',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
