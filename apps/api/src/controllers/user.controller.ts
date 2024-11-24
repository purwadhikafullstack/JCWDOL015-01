import prisma from '@/prisma';
import { Request, Response } from 'express';
import { compare, genSalt, hash } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { sendMailBlockedAccount, sendMailChangeEmail, sendMailUser } from '@/helper/nodemailer';

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
        include: {
          subscriptions: true,
          applications: {
            include: { job: true },
          },
          notifications: true,
        },
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
            lastLogin: new Date(),
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
            data: { loginAttempts: 1, lastLogin: new Date() },
          });
        }

        return res.status(400).send({
          status: 'error',
          message: 'Password not match',
        });
      }

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

  async checkEmail(req: Request, res: Response) {
    try {
      const { email } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if(user && !user.isBlocked) throw new Error('Account is fine, this is a test error');

      if (!user) {
        return res.status(400).send({
          status: 'error',
          message: 'Account not found',
        });
      } else if (user && user.isBlocked) {
        sendMailBlockedAccount(user.email);
        return res.status(200).send({
          status: 'success',
          message: 'Account found, email sent',
          data: user,
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

  async updateProfile(req: Request, res: Response) {
    try {
      const { name, gender, address, birthDate, education } = req.body;
      const { email } = req.user!;
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) throw new Error('Account not found');
      const updatedUser = await prisma.user.update({
        where: { email },
        data: { name, gender, address, birthDate: new Date(birthDate), education },
      });

      res.status(200).send({
        status: 'success',
        message: 'Profile update successful',
        updatedUser,
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
      const { email: oldEmail } = req.user!;

      const existingUser = await prisma.user.findUnique({
        where: { email: oldEmail },
      });

      const existingUserEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (!existingUser) throw new Error('Account not found');
      if (existingUserEmail) throw new Error('Email already exists');

      await sendMailChangeEmail(email);

      await prisma.user.update({
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

  async changeProfilePicture(req: Request, res: Response) {
    try {
      if (!req.file) throw new Error('file not found');

      const link = `http://localhost:8000/api/public/profile-picture/${req?.file?.filename}`;
      await prisma.user.update({
        data: {
          profilePicture: link,
        },
        where: {
          id: req.user?.id,
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
