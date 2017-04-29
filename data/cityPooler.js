//require modules
var pgp = require('pg-promise')();
var config = {
    user: 'postgres',
    database: 'postgres',
    host: '127.0.0.1',
    port: '5432',
    password: process.env.DB_PASSWORD
};
var pool = pgp(config);
/**
 * GET request
 * Returns cityId, cityName, lat and lng
 */
exports.getCities = function(req, res){
    pool.many('SELECT * FROM aviato.cities')
    .then(function(data){
        res.status(200).send(data);
    })
    .catch(function(err){
        console.log(err);
        res.status(200).send("Error");
    })
}