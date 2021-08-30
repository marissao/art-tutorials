exports.home = (req, res) => res.render('guest-home');

exports.notFound = (req, res) => res.render('404');

exports.serverError = (err, req, res, next) => res.render('500');