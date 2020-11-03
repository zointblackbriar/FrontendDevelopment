/**
 * Created by projecttest on 12/2/16.
 */

//routing for index.html
module.exports = function(app)
{
    app.get('/', function(req, res)
    {
        res.sendFile('./index.html');
    });
};


