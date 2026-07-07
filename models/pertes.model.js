import mongoose from 'mongoose';

const perteSchema = new mongoose.Schema({
    produit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Produit',
        required: true,
        index: true
    },
    quantite: {
        type: Number,
        required: true,
        min: 1
    },
    boutique: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Boutique',
        required: true
    },
    raison: {
        type: String,
        enum: ['Endomagé', 'Périmé', 'Volé', 'Autre'],
        required: true
    }, // Motif de la perte
    details: {
        type: String
    }, // Détails (Ex: "Inondation dans l'allée B")
    utilisateur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Utilisateur',
        required: true
    }, // Qui a déclaré la perte
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
    },
}, { timestamps: true });

perteSchema.pre("find", function () {
    this.where({ isActive: true });
});
perteSchema.pre("findOne", function () {
    this.where({ isActive: true });
});


export const Perte = mongoose.model('Perte', perteSchema);