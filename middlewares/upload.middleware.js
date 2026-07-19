import fs from "fs";
import multer from "multer";
import path from "path";

const UPLOAD_ROOT = path.resolve("uploads");
const PRODUITS_DIR = path.join(UPLOAD_ROOT, "produits");

// Crée les dossiers d'upload s'ils n'existent pas encore.
for (const dir of [UPLOAD_ROOT, PRODUITS_DIR]) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, PRODUITS_DIR),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, uniqueName);
    },
});

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function fileFilter(req, file, cb) {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Format d'image non supporté (JPEG, PNG, WEBP ou GIF uniquement)."));
    }
}

export const uploadProduitImage = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo
}).single("photo");
