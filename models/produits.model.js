import mongoose from "mongoose";

const produitSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: [true, "Le SKU est requis."],
      unique: true,
      uppercase: true,
      trim: true,
    },
    nom: {
      type: String,
      minLength: [2, "Le nom du produit doit contenir au moins 2 caracteres."],
      required: [true, "Le nom du produit est requis."],
    },
    photo: {
      type: String,
      trim: true,
    },
    model: {
        type: String,
        trim: true
    },
    boutique: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boutique",
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    prixAchat: {
      type: Number,
      required: true,
      min: 0,
    },
    type: {
      type: String,
      trim: true,
      enum: {
        values: [
          "Carte mère",
          "Processeur",
          "Clavier",
          "Souris",
          "Ecran",
          "Accessoire",
          "RAM",
          "Disque dur",
          "Alimentation",
          "Boitier",
          "Ventilateur",
          "Refroidisseur",
          "Autre",
        ],
        message: "Type invalide.",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    restoredAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

produitSchema.pre("find", function () {
  this.where({ isActive: true });
});
produitSchema.pre("findOne", function () {
  this.where({ isActive: true });
});

produitSchema.index({ boutique: 1, sku: 1 }, { unique: true });

const Produit = mongoose.model("Produit", produitSchema);

export default Produit;
