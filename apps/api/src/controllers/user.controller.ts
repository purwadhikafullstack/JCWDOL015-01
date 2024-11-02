import prisma from '@/prisma';
import { Request, Response } from 'express';
import { compare, genSalt, hash } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { sendMailUser } from '@/helper/nodemailer';

export class UserController {
  async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const existingAccount = await prisma.user.findUnique({
        where: { email },
      });

      if (existingAccount) throw new Error('Account already exists');

      const salt = await genSalt(10);
      const hashedPassword = await hash(password, salt);

      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

      await sendMailUser(newUser.id, newUser.email);

      return res.status(200).send({
        status: 'success',
        message: 'Register successful',
        data: newUser,
      });
    } catch (error) {
      return res.status(400).send({
        status: 'error',
        message: 'Register failed',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async verify(req: Request, res: Response) {
    try {
      const decoded = verify(req.params.token, process.env.JWT!) as {
        id: number;
        email: string;
      };

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (user?.isVerified === true)
        throw new Error('Account already verified');

      await prisma.user.update({
        where: { id: decoded.id },
        data: { isVerified: true },
      });

      return res.status(200).send({
        status: 'success',
        message: 'Verification successful',
        data: user,
      });
    } catch (error) {
      return res.status(400).send({
        status: 'error',
        message: 'Verification failed',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) throw new Error('Account not found');

      if (!user.isVerified) {
        sendMailUser(user.id, user.email);

        return res.status(400).send({
          status: 'error',
          message:
            'Account not verified. A new verification email has been sent',
        });
      }

      const isMatch = await compare(password, user.password);

      if (!isMatch) throw new Error('Password not match');

      const payload = { id: user.id, email: user.email };
      const token = sign(payload, process.env.JWT!);

      return res.status(200).send({
        status: 'success',
        message: 'Login successful',
        token,
        user,
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
