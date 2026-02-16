import { Db } from 'mongodb';
import bcrypt from 'bcryptjs';

const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL?.toLowerCase() || 'admin@safuneralsupplies.co.za';
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin123!';
const DEFAULT_ADMIN_COMPANY = process.env.ADMIN_COMPANY_NAME || 'SA Funeral Supplies';
const DEFAULT_ADMIN_CONTACT = process.env.ADMIN_CONTACT_PERSON || 'Admin User';
const DEFAULT_ADMIN_PHONE = process.env.ADMIN_PHONE || '+27 31 508 6700';

export async function ensureDefaultAdmin(db: Db): Promise<void> {
    const users = db.collection('users');
    const adminCount = await users.countDocuments({ role: 'admin' });

    if (adminCount > 0) {
        return;
    }

    const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);
    const existingUserWithEmail = await users.findOne({ email: DEFAULT_ADMIN_EMAIL });

    if (existingUserWithEmail) {
        await users.updateOne(
            { _id: existingUserWithEmail._id },
            {
                $set: {
                    password: hashedPassword,
                    role: 'admin',
                    status: 'approved',
                    companyName: existingUserWithEmail.companyName || DEFAULT_ADMIN_COMPANY,
                    contactPerson: existingUserWithEmail.contactPerson || DEFAULT_ADMIN_CONTACT,
                    phone: existingUserWithEmail.phone || DEFAULT_ADMIN_PHONE,
                    updatedAt: new Date()
                }
            }
        );
        return;
    }

    await users.insertOne({
        email: DEFAULT_ADMIN_EMAIL,
        password: hashedPassword,
        companyName: DEFAULT_ADMIN_COMPANY,
        contactPerson: DEFAULT_ADMIN_CONTACT,
        phone: DEFAULT_ADMIN_PHONE,
        address: '',
        role: 'admin',
        status: 'approved',
        createdAt: new Date(),
        lastLogin: null
    });
}
