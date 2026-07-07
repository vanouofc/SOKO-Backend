import mongoose from 'mongoose';

const elementVenduSchema = new mongoose.Schema({
    produit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Produit',
        required: true
    },
    quantite: {
        type: Number,
        required: true,
        min: 1
    },
    prixdeVente: {
        type: Number,
        required: true
    } // Crucial : On enregistre le prix au moment de la vente (si le prix du produit change plus tard, l'historique reste juste)
});

const venteSchema = new mongoose.Schema({
    numeroFacture: {
        type: String,
        required: true,
        unique: true
    }, // Numéro de facture (Ex: VNT-2026-001)
    items: [elementVenduSchema], // Permet de vendre plusieurs produits en une seule fois
    boutique: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Boutique',
        required: true
    },
    montantTotal: {
        type: Number,
        required: true,
        min: 0
    },
    utilisateur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Utilisateur',
        required: true
    }, // Le vendeur connecté
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
}, { timestamps: true });// Le 'createdAt' servira d'axe X pour tes graphiques temporels

venteSchema.pre("find", function () {
    this.where({ isActive: true});
});
venteSchema.pre("findOne", function () {
    this.where({ isActive: true});
});

export const Vente = mongoose.model('Vente', venteSchema);