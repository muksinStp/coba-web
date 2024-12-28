var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = (db) => {
  router.get('/', function (req, res, next) {
    res.render('login', { 
      title: 'Login',
      errorMessage: req.flash('errorMessage'),
      successMessage: req.flash('successMessage')
    });
  });
  router.post('/login', async function (req, res, next) {
    const { email, password, } = req.body
    try {
      const { rows } = await db.query('SELECT* FROM users WHERE email = $1 LIMIT 1', [email])
      if (rows.length == 0) throw new Error('user doesn\'t exist')
        if(!bcrypt.compareSync(password, rows[0].password))throw new Error('password is Wrong')
          req.session.user = { id: rows[0].id, email: rows[0].email}
        res.redirect('/todos')
    } catch (e) {
      req.flash('errorMessage', e.message)
      res.redirect('/')
    }
  });

  router.get('/register', function (req, res, next) {
    res.render('register', { title: 'Register' });
  });
  router.post('/register', async function (req, res, next) {
    const { email, password, repassword } = req.body
    try {
      if (password !== repassword) throw new Error('password doesn\'t match')
      const { rows } = await db.query('SELECT* FROM users WHERE email = $1 LIMIT 1', [email])
      if (rows.length > 0) throw new Error('user is already registered')
      const hashPassword = bcrypt.hashSync(password, saltRounds);

      const { rows: user } = await db.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *', [email, hashPassword])
      console.log(user[0])
      res.redirect('/')
    } catch (e) {
      req.flash('errorMessage', e.message)
      res.redirect('/register')
    }
  });

  router.get('/logout', function (req, res, next) {
    req.session.destroy(function(err) {
    res.redirect('/')
    })
    
  });

  return router;
}
