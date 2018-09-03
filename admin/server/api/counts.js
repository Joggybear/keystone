var async = require('async');

module.exports = function (req, res) {
	var keystone = req.keystone;
	var user = req.user;
	var counts = {};
	async.each(keystone.lists, function (list, next) {
		if (list.key === 'User' && !user.isSuperAdmin) {
			counts[list.key] = 1;
			next();
		} else {
			list.model.count(function (err, count) {
				counts[list.key] = count;
				next(err);
			});
		}
	}, function (err) {
		if (err) return res.apiError('database error', err);
		return res.json({
			counts: counts,
		});
	});
};
