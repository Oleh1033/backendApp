const Routes = require('./routes');
module.exports = function(app, dbKudos) {
    Routes(app, dbKudos);
}