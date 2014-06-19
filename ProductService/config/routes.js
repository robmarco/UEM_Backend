module.exports = function(app, passport) {
	
	// =====================================
	// WEBACCESS  	 =======================
	// =====================================
	var homeCtrl = require('../app/controllers/pages');	
	app.get('/', homeCtrl.index);
	app.get('/profile', isLoggedIn, homeCtrl.profile);
	app.get('/logout', homeCtrl.logout);

	var productsCtrl = require('../app/controllers/products');
	app.get('/products', isLoggedIn, productsCtrl.index);
	app.get('/products/:id', isLoggedIn, productsCtrl.show);
	app.get('/product/new', isLoggedIn, productsCtrl.add);

	app.get('/404', function(req,res){
		res.render('404');
	});

	var kartCtrl = require('../app/controllers/kart');
	app.get('/shopcart', isLoggedIn, kartCtrl.show);

	// =====================================
	// API PRODUCTS 	 ===================
	// =====================================
	app.get('/api/products', productsCtrl.getAllProducts);
	app.get('/api/products/:id', productsCtrl.getProductById);
    app.post('/api/products', productsCtrl.addProduct);
    app.put('/api/products/:id', productsCtrl.updateProduct);
    app.delete('/api/products/:id', productsCtrl.deleteProduct);
    app.get('/api/hot', productsCtrl.hotProduct);

    // =====================================
	// API KART 	 	====================
	// =====================================
	var kartCtrl = require('../app/controllers/kart');
    app.get('/api/kart/:user_id', kartCtrl.showKart);
	app.post('/api/kart', kartCtrl.addProductToKart);
    app.delete('/api/kart/:user_id/:id', kartCtrl.deleteProductToKart);
    //app.post('/api/closekart/:user_id', kartCtrl.closeKart);
    //app.get('/api/')
    //

	// =====================================
	// GOOGLE ROUTES =======================
	// =====================================
	app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
	app.get('/auth/google/callback',
            passport.authenticate('google', {
                    successRedirect : '/',
                    failureRedirect : '/'
            }));

	// route middleware to make sure a user is logged in
	function isLoggedIn(req, res, next) {

		// if user is authenticated in the session, carry on
		if (req.isAuthenticated())
			return next();

		// if they aren't redirect them to the home page
		res.redirect('/auth/google');
	};

};


