/**
 * Shared auth helper for all API routes.
 * Validates the X-Password header against the APP_PASSWORD env variable.
 * Returns true if valid, false otherwise.
 */
export function checkAuth(req, res) {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return false;
  }

  const password = req.headers["x-password"] || "";
  const expected = process.env.APP_PASSWORD || "";

  if (!expected) {
    // No password set — deny all for safety
    res.status(500).json({ error: "APP_PASSWORD environment variable is not set." });
    return false;
  }

  if (password !== expected) {
    res.status(401).json({ error: "Unauthorized: invalid password." });
    return false;
  }

  return true;
}
