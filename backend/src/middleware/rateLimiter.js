import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    const clientIdentifier =
      req.ip ||
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      "127.0.0.1";

    const { success } = await ratelimit.limit(clientIdentifier);

    if (!success) {
      return res.status(429).json({
        message: "Too many requests, please try again later",
      });
    }

    next();
  } catch (error) {
    console.log("Rate limit error (bypassing):", error);
    // Allow request to proceed if rate limiter service has issues
    next();
  }
};

export default rateLimiter;

