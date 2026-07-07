import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const RESEND_API_KEY = process.env.RESEND_API_KEY;
if (!RESEND_API_KEY) {
    throw new Error("Veuillez renseigner la clé API Resend.");
};

const FROM = process.env.FROM;
if (!FROM) {
    throw new Error("Veuillez renseigner l'adresse email d'expedition.");
};

const resend = new Resend(RESEND_API_KEY);

export async function sendEmail({ to, subject, html }) {
    const { data, error } = await resend.emails.send({
        from: FROM,
        to,
        subject,
        html,
    });

    if (error) {
        console.error("Erreur Resend:", error);
        return;
    }

    console.log("Email envoyé:", data);
};