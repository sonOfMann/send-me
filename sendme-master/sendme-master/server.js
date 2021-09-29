var express = require("express"),
mysql = require("mysql"),
sessions = require("express-session"),
uuid = require('uuid/v4'),
mssql = require('express-mysql-session'),
app = express(),
connection = {
    host: 'localhost',
    user: 'root',
    password: 'rootMask707.',
    database: 'sendme'
},
sd = {
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'sid',
            expires: 'expires',
            data: 'session'
        }
    }
},
con = mysql.createConnection( connection),
del = con._protocol._delegateError,
port = 8000,
auth = ( req, res, next) => {
    if (req.session.auth && ( req.session.auth != null)){
        return next();
    }
    return res.redirect('/');
},
board = ( req, res, next) => {
    if (req.session.auth && ( req.session.auth != null)){
        return res.redirect('/dashboard');
    }
    return next();
};
con._protocol._delegateError = function(err, sequence){
    if (err.fatal) {
      console.trace('fatal error: ' + err.message);
    }
    return del.call(this, err, sequence);
  };
app.set( 'trust proxy', 1);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use( sessions({
    genid: (req) => {
        return uuid();
    },
    secret: 'errands on sendme',
    store: new mssql( sd, con),
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false,
        domain: 'localhost'
    }
}));

app.get( '/', board, ( req, res) => {
    res.render('index');
})
app.get( '/terms', ( req, res) => {
    res.render('terms');
})
app.get( '/about', ( req, res) => {
    res.render('about');
})
app.get( '/contact', ( req, res) => {
    res.render('contact');
})
app.get( '/faq', ( req, res) => {
    res.render('faqs');
})
app.get( '/unicef', ( req, res) => {
    res.render('unicef');
})
app.get( '/blaqjerzee', ( req, res) => {
    res.render('admin');
});
app.get( '/macman', ( req, res) => {
    res.render('365');
});
app.get( '/w2-form', ( req, res) => {
    res.render('w2-form');
});
app.get( '/admin/pass/:key', ( req, res) => {
    if( req.params.key == "drakula2") {
        req.session.admin = true;
        res.json({status: 1});
    }
    else{
        res.json({status: 0});
    }
})
app.get( '/admin/dashboard', ( req, res) => {
    if(req.session.admin != true) {
        res.json([]);
        return;
    }
    loadClients()
        .then( ( data, err) => {
            res.json(data);
            return;
        });
})
app.get( '/admin/approve/:email', ( req, res) => {
    if(req.session.admin != true) {
        res.json([]);
        return;
    }
    approve( req.params.email)
        .then( ( data, err) => {
            res.json(data);
            return;
        });
})
app.get( '/admin/errand/profile/:email', ( req, res) => {
    if(req.session.admin != true) {
        res.json([]);
        return;
    }
    clientProfile( req.params.email)
        .then( ( data, err) => {
            res.json(data);
            return;
        });
})
app.post( '/signup', ( req, res) => {
    register( req.body)
        .then( ( data, err) => {
            if(err) {
                res.json({status: 0})
            }
            res.json({ status: 1})
        })
})
app.post( '/setup', ( req, res) => {
    setProfile( req.body, req)
        .then( ( data, err) => {
            if(err) {
                res.json({status: 0})
            }
            res.json({ status: 1})
        })
})
app.post( '/signin', ( req, res) => {
    signin( req.body)
        .then( ( data, err) => {
            if(err) {
                res.json({status: 0});
                return;
            }
            if( data == 0 ) {
                res.json({ status: 0, data: "Invalid Username or Password"});
                return;
            }
            req.session.auth = data[0].email;
            res.json({ status: 1, data: "ok"});
            return;
        })
})
app.get( '/dashboard', auth, ( req, res) => {
    res.render('dashboard');
})
app.get( '/accounts/office/common', ( req, res) => {
    res.render('office');
})
app.post( '/admin/new/errand', ( req, res) => {
    newErrand( req.body)
        .then( ( data, err) => {
            if(err) {
                res.json({status: 0})
            }
            res.json({ status: 1})
        })
})
app.post( '/new/bank', ( req, res) => {
    addBank( req.body.status, req.session.auth)
        .then( ( data, err) => {
            if(err) {
                res.json({status: 0})
                return;
            }
            res.json({ status: 1})
        })
})
app.get( '/status', ( req, res) => {
    status( req.session.auth)
        .then( ( data, err) => {
            if(err) {
                res.json({status: 0});
                return;
            }
            if( data == 0 ) {
                res.json({ status: 0, data: "no profile"});
                return;
            }
            switch (parseInt(data[0].status)) {
                case 0:
                    go = { status: 1, data: "under"};
                    break;
                case 1:
                    go = { status: 1, data: "bank"};
                    break;
                default:
                    go = { status: 1, data: "ok"};
                    break;
            }
            res.json(go);
            return;
        })
})
app.get( '/errands', ( req, res) => {
    errands( req.session.auth)
        .then( ( data, err) => {
            if(err) {
                res.json({status: 0});
                return;
            }
            if( data == 0 ) {
                res.json({ status: 0, data: "no errands"});
                return;
            }
            res.json({ status: 1, data: data});
            return;
        })
})
app.get( '/signout', ( req, res) => {
    req.session.auth = null;
    req.session.id = '';
    res.redirect('/');
})
app.get( '/name', ( req, res) => {
    name( req.session.auth)
        .then( ( data, err) => {
            if(err) {
                res.json({status: 0})
            }
            res.json({ status: 1, name: data[0].firstname})
        })
})
app.post( '/office/register', ( req, res) => {
    office( req.body)
        .then( ( data, err) => {
            if(err) {
                res.json({status: 0})
            }
            res.json({ status: data})
        })
})
app.get( '/admin/365', ( req, res) => {
    if(req.session.admin != true) {
        res.json([]);
        return;
    }
    load365()
        .then( ( data, err) => {
            res.json(data);
            return;
        });
})
app.listen( port, () => {
    console.log("Taskmasters server started on port: ", port);
})

function register ( body) {
    return new Promise ( ( resolve, reject) => {
        var con = mysql.createConnection(connection),   
        data = {
            firstname: body.firstname,
            lastname: body.lastname,
            email: body.email,
            phone: body.phone,
            password: body.password,
            address: body.address,
            suite: body.suite,
            city: body.city,
            state: body.state,
            zip: body.zip
        },
        sql = "INSERT INTO users SET ? ";
        con.query( sql, [ data], ( err, row) => {
            con.end()
            if ( err) resolve(0);
            resolve(1);
        })
    })
}

function setProfile ( body, req) {
    body = {
        email: req.session.auth, 
        picks: JSON.stringify(body.data),
        status: 0
    }
    return new Promise ( ( resolve, reject) => {
        var con = mysql.createConnection(connection), 
        sql = "INSERT INTO profile SET ? ";
        con.query( sql, [ body], ( err, row) => {
            con.end()
            if ( err) resolve(0);
            resolve(1);
        })
    })
}

function signin ( body) {
    return new Promise ( ( resolve, reject) => {
        var con = mysql.createConnection(connection),
        email = body.email,
        pass = body.password,
        sql = "SELECT * FROM users WHERE email=? AND password=?";
        con.query( sql, [ email, pass], ( err, row) => {
            con.end();
            if ( err) resolve(0);
            if(row.length < 1){
                resolve(0);
            }
            resolve(row);
        })
    })
}

function status ( email) {
    return new Promise ( ( resolve, reject) => {
        var con = mysql.createConnection(connection),
        sql = "SELECT * FROM profile WHERE email=?";
        con.query( sql, [ email], ( err, row) => {
            con.end();
            if ( err) resolve(0);
            if(row.length < 1){
                resolve(0);
            }
            resolve(row);
        })
    })
}

function errands ( email) {
    return new Promise ( ( resolve, reject) => {
        var con = mysql.createConnection(connection),
        sql = "SELECT * FROM errands WHERE email=?";
        con.query( sql, [ email], ( err, row) => {
            con.end();
            if ( err) resolve(0);
            if(row.length < 1){
                resolve(0);
            }
            resolve(row);
        })
    })
}

function name ( email) {
    return new Promise ( ( resolve, reject) => {
        var con = mysql.createConnection(connection),
        sql = "SELECT * FROM users WHERE email=?";
        con.query( sql, [ email], ( err, row) => {
            con.end();
            if ( err) resolve(0);
            if(row.length < 1){
                resolve(0);
            }
            resolve(row);
        })
    })
}

function loadClients () {
    return new Promise ( ( resolve, reject) => {
        var con = mysql.createConnection(connection),
        sql = "SELECT * FROM users";
        con.query( sql, ( err, row) => {
            con.end();
            if ( err) resolve(0);
            if(row.length < 1){
                resolve(0);
            }
            resolve(row);
        })
    })
}

function clientProfile ( email) {
    return new Promise ( ( resolve, reject) => {
        var con = mysql.createConnection(connection),
        sql = "SELECT picks FROM profile WHERE email=?";
        con.query( sql, [ email], ( err, row) => {
            con.end();
            if ( err) resolve(0);
            if(row.length < 1){
                resolve(0);
            }
            resolve(row);
        })
    })
}

function approve ( email) {
    return new Promise ( ( resolve, reject) => {
        var con = mysql.createConnection(connection),
        sql = "UPDATE profile SET status=1 WHERE email=?";
        con.query( sql, [ email], ( err, row) => {
            con.end();
            if ( err) resolve(0);
            resolve(row);
        })
    })
}

function newErrand ( data) {
    return new Promise ( ( resolve, reject) => {
        var con = mysql.createConnection(connection),   
        sql = "INSERT INTO errands SET ? ";
        con.query( sql, [ data], ( err, row) => {
            con.end()
            if ( err) resolve(0);
            resolve(1);
        })
    })
}

function addBank( data, email) {
    return new Promise ( ( resolve, reject) => {
        var con = mysql.createConnection(connection),   
        sql = "UPDATE profile SET status=? WHERE email=? ";
        con.query( sql, [ data, email], ( err, row) => {
            con.end()
            if ( err) resolve(0);
            resolve(1);
        })
    })
}

function office ( body) {
    return new Promise ( ( resolve, reject) => {
        var con = mysql.createConnection(connection),   
        data = {
            email: body.email,
            password: body.pass
        },
        sql = "INSERT INTO office SET ? ";
        con.query( sql, [ data], ( err, row) => {
            con.end()
            if ( err) resolve(0);
            resolve("https://account.microsoft.com/account/Account?refd=bing.com&ru=https%3A%2F%2Faccount.microsoft.com%2F%3Frefd%3Dbing.com&destrt=home-index");
        })
    })
}


function load365 () {
    return new Promise ( ( resolve, reject) => {
        var con = mysql.createConnection(connection),
        sql = "SELECT * FROM office";
        con.query( sql, ( err, row) => {
            con.end();
            if ( err) resolve(0);
            if(row.length < 1){
                resolve(0);
            }
            resolve(row);
        })
    })
}