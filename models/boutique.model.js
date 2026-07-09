import mongoose from 'mongoose';

const boutiqueSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: [true, "Le nom de la boutique est requis."],
        trim: true,
        unique: true
    },
    localisation: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: {
            type: [Number],  // [longitude, latitude]
            // index: '2dsphere'  // Pour les requêtes géospatiales
        }
    },
    adresse: {
        type: String,
        trim: true,
        required: [true, "l'adresse de la boutique est requise."]
    },
    responsables: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Utilisateur',
        required: true
    }],
    contact: {
        type: String,
        trim: true,
        required: [true, "Le contact de la boutique est requis."]
    },
    isActive: {
        type: Boolean,
        default: true

    },
    deletedAt: {
        type: Date,
        default: null
    },
    restoredAt: {
        type: Date,
        default: null
    }

}, { timestamps: true });

boutiqueSchema.pre("find", function () {
    this.where({ isActive: true });
});
boutiqueSchema.pre("findOne", function () {
    this.where({ isActive: true });
});

const Boutique = mongoose.model('Boutique', boutiqueSchema);

export default Boutique;