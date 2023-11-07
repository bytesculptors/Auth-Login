const mysql = require('mysql')
const bycrypt = require('bcryptjs')

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABSE
})

exports.register = (req, res) => {
    console.log(req.body);
    const {name, email, password, passwordConfirm} = req.body

    db.query('SELECT email FROM user WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.log(error); 
        } 
        if (results.length > 0) {
            return res.render('register', {
                message: 'That email is already taken'
            })
        } else if (password !== passwordConfirm) {
            return res.render('register', {
                message: 'Password does not match'
            })
        }
        let hashedPassword = await bycrypt.hash(password, 8)
        console.log(hashedPassword);
        db.query('INSERT INTO user SET ?', {name: name, email: email, password: hashedPassword}, (error, results) => {
            if (error) {
                console.log(error);
            } else {
                console.log(results);
                return res.render('register', {
                    message: "Register successfully!!!"
                })
            }
        })
    })
}