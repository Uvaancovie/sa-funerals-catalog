import type { VercelRequest, VercelResponse } from '@vercel/node';
import clientPromise from '../lib/mongodb';
import { requireAdmin } from '../lib/auth';
import { ObjectId } from 'mongodb';

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Require admin authentication
    const admin = requireAdmin(req, res);
    if (!admin) return;

    const client = await clientPromise;
    const db = client.db('safuneral');

    try {
        // GET: List all customers
        if (req.method === 'GET') {
            const { status, search } = req.query;

            let filter: any = { role: 'customer' };

            if (status && typeof status === 'string') {
                filter.status = status;
            }

            if (search && typeof search === 'string') {
                filter.$or = [
                    { email: { $regex: search, $options: 'i' } },
                    { companyName: { $regex: search, $options: 'i' } },
                    { contactPerson: { $regex: search, $options: 'i' } }
                ];
            }

            const customers = await db.collection('users')
                .find(filter)
                .project({ password: 0 }) // Exclude password
                .sort({ createdAt: -1 })
                .toArray();

            return res.status(200).json({ customers });
        }

        // POST: Manually add a customer
        if (req.method === 'POST') {
            const { email, companyName, contactPerson, phone, address, status } = req.body;

            if (!email || !companyName || !contactPerson || !phone) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            // Check if user already exists
            const existingUser = await db.collection('users').findOne({ email: email.toLowerCase() });
            if (existingUser) {
                return res.status(400).json({ error: 'Email already exists' });
            }

            const newCustomer = {
                email: email.toLowerCase(),
                password: '', // No password for manually added customers - they'll need to reset
                companyName,
                contactPerson,
                phone,
                address: address || '',
                role: 'customer' as const,
                status: status || 'approved' as const,
                createdAt: new Date(),
                lastLogin: null,
                addedBy: admin.userId
            };

            const result = await db.collection('users').insertOne(newCustomer);

            return res.status(201).json({
                success: true,
                message: 'Customer added successfully',
                customerId: result.insertedId
            });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Customer management error:', error);
        return res.status(500).json({ error: 'Operation failed' });
    }
}
