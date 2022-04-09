//--------------------------------------------------------------------
// File information.

// Name:      app.js
// Purpose:   node.js app main file
// License:   TBD
// Revision:  220402

//--------------------------------------------------------------------
// Disclaimer.

// This software is provided "AS IS" AND THE AUTHOR DISCLAIMS ALL WAR-
// RANTIES WITH REGARD TO THIS SOFTWARE  INCLUDING ALL IMPLIED WARRAN-
// TIES OF MERCHANTABILITY AND FITNESS.  IN NO EVENT  SHALL THE AUTHOR
// BE LIABLE FOR ANY  SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAM-
// AGES OR  ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR
// PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TOR-
// TIOUS ACTION,  ARISING OUT OF OR IN CONNECTION WITH THE USE OR PER-
// FORMANCE OF THIS SOFTWARE.

//--------------------------------------------------------------------
// Overview.

//### Explain CRUD API here,

//--------------------------------------------------------------------
// Program parameters.

var dbdir    = './database'                 ;
var dbfile   = 'helpline.db'                ;
var dbpath   = dbdir + '/' + dbfile         ;

var port     = process.env.PORT || 3033     ;
var hostname = '0.0.0.0'                    ;

//--------------------------------------------------------------------

var sqlite3 = require ('sqlite3').verbose() ;
var express = require ('express')           ;
var app     = express()                     ;

//### How is error here handled?
//### What creates the subdir?
//###
var db = new sqlite3.Database (dbpath)          ; 
app.set("view engine","ejs")                    ;
app.use(express.static(__dirname + '/public'))  ;

//--------------------------------------------------------------------
// Utility routine.

function HandleResult (err, str_op_type) {
    var foo;

    if (err) {
        console.error(err.message);
        return "Error during" + str_op_type;
    }

    foo = str_op_type + " successful";
    console.log (foo);
    return foo;
}

//--------------------------------------------------------------------
// DB Handle

// db.run ('CREATE TABLE IF NOT EXISTS emergency(id TEXT, name TEXT)');

//--------------------------------------------------------------------
// HomePage

app.get("/",function(req,res){
	res.render("home.ejs");
});

//--------------------------------------------------------------------
// Operation: Read. ### different from other Read how?

app.get ('/view/:country', function (req, res) {
    db.serialize (() => {
        db.each (`SELECT Country COUNTRY, Emergency EMERGENCY,
        Police POLICE, Ambulance AMBULANCE, Fire FIRE,
        "Call Codes" CALLCODES FROM helpcode WHERE UPPER(Country) = ?
        UNION ALL
        SELECT NULL, NULL, NULL, NULL, NULL, NULL
        LIMIT 1;`,
            [req.params.country.toUpperCase()], function (err, row) {

            if (err) {
                res.send ("[GET]: failed on /view/"+req.params.country);
                return console.error (err.message);
            }

            res.send(row);
            /*
            res.send(`COUNTRY: ${row.COUNTRY}, ` +
            `EMERGENCY: ${row.EMERGENCY}, POLICE: ${row.POLICE}, ` +
            `AMBULANCE: ${row.AMBULANCE}, FIRE: ${row.FIRE}, ` +
            `CALL CODES: ${row.CALLCODES} \n`);
            */
            console.log ("[GET]: successful on /view/"+req.params.country);
        });
    });
});

//--------------------------------------------------------------------
// ### What? ALL DB

app.get ('/allhelp', function (req, res) {
    var records = [];

    db.serialize(() => {
        db.all (`SELECT Country COUNTRY, Emergency EMERGENCY,
        Police POLICE, Ambulance AMBULANCE, Fire FIRE,
        "Call Codes" CALLCODES FROM helpcode ORDER BY Country`,
            [], (err , rows) => {

            if (err) {
                console.log ("[GET]: failed on /allhelp")
                console.log (err.message);
//### should this return or throw an error or what?
            }

            res.send(rows);
            console.log ("[GET]: successful on /allhelp");

            /*
            // console.log (rows);
            rows.forEach ((row) => {
                res.write(`COUNTRY: ${row.COUNTRY}, ` +
                `EMERGENCY: ${row.EMERGENCY}, POLICE: ${row.POLICE}, ` +
                `AMBULANCE: ${row.AMBULANCE}, FIRE: ${row.FIRE}, ` +
                `CALL CODES: ${row.CALLCODES} \n`);
            })
            res.end();
            */
        });
    });
});

//--------------------------------------------------------------------
// Fallback Request.
app.get("*", (req,res) => {
    res.render("404.ejs");
});

//--------------------------------------------------------------------
// Main program (Listener).

app.listen (port, hostname, function() {
    console.log ("Server started on port: "+ port);
});

//--------------------------------------------------------------------
// End of file.
