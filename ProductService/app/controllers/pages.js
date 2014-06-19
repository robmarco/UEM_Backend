var Tshirt 	= require('../models/tshirt');

exports.index = function(req, res) {
    res.render('pages/index', {
        user: req.user
    });            
};

exports.profile = function(req, res) {
	res.render('pages/profile.ejs', {
		user : req.user
	});
};

exports.logout = function(req, res) {
	req.logout();
	res.redirect('/');
};