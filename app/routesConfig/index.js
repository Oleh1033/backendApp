const Routes = require('./routes');
module.exports = function(app, dbCompany) {
    Routes(app, dbCompany);
}