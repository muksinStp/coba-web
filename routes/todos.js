var express = require('express');
var router = express.Router();
const {isLoggedIn} = require('../helpers/util')

/* GET users listing. */
module.exports = (db) => {
router.get('/', isLoggedIn, async function(req, res, next) {
    const{rows: todos} = await db.query('SELECT* FROM todos WHERE userid = $1', [req.session.user.id])
      res.render('todos/list', {todos});
    });
    router.post('/add', isLoggedIn, async function(req, res, next) {
      const {title} = req.body
      await db.query('INSERT INTO todos (title, userid) VALUES ($1, $2)', [title, req.session.user.id])
      res.redirect('/todos')
    });

return router;
}

