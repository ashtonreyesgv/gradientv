// one finished self-assessment on a client's site
// the site scores it in the visitor's browser and sends only the outcome here.
// there is nothing on it about who took it, on purpose: no name, no email, no IP.
// it must stay that way, and it must never point at a Subscriber. the client's
// privacy policy promises visitors that the two are not linked
import mongoose from 'mongoose';

export const RISK_LEVELS = ['low', 'medium', 'high'];
/** what a site's short name for an assessment may look like: 'hospital-quick-check' */
export const TYPE_PATTERN = /^[a-z0-9-]{1,60}$/;
export const LABEL_MAX = 80;

const assessmentResultSchema = new mongoose.Schema({
    // whose site it was taken on. every query filters on this, so it gets an index
    account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true, index: true },
    // the site's own short name for the assessment
    assessmentType: { type: String, required: true, match: TYPE_PATTERN },
    // the name to show for it in the portal. optional: old rows don't have one
    label: { type: String, default: null, trim: true, maxlength: LABEL_MAX },
    score: { type: Number, required: true, min: 0, max: 100 },
    riskLevel: { type: String, required: true, enum: RISK_LEVELS },
    // only on rows brought over from an older database: the id the row had there
    importedId: { type: String, default: null }
}, { timestamps: true });

// importing the same file twice must not double the rows.
// (partial: the rule only applies to rows that have an importedId at all)
assessmentResultSchema.index(
    { account: 1, importedId: 1 },
    { unique: true, partialFilterExpression: { importedId: { $type: 'string' } } }
);

export const AssessmentResult = mongoose.model('AssessmentResult', assessmentResultSchema);
