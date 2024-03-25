import jwt from "jsonwebtoken";

interface TokenOptions {
  email?: string;
  ownerId: string;
  projectId: string;
  expiresIn?: string; // Optional expiration time (e.g., '1h' for 1 hour, '2d' for 2 days)
}

export function generateJwtToken(options: TokenOptions): string {
  const { email, ownerId, expiresIn, projectId } = options;

  // Prepare the JWT payload
  const payload = {
    email,
    ownerId,
    projectId,
  };

  // Sign the JWT
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET_KEY!,
    expiresIn ? { expiresIn } : undefined
  );

  return token;
}

export function verifyJwtToken(token: string): string | jwt.JwtPayload {
  return jwt.verify(token, process.env.JWT_SECRET_KEY!);
}

export function generateJWTTokenAnyPayload(payload: any, expiresIn?: string) {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY!, {
    expiresIn,
  });
}
