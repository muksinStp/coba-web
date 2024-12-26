var express = require('express');
var router = express.Router();
const {isLoggedIn} = require('../helpers/util')

/* GET users listing. */
module.exports = (db) => {
router.get('/', isLoggedIn, function(req, res, next) {
  res.render('todos/list');
});
return router;
}

