import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import Note from "../models/Note.js";

const client = new OAuth2Client();

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || "thinkboard-secret-jwt-key-2026";
  return jwt.sign({ id }, secret, { expiresIn: "30d" });
};

export const guestLogin = async (req, res) => {
  try {
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const timestamp = Date.now();
    const guestEmail = `guest_${timestamp}_${randomSuffix}@thinkboard.local`;

    const user = await User.create({
      email: guestEmail,
      name: "Guest User",
      isGuest: true,
      avatar: "",
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isGuest: user.isGuest,
      },
      token,
    });
  } catch (error) {
    console.error("Error in guestLogin controller:", error);
    return res.status(500).json({ message: "Failed to create guest account" });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { credential, access_token, guestUserId } = req.body;

    if (!credential && !access_token) {
      return res.status(400).json({ message: "Google credential or access token is required" });
    }

    let payload;

    // 1. Try fetching Google User Info if access_token provided (from useGoogleLogin hook)
    if (access_token) {
      try {
        const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        if (userInfoRes.ok) {
          const info = await userInfoRes.json();
          payload = {
            sub: info.sub,
            email: info.email,
            name: info.name,
            picture: info.picture,
          };
        }
      } catch (err) {
        console.warn("Failed to fetch userinfo from Google access_token:", err.message);
      }
    }

    // 2. Try verifying Google ID token if credential provided
    if (!payload && credential) {
      try {
        const googleClientId = process.env.GOOGLE_CLIENT_ID;
        if (googleClientId) {
          const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: googleClientId,
          });
          payload = ticket.getPayload();
        } else {
          payload = jwt.decode(credential);
        }
      } catch (verifyErr) {
        console.warn("Google ID token verification failed with client ID, trying fallback decode:", verifyErr.message);
        payload = jwt.decode(credential);
      }
    }

    if (!payload || (!payload.sub && !payload.email)) {
      return res.status(400).json({ message: "Invalid Google authorization data" });
    }

    const { sub: googleId, email, name, picture: avatar } = payload;

    let user = await User.findOne({
      $or: [{ googleId }, { email }],
    });

    if (user) {
      // Update existing user profile details
      user.googleId = googleId || user.googleId;
      user.name = name || user.name;
      user.avatar = avatar || user.avatar;
      user.isGuest = false;
      await user.save();
    } else {
      // Create new Google User
      user = await User.create({
        googleId,
        email: email || `user_${googleId}@gmail.com`,
        name: name || "Google User",
        avatar: avatar || "",
        isGuest: false,
      });
    }

    // Merge Guest Notes if guestUserId provided
    let mergedNotesCount = 0;
    if (
      guestUserId &&
      guestUserId !== user._id.toString() &&
      guestUserId.match(/^[0-9a-fA-F]{24}$/)
    ) {
      const guestUser = await User.findById(guestUserId);
      if (guestUser && guestUser.isGuest) {
        const result = await Note.updateMany(
          { user: guestUserId },
          { user: user._id }
        );
        mergedNotesCount = result.modifiedCount;

        // Clean up temporary guest user record
        await User.findByIdAndDelete(guestUserId);
        console.log(
          `Merged ${mergedNotesCount} notes from guest ${guestUserId} to Google user ${user._id}`
        );
      }
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isGuest: user.isGuest,
      },
      token,
      mergedNotesCount,
    });
  } catch (error) {
    console.error("Error in googleLogin controller:", error);
    return res.status(500).json({ message: "Google authentication failed" });
  }
};

export const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
      isGuest: req.user.isGuest,
    });
  } catch (error) {
    console.error("Error in getMe controller:", error);
    return res.status(500).json({ message: "Failed to fetch user profile" });
  }
};
