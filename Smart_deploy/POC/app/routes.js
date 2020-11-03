/**
 * Created by projecttest on 1/14/17.
 */
//routing for index.html
module.exports = function(app)
{
    app.get('/', function(req, res)
    {
        res.sendFile('./index.html');
    });
};
