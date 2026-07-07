import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema({
    produit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Produit',
        required: true,
    },
    quantite: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    prix: {
        type: Number,
        required: true,
        min: 0,
    },
    minStockAlert: {
        type: Number,
        default: 4
    }, // Seuil pour alerter le dashboard en cas de rupture proche
    lastInventoryDate: {
        type: Date,
        default: Date.now
    }, // Dernière fois que le stock a été vérifié manuellement
    boutique: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Boutique',
        required: true
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
    },
}, { timestamps: true });

stockSchema.index({ produit: 1, boutique: 1 }, { unique: true });

stockSchema.pre("find", function () {
    this.where({ isActive: true });
});
stockSchema.pre("findOne", function () {
    this.where({ isActive: true });
});

const Stock = mongoose.model('Stock', stockSchema);

export default Stock;