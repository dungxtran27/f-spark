import passport from "passport";
import dotenv from "dotenv";
import { AuthenticateRepository } from "../repository/index.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URI}api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      try {
        const existingUser = await AuthenticateRepository.getUserByEmail(
          profile._json.email
        );
        if (existingUser) {
          const { createdAt, updatedAt, ...filteredUser } = existingUser;
          done(null, filteredUser);
        } else {
          done(null, { error: "Email not found, consider signing up" });
        }
      } catch (error) {
        done(error);
      }
    }
  )
);
