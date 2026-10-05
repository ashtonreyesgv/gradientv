// one thing a client asked to have changed on their site
// (it's ChangeRequest and not Request so it never gets mixed up with Express's req)
import mongoose from 'mongoose';

// the order they move through. i'm the only one who moves them
export const STATUSES = ['new', 'in progress', 'done'];
export const MESSAGE_MAX = 2000;

const changeRequestSchema = new mongoose.Schema({
    // whose request it is. every query for a client filters on this, so it gets an index
    account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true, index: true },
    message: { type: String, required: true, trim: true, maxlength: MESSAGE_MAX },
    status: { type: String, enum: STATUSES, default: 'new' }
}, { timestamps: true });

export const ChangeRequest = mongoose.model('ChangeRequest', changeRequestSchema);
