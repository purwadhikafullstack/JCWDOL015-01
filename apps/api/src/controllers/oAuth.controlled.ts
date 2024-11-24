import { Request, Response } from "express";
import {
    getGoogleOauthToken,
    getGoogleUser,
  } from "../services/session.service";
import prisma from "@/prisma";
import { sign } from "jsonwebtoken";

export class OAuthController {
    async googleOauthHandler (req: Request, res: Response) {
        const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN as unknown as string;
      
        try {
          const code = req.query.code as string;
          const pathUrl = (req.query.state as string) || "/";
      
          if (!code) {
            return res.status(401).json({
              status: "fail",
              message: "Authorization code not provided!",
            });
          }
      
          const { id_token, access_token } = await getGoogleOauthToken({ code });
      
          const { name, verified_email, email, picture } = await getGoogleUser({
            id_token,
            access_token,
          });
      
          if (!verified_email) {
            return res.status(403).json({
              status: "fail",
              message: "Google account not verified",
            });
          }
      
          const user = await prisma.user.upsert({
            where: { email },
            create: {
              name,
              email,
              profilePicture: picture,
              password: "",
              isVerified: true,
            },
            update: { name, email, profilePicture: picture },
          });
      
          if (!user) return res.redirect(`${FRONTEND_ORIGIN}/oauth/error`);
      
          const payload = { id: user.id , email: user.email };
          const token = sign(payload, process.env.JWT!, { expiresIn: '1h' });
          
          res.cookie("token", token)
          res.redirect(`${FRONTEND_ORIGIN}${pathUrl}`);
        } catch (err: any) {
          console.log("Failed to authorize Google User", err);
          return res.redirect(`${FRONTEND_ORIGIN}/oauth/error`);
        }
      };
}