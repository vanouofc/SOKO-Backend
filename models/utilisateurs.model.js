import mongoose from "mongoose";

const utilisateurSchema = new mongoose.Schema({
    nom: {
        type: String,
        minlength: 2,
        trim: true,
        required: [true, "Le nom est requis."]
    },
    prenom: {
        type: String,
        minlength: 2,
        trim: true
    },
    email: {
        type: String,
        required: [true, "L'email est requis."],
        match: [/\S+@\S+\.\S+/, 'Renseigner un email valide.'],
        lowercase: true,
        unique: true,
        trim: true
    },
    role: {
        type: String,
        enum: {
            values: ['secretaire', 'responsable', 'admin'],
            message: "L'utilisateur doit etre un secretaire ou un responsable."
        },
        minlength: 5,
        maxlength: 11,
        default: 'secretaire',
        trim: true
    },
    photo: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        required: [true, "Le numero de telephone est requis"],
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

utilisateurSchema.pre('find', function () {
    this.where({ isActive: true });
});
utilisateurSchema.pre("findOne", function () {
    this.where({ isActive: true });
});

const Utilisateur = mongoose.model('Utilisateur', utilisateurSchema);

export default Utilisateur;