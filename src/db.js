require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');


const sequelize = new Sequelize(`postgres://phaiqkpehdkorr:cfe367df9b2e297d3c9adc0e2b01978b8c9205f450d0f520f390a4afdc4f83b5@ec2-54-209-221-231.compute-1.amazonaws.com:5432/dbs8qiharvu2mr`,
    {
        logging: false, // set to console.log to see the raw SQL queries
        native: false,
        dialect: "postgres",
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        }, // lets Sequelize know we can use pg-native for ~30% more speed
    });
const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
    .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
    .forEach((file) => {
        modelDefiners.push(require(path.join(__dirname, '/models', file)));
    });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Videogame, Genre, Platforms } = sequelize.models;

// Aca vendrian las relaciones
// Product.hasMany(Reviews);

Videogame.belongsToMany(Genre, { through: "videogamegenre" })
Genre.belongsToMany(Videogame, { through: "videogamegenre" })

Videogame.belongsToMany(Platforms, { through: "videogameplatform" })
Platforms.belongsToMany(Videogame, { through: "videogameplatform" })


module.exports = {
    ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
    conn: sequelize,     // para importart la conexión { conn } = require('./db.js');
};
