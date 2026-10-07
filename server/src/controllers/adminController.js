// the controllers only i can use. all of it runs behind requireAuth and then requireAdmin
import { toClientJSON } from '../dto/accountDTO.js';
import { Account } from '../models/Account.js';

/** GET /api/admin/clients -> every client login, by name. the list the "view as" menu is made from */
export async function listClients(req, res) {
    const clients = await Account.find({ role: 'client' }).sort('businessName email').lean();
    res.json(clients.map(toClientJSON));
}
