const loginService = require('../services/loginService')
const keys = require('../key.auth.json')

let verifyLogin = async (req, res) => {
    let { idToken } = req.body.params
    console.log(idToken)
    let email = await verifyEmail(idToken)
    console.log(email)
    // let email = "ayush.gupta01@quantiphi.com"
    if (email) {
        const response = await loginService.authenticate(email)
        res.send(response)
    } else {
        res.send({
            status: false
        })
    }
}

let verifyCaller = async (req, res, next) => {
    /* console.log('verifed')
    console.log(req.headers.token, req.headers)
    let idToken = req.headers.token
    let email = await verifyEmail(idToken)
    if (email) {
        const response = loginService.authenticate(email)
        if (response.status) {
            next()
        }
        else {
            res.send({
                status: 403,
                message: 'Unauthorized'
            })
        }
    }
    
    res.send({
        status: 403,
        message: 'Unauthorized'
    }) */
    next()
}

let logout = (req, res) => {
    console.log('loggedOut')
    if (req.session) {
        req.session.destroy()
        res.send({
            status: true
        })
        return
    }
    
    res.send({
        status: false
    })

}

let verifyEmail = async (token) => {
    const { OAuth2Client } = require('google-auth-library');
    const client = new OAuth2Client(keys.web.client_id);
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: keys.web.client_id,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        if (payload['email_verified']) {
            return payload['email']
        }
        return false
        // If request specified a G Suite domain:
        //const domain = payload['hd'];
    }
    let email = await verify()
    return email
}

let checkIn = (req, res) => {
    console.log("checkin called")
    res.sendFile('checkin.html', { root: 'public' })
}

let getQrCode = (req, res) => {
    res.sendFile('/getqrcode.html',
        { root: 'public' });
}


module.exports = {
    verifyLogin,
    verifyCaller,
    logout,
    checkIn,
    getQrCode
}