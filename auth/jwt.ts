import { Request } from "express"
import { config } from "dotenv";
import { Strategy } from "passport-jwt";
import passport from "passport";
config({ path: "../.env" });

const cookieExtractor = (req: Request): string | null => {
  return req?.signedCookies?.token || null;
};

const opt = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new Strategy(opt, (jwt_payload, done): void => {
    try {
      const { expiration } = jwt_payload;
      if (Date.now() > expiration) {
        return done("Unauthorized", false);
      }
      return done(null, jwt_payload);
    } catch (err) {
      return done(err);
    }
  })
);