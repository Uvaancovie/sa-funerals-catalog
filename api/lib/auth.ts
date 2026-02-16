import jwt from 'jsonwebtoken';
import { VercelRequest, VercelResponse } from '@vercel/node';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface UserPayload {
    userId: string;
    email: string;
    role: 'customer' | 'admin';
    status: 'pending' | 'approved' | 'declined';
}

export function generateToken(payload: UserPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): UserPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as UserPayload;
    } catch (error) {
        return null;
    }
}

export function extractToken(req: VercelRequest): string | null {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }
    return null;
}

export function requireAuth(req: VercelRequest, res: VercelResponse): UserPayload | null {
    const token = extractToken(req);
    if (!token) {
        res.status(401).json({ error: 'Authentication required' });
        return null;
    }

    const user = verifyToken(token);
    if (!user) {
        res.status(401).json({ error: 'Invalid or expired token' });
        return null;
    }

    return user;
}

export function requireAdmin(req: VercelRequest, res: VercelResponse): UserPayload | null {
    const user = requireAuth(req, res);
    if (!user) return null;

    if (user.role !== 'admin') {
        res.status(403).json({ error: 'Admin access required' });
        return null;
    }

    return user;
}

export function requireApproved(req: VercelRequest, res: VercelResponse): UserPayload | null {
    const user = requireAuth(req, res);
    if (!user) return null;

    if (user.status !== 'approved' && user.role !== 'admin') {
        res.status(403).json({ error: 'Account approval required' });
        return null;
    }

    return user;
}
