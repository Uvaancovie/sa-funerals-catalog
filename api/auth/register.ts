import type { VercelRequest, VercelResponse } from '@vercel/node';
import clientPromise from '../lib/mongodb';
import bcrypt from 'bcryptjs';

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email, password, companyName, contactPerson, phone, address } = req.body;

        // Validation
        if (!email || !password || !companyName || !contactPerson || !phone) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const client = await clientPromise;
        const db = client.db('safuneral');

        // Check if user already exists
        const existingUser = await db.collection('users').findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = {
            email: email.toLowerCase(),
            password: hashedPassword,
            companyName,
            contactPerson,
            phone,
            address: address || '',
            role: 'customer' as const,
            status: 'pending' as const,
            createdAt: new Date(),
            lastLogin: null
        };

        const result = await db.collection('users').insertOne(newUser);

        return res.status(201).json({
            success: true,
            message: 'Registration successful. Your account is pending approval.',
            userId: result.insertedId
        });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ error: 'Registration failed' });
    }
}
