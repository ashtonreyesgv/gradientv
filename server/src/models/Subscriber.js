// one email address that signed up for a client's newsletter on their site
// kept apart from AssessmentResult on purpose. nothing here says what else that
// person did on the site, and nothing should be added that does
import mongoose from 'mongoose';

/** which page they signed up from, as the site names it: 'quick-check' */
export const SOURCE_PATTERN = /^[a-z0-9-]{1,60}$/;
// 254 is as long as an email address can be
export const EMAIL_MAX = 254;

const subscriberSchema = new mongoose.Schema({
    // whose newsletter it is
    account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: EMAIL_MAX },
    sourcePage: { type: String, default: null, match: SOURCE_PATTERN }
}, { timestamps: true });

// one row per address per client: signing up twice changes nothing.
// two different clients can still each have the same person on their list
subscriberSchema.index({ account: 1, email: 1 }, { unique: true });

export const Subscriber = mongoose.model('Subscriber', subscriberSchema);
