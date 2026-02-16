import type { VercelRequest, VercelResponse } from '@vercel/node';
import clientPromise from '../../lib/mongodb';
import { requireAdmin } from '../../lib/auth';
import { ObjectId } from 'mongodb';

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'PATCH') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Require admin authentication
    const admin = requireAdmin(req, res);
    if (!admin) return;

    try {
        const { id } = req.query;
        const { status, reason } = req.body;

        if (!id || typeof id !== 'string') {
            return res.status(400).json({ error: 'Customer ID required' });
        }

        if (!status || !['approved', 'declined', 'pending'].includes(status)) {
            return res.status(400).json({ error: 'Valid status required (approved, declined, pending)' });
        }

        const client = await clientPromise;
        const db = client.db('safuneral');

        const updateData: any = {
            status,
            updatedAt: new Date(),
            updatedBy: admin.userId
        };

        if (reason) {
            updateData.statusReason = reason;
        }

        const result = await db.collection('users').updateOne(
            { _id: new ObjectId(id), role: 'customer' },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        return res.status(200).json({
            success: true,
            message: `Customer ${status} successfully`
        });
    } catch (error) {
        console.error('Customer update error:', error);
        return res.status(500).json({ error: 'Update failed' });
    }
}
