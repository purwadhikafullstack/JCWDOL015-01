import prisma from '@/prisma';
import { Request, Response } from 'express';
import { compare, genSalt, hash } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { sendMailBlockedUser, sendMailUser } from '@/helper/nodemailer';

export class UserController {
  async googleRegisterOrLogin(req: Request, res: Response) {
    try {
      const { email, name } = req.body;

      let user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: email,
            name: name,
            isVerified: true
          },
        });
      }

      const payload = { id: user.id, email: user.email };
      const token = sign(payload, process.env.JWT!);

      return res.status(200).send({
        status: 'success',
        message: user ? 'Login successful' : 'Registration successful',
        token,
        user,
      });
    } catch (error) {
      return res.status(400).send({
        status: 'error',
        message: 'Google authentication failed',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
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

      const auth = await prisma.auth.findUnique({
        where: { email },
      });

      if (!auth) {
        await prisma.auth.create({
          data: {
            email: email,
            password: password,
            userId: user?.id,
            loginAttempts: 1,
          },
        });
      } else if (auth.loginAttempts >= 3) {
        await prisma.user.update({
          where: { email },
          data: { isBlocked: true },
        });

        return res.status(400).send({
          status: 'error',
          message: 'Multiple failed login attempts. Account is blocked',
        });
      }

      if (!user) throw new Error('Account not found');

      if (!user.isVerified) {
        sendMailUser(user.id, user.email);

        return res.status(400).send({
          status: 'error',
          message:
            'Account not verified. A new verification email has been sent',
        });
      }

      if (!user.password) throw new Error('Password not found');
      const isMatch = await compare(password, user.password);

      if (!isMatch) {
        if (auth) {
          await prisma.auth.update({
            where: { email },
            data: { loginAttempts: auth.loginAttempts + 1 },
          });
        }

        return res.status(400).send({
          status: 'error',
          message: 'Password not match',
        });
      }

      const payload = { id: user.id, email: user.email };
      const token = sign(payload, process.env.JWT!);

      // change to this secure cookie for production
      // res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/;`);
      // for localhost
      const date = new Date(Date.now() + 86400000).toUTCString();
      res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; expires=${date};`);
      res.append('Set-Cookie', `isAdmin=false; HttpOnly; Path=/; expires=${date};`);

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

  async checkEmail(req: Request, res: Response) {
    try {
      const { email } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(400).send({
          status: 'error',
          message: 'Account not found',
        });
      } else if (user && user.isBlocked) {
        sendMailBlockedUser(user.email);
      }

      return res.status(200).send({
        status: 'success',
        message: 'Account found, email sent',
        data: user,
      });
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

      const { email } = req.user!;

      const user = await prisma.user.findUnique({
        where: { email: email },
      });

      if (!user) throw new Error('Account not found');

      if (!user.password) throw new Error('Password not found');
      const isMatch = await compare(oldPassword, user.password);
      if (!isMatch) throw new Error('Old password not match');

      if (newPassword === oldPassword)
        throw new Error('New password cannot be the same as old password');

      if (newPassword !== confirmNewPassword)
        throw new Error('New password not match');

      const salt = await genSalt(10);
      const hashedPassword = await hash(newPassword, salt);

      await prisma.user.update({
        where: { email: email },
        data: {
          password: hashedPassword,
          isBlocked: false,
        },
      });

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

  async isVerified(req: Request, res: Response) {
    try {
      const { email } = req.user!;
      const user = await prisma.user.findUnique({
        where: { email },
      });

      const isVerified = user?.isVerified;

      return res.status(200).send({
        status: 'success',
        message: 'Check verification successful',
        isVerified,
      });
    } catch (error) {
      return res.status(400).send({
        status: 'error',
        message: 'Error',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async setDefaultPassword(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({
        where: { email }
      });

      const salt = await genSalt(10);
      const hashedPassword = await hash(password, salt);

      await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          isBlocked: false,
        },
      });

      return res.status(200).send({
        status: 'success',
        message: 'Password reset successful',
      });
    } catch (error) {
      return res.status(400).send({
        status: 'error',
        message: 'Error',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      res.setHeader('Set-Cookie', 'token=; HttpOnly; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;');
      res.append('Set-Cookie', 'isAdmin=; HttpOnly; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;');
      return res.status(200).send({
        status: 'success',
        message: 'Logout successful',
      });
    } catch (error) {
      return res.status(400).send({
        status: 'error',
        message: 'Error',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
