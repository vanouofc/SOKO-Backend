import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'SOKO - Stock Management API',
    description: "API de gestion de stock et de suivi des ventes/pertes pour l'application SOKO."
  },
  host: 'localhost:3000'
};

const outputFile = './swagger-output.json';
const routes = ['./routes/boutiques.routes.js', './routes/produits.routes.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen()(outputFile, routes, doc);