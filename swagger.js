import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'SOKO - Stock Management API',
    description: "API de gestion de stock et de suivi des ventes/pertes pour l'application SOKO."
  },
  host: 'localhost:3000',
  tags: [
    { name: 'Boutiques', description: 'Gestion des boutiques' },
    { name: 'Produits', description: 'Gestion des produits' },
    { name: 'Stocks', description: 'Gestion des stocks et mouvements' },
    { name: 'Ventes', description: 'Gestion des ventes' },
    { name: 'Pertes', description: 'Gestion des pertes' },
    { name: 'Utilisateurs', description: 'Gestion des utilisateurs et profils' },
  ],
  definitions: {
    Boutique: {
      nom: "Boutique Centre",
      adresse: "Yaoundé Centre",
      contact: "+237699999999",
      localisation: { type: "Point", coordinates: [11.5, 3.8] }
    },
    Produit: {
      sku: "PROD-123",
      nom: "Clavier Mécanique",
      photo: "https://example.com/photo.jpg",
      boutique: "60d5f484f1a2c8b1f8e4e1a1",
      description: "Clavier mécanique RGB",
      type: "Clavier",
      prixAchat: 15000,
      model: "MK-870"
    },
    Stock: {
      produit: "60d5f484f1a2c8b1f8e4e1a1",
      boutique: "60d5f484f1a2c8b1f8e4e1a1",
      quantite: 50,
      prix: 25000,
      minStockAlert: 5
    },
    Vente: {
      boutique: "60d5f484f1a2c8b1f8e4e1a1",
      items: [
        { produit: "60d5f484f1a2c8b1f8e4e1a1", quantite: 2, prixdeVente: 25000 }
      ]
    },
    Perte: {
      boutique: "60d5f484f1a2c8b1f8e4e1a1",
      produit: "60d5f484f1a2c8b1f8e4e1a1",
      quantite: 3,
      raison: "Endommagé",
      details: "Produit cassé lors du transport"
    },
    Utilisateur: {
      nom: "Dupont",
      prenom: "Jean",
      email: "jean@example.com",
      role: "secretaire",
      phone: "+237699999999",
      photo: "https://example.com/photo.jpg"
    }
  }
};

const outputFile = './swagger-output.json';
const routes = ['./app.js'];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, routes, doc);