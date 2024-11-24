import prisma from '@/prisma';
import { Request, Response } from 'express';
import { compare, genSalt, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { sendMailAdmin, sendMailBlockedAccount, sendMailChangeEmail } from '@/helper/nodemailer';

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

      const admin = await prisma.admin.findUnique({
        where: { email },
        include: { jobs: true, notifications: true },
      });

      const auth = await prisma.auth.findUnique({
        where: { email },
      });

      if (auth) {
        await prisma.auth.update({
          where: { email },
          data: { loginAttempts: 1, lastLogin: new Date() },
        });
      }

      if (!auth) {
        await prisma.auth.create({
          data: {
            email: email,
            password: password,
            adminId: admin?.id,
            loginAttempts: 1,
            lastLogin: new Date(),
          },
        });
      } else if (auth.loginAttempts >= 3) {
        await prisma.admin.update({
          where: { email },
          data: { isBlocked: true },
        });

        return res.status(400).send({
          status: 'error',
          message: 'Multiple failed login attempts. Account is blocked',
        });
      }

      if (!admin) throw new Error('Account not found');

      const isMatch = await compare(password, admin.password);

      if (!isMatch) throw new Error('Password not match');

      const payload = { id: admin.id, email: admin.email };
      const token = sign(payload, process.env.JWT!);

      return res.status(200).send({
        status: 'success',
        message: 'Login successful',
        token,
        admin,
      });
    } catch (error) {
      return res.status(400).send({
        status: 'error',
        message: 'Login failed',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async checkEmail(req: Request, res: Response) {
    try {
      const { email } = req.body;

      const admin = await prisma.admin.findUnique({
        where: { email },
      });

      if (admin && !admin.isBlocked)
        throw new Error('Account is fine, this is a test error');

      if (!admin) {
        return res.status(400).send({
          status: 'error',
          message: 'Account not found',
        });
      } else if (admin && admin.isBlocked) {
        sendMailBlockedAccount(admin.email);
        return res.status(200).send({
          status: 'success',
          message: 'Account found, email sent',
          data: admin,
        });
      }
    } catch (error) {
      return res.status(400).send({
        status: 'error',
        message: 'Account not found',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { oldPassword, newPassword, confirmNewPassword } = req.body;

      const { email } = req.admin!;

      const admin = await prisma.admin.findUnique({
        where: { email: email },
      });

      if (!admin) throw new Error('Account not found');

      if (!admin.password) throw new Error('Password not found');
      const isMatch = await compare(oldPassword, admin.password);
      if (!isMatch) throw new Error('Old password not match');

      if (newPassword === oldPassword)
        throw new Error('New password cannot be the same as old password');

      if (newPassword !== confirmNewPassword)
        throw new Error('New password not match');

      const salt = await genSalt(10);
      const hashedPassword = await hash(newPassword, salt);

      await prisma.admin.update({
        where: { email: email },
        data: {
          password: hashedPassword,
          isBlocked: false,
        },
      });

      await prisma.auth.update({
        where: { email: email },
        data: { loginAttempts: 0 },
      })

      return res.status(200).send({
        status: 'success',
        message: 'Password reset successful',
      });
    } catch (error) {
      return res.status(400).send({
        status: 'error',
        message: 'Password reset failed',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const { companyName, companyDescription, phoneNumber } = req.body;
      const { email } = req.admin!;
      const admin = await prisma.admin.findUnique({
        where: { email },
      });

      if (!admin) throw new Error('Account not found');
      const updatedAdmin = await prisma.admin.update({
        where: { email },
        data: { companyName, companyDescription, phoneNumber },
      });

      res.status(200).send({
        status: 'success',
        message: 'Profile update successful',
        updatedAdmin,
      });
    } catch (error) {
      return res.status(400).send({
        status: 'error',
        message: 'Profile update failed',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async changeEmail(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const { email: oldEmail } = req.admin!;

      const existingAdmin = await prisma.admin.findUnique({
        where: { email: oldEmail },
      });

      const existingAdminEmail = await prisma.admin.findUnique({
        where: { email },
      });

      if (!existingAdmin) throw new Error('Account not found');
      if (existingAdminEmail) throw new Error('Email already exists');

      await sendMailChangeEmail(email);

      await prisma.admin.update({
        where: { email: oldEmail },
        data: { email },
      });

      return res.status(200).send({
        status: 'success',
        message: 'Email change successful',
      });
    } catch (error) {
      return res.status(400).send({
        status: 'error',
        message: 'Email change failed',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      const { oldPassword, newPassword, confirmNewPassword } = req.body;
      const { email } = req.admin!;

      const admin = await prisma.admin.findUnique({
        where: { email: email },
      });

      if (!admin) throw new Error('Account not found');

      if (!admin.password) throw new Error('Password not found');
      const isMatch = await compare(oldPassword, admin.password);
      if (!isMatch) throw new Error('Old password not match');

      if (newPassword === oldPassword)
        throw new Error('New password cannot be the same as old password');

      if (newPassword !== confirmNewPassword)
        throw new Error('New password not match');

      const salt = await genSalt(10);
      const hashedPassword = await hash(newPassword, salt);

      await prisma.admin.update({
        where: { email: email },
        data: {
          password: hashedPassword,
          isBlocked: false,
        },
      });

      return res.status(200).send({
        status: 'success',
        message: 'Password change successful',
      });
    } catch (error) {
      return res.status(400).send({
        status: 'error',
        message: 'Password change failed',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async changeCompanyLogo(req: Request, res: Response) {
    try {
      if (!req.file) throw new Error('file not found');

      const link = `http://localhost:8000/api/public/company-logo/${req?.file?.filename}`;
      await prisma.admin.update({
        data: {
          companyLogo: link,
        },
        where: {
          id: req.admin?.id,
        },
      });
      res.status(200).send({
        status: 'ok',
        msg: 'profile picture updated',
      });
    } catch (err) {
      console.log(err);
      res.status(400).send({
        status: 'err',
        msg: err instanceof Error ? err.message : 'something went wrong',
      });
    }
  }
}
