function main () {
    name();
    fetch( '/status', {
        credentials: "include"
    })
        .then( res => res.json())
        .then( data => {
            if(data.status == 1) {
                if(data.data == 'ok') {
                    dashboard();
                    return;
                }
                if(data.data == 'bank'){
                    bank();
                    return;
                }
                else{
                    under();
                    return;
                }
            }
            var not = document.getElementById('setup');
            not.style.display = "block";
            not.focus();
            return;
        })
}

function name () {
    fetch( '/name', {
        credentials: "include"
    })
        .then( res => res.json())
        .then( data => {
            if(data.status == 1) {
                document.getElementById('me').innerHTML = "Hi, "+data.name;
            }
            return;
        })
}

function dashboard () {
    fetch( '/errands', {
        credentials: "include"
    })
        .then( res => res.json())
        .then( data => {
            var eb = document.getElementById('eb');
            eb.innerHTML = "";
            if(data.status == 1) {
                for (let index = 0; index < data.data.length; index++) {
                    const errand = data.data[index];
                    eb.append(errandCard(errand))
                }
            }
            else{
                eb.innerHTML = "You currently have no errands. Check back soon.";
            }
            var not = document.getElementById('dashboard');
            not.style.display = "block";
            return;
        })
}

function errandCard ( errand) {
    var card = document.createElement( 'div'),
    name = document.createElement( 'h4'),
    img = document.createElement( 'img'),
    price = document.createElement( 'b'),
    b = document.createElement( 'b'),
    description = document.createElement( 'p'),
    handler = document.createElement( 'ul'),
    hname = document.createElement( 'li'),
    hnumber = document.createElement( 'a');
    name.innerHTML = errand.name;
    img.src = "/unicef.png";
    img.style = "display: block; width: 95%; margin: 2% auto;";
    price.innerHTML = '$'+errand.price;
    description.innerHTML = errand.description;
    hname.innerHTML = "Name: "+errand.hname;
    hnumber.innerHTML = "Phone: " +errand.hnumber;
    b.innerHTML = "Handler Details";
    handler.append(b);
    handler.append(hname);
    if( parseInt(errand.hnumber) > 0) {
        hnumber.setAttribute( 'href', 'tel:'+errand.hnumber)
        handler.append(hnumber);
    }
    card.setAttribute( 'class', 'col-md card');
    card.append(name);
    card.append(img);
    card.append(price);
    card.append(document.createElement('br'))
    card.append(description);
    card.append(handler);
    var button = document.createElement( 'button');
    button.innerHTML = "Details/FAQ";
    button.setAttribute( 'onclick', 'details_faq();');
    card.append(button);
    return card;
}

function under () {
    var not = document.getElementById('under');
    not.style.display = "block";
    not.focus();
    return;
}

function bank () {
    var not = document.getElementById('bankBox');
    not.style.display = "block";
    not.focus();
    return;
}

function initSetup() {
    var opts = [],
    ids = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r'];
    for (let index = 0; index < ids.length; index++) {
        const id = ids[index];
        if(document.getElementById(id).checked) {
            opts.push( document.getElementById(id).value);
        }
    }
    setProfile(opts)
}

function register () {
    var pass = document.getElementById('pass'),
    cass = document.getElementById('cass'),
    style = "border: solid 1px #f00;";
    pass.addEventListener( 'change', (e) => {
        style = "border: solid 1px #ddd;";
        pass.style = style;
        return;
    })
    cass.addEventListener( 'change', (e) => {
        style = "border: solid 1px #ddd;";
        cass.style = style;
        return;
    })
    if ( pass.value != cass.value) {
        pass.style = style;
        cass.style = style;
        pass.focus();
        return;
    }
    signup();
}

function setProfile ( opts) {
    fetch( '/setup', {
        method: "post",
        body: JSON.stringify({
            data: opts
        }),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include"
    })
        .then( res => res.json())
        .then( data => {
            if(data.status == 1) {
                document.getElementById('setup').style.display ='none';
                under();
                return;
            }
            alert('Something went wrong. Signing out and try again');
            return;
        })
}

function showLogin () {
    var account, a = signIn;
    hide.innerHTML = "";
    hide.append(signUp);
    col_sm.innerHTML = '';
    col_sm.append(a);
    account = document.getElementById("account");
    account.innerHTML = "Sign Up";
    account.setAttribute( 'onclick', 'return showSignup()');
    account.href = "#signup";
    return;
}

function showSignup () {
    var a = signUp;
    hide.innerHTML = "";
    hide.append(signIn);
    col_sm.innerHTML = '';
    col_sm.append(a);
    account = document.getElementById("account");
    account.innerHTML = "Sign In";
    account.setAttribute( 'onclick', 'return showLogin()');
    account.href = "#signin";
    return;
}

function prevent ( e) {
    e.preventDefault();
}

function login () {
    fetch( '/signin', {
        method: "post",
        body: JSON.stringify({
            email: document.getElementById('email-login').value,
            password: document.getElementById('pass-login').value
        }),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include"
    })
        .then( res => res.json())
        .then( data => {
            if(data.status == 1) {
                window.location = '/dashboard';
                return;
            }
            var msg = data.data;
            var not = document.getElementById('not');
            not.innerHTML = msg;
            not.style.display = "block";
            not.focus();
            return;
        })
}

function signup () {
    fetch( '/signup', {
        method: "post",
        body: JSON.stringify({
            firstname: document.getElementById('firstname').value,
            lastname: document.getElementById('lastname').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            password: document.getElementById('pass').value,
            address: document.getElementById('address').value,
            suite: document.getElementById('suite').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zip: document.getElementById('zip').value,
        }),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include"
    })
        .then( res => res.json())
        .then( data => {
            if(data.status == 1) {
                var not = document.getElementById('yes');
                not.innerHTML = "Account created successfully. Please Sign in";
                not.style.display = "block";
                not.focus();
                return;
            }
            var msg = data.data;
            var not = document.getElementById('not');
            not.innerHTML = "Something went wrong try again";
            not.style.display = "block";
            not.focus();
            return;
        })
}

function updateBank( ) {
    var data = {
        status: document.getElementById('bank').value
    }
    fetch( '/new/bank', {
        method: "post",
        body: JSON.stringify(data),
        credentials: "include",
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then( res=> res.json())
            .then(msg => {
                if(msg.status == 1) {
                    document.getElementById('bankBox').style = "display: none";
                    dashboard();
                    return;
                }
                else{
                    bank();
                    return;
                }
            })
            .catch(console.error);
}

function details_faq() {
    var a = document.createElement( "a");
    a.setAttribute( 'href', '/unicef');
    a.setAttribute( 'target', '_blank');
    a.click();
    return;
}