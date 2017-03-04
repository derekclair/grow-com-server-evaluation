'use strict';

require('babel-core/register');
require('babel-polyfill');


var express = require('express');
var rp = require('request-promise');
var sortBy = require('lodash.sortby');

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/* eslint new-cap: 0 */

// import table from './views/table.ejs';

var app = express();
var router = express.Router();

/* App will run on port 3000 [http://localhost:3000] */
app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'));

/* Set the view engine to EJS, and their path to the relative directory. */
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

/* Connect the Express router middleware to the app. */
app.use(router);

/* Send the ~/public folder to the client for CSS style link */
app.use(express.static(__dirname + '/public'));

/*******************************************************************************
	URL: http://localhost:3000/

	Root url declaration, rendering the ~/index.ejs template
*******************************************************************************/
router.route('/').get(function (req, res) {
	return res.render('index');
});

/*******************************************************************************
	URL: http://localhost:3000/characters

	@arg {Object} params
		@prop {String} params.query

	@return {Object}
		@prop {Array.Character} data

	@namespace {Character}
		@prop {String} Character.name
		@prop {Number} Character.height
		@prop {Number} Character.mass


	NOTE: must return 50 (any 50) characters.
	NOTE: must resolve query parameter "sort",
				by the following properties: 'name', 'height', 'mass'
*******************************************************************************/
router.route('/characters').get(function () {
	var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(_ref5, res, next) {
		var query = _ref5.query;
		var data, addToSet, page;
		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						data = [];

						addToSet = function addToSet(_ref6) {
							var results = _ref6.results;
							return results.forEach(function (char) {
								return data.push(char);
							});
						};

						// const results = [];

						page = 1;

					case 3:
						if (!(data.length < 50)) {
							_context.next = 9;
							break;
						}

						_context.next = 6;
						return rp({
							url: 'http://swapi.co/api/people/',
							qs: { page: page },
							json: true
						}).then(addToSet);

					case 6:
						page += 1;
						_context.next = 3;
						break;

					case 9:

						if (query && !!query.sort) {
							data = sortBy(data.map(function (_ref2) {
								var height = _ref2.height,
								    mass = _ref2.mass,
								    char = _objectWithoutProperties(_ref2, ['height', 'mass']);

								return _extends({}, char, {
									height: parseInt(height.replace(',', ''), 10),
									mass: parseInt(mass.replace(',', ''), 10)
								});
							}), query.sort);
						}

						// await res.render(Promise.all(data));

						res.render('table', { data: data }); // table of data
						// res.send(data); // raw response

						next();

					case 12:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, undefined);
	}));

	return function (_x, _x2, _x3) {
		return _ref.apply(this, arguments);
	};
}());

/*******************************************************************************
	URL: http://localhost:3000/character/:name

	@arg {String} name

	NOTE: must resolve for the following: 'luke'(1), 'han'(14), 'leia'(5), 'rey'(85)
*******************************************************************************/
router.route('/character/:name').get(function () {
	var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(_ref7, res, next) {
		var params = _ref7.params;
		var name, cheap, data;
		return regeneratorRuntime.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						if (!params || !params.name) {
							next();
						}

						name = params.name;
						cheap = {
							luke: 1,
							han: 14,
							leia: 5,
							rey: 85
						};

						// NOTE: this is a very "cheap" way to accomplish the same as a first name
						// 			 query. It utilizes the 'search' API to essentially return the
						// 			 same response.

						if (!cheap[name]) {
							// Query for the character by their first name, using ' ' as delimiter.
							if (name.includes('')) {
								name = name.slice(0, name.indexOf(' '));
							}

							// This is to resolve the only duplicae first name conflict; between
							// Darth Vader & Darth Maul.
							if (name === 'darth') {
								name = params.name.slice(5);
							}
						}

						_context2.next = 6;
						return rp({
							url: 'http://swapi.co/api/people/' + (cheap[name] || '?search=' + name),
							json: true
						}).then(function (response) {
							return cheap[name] ? response : response.results[0];
						});

					case 6:
						data = _context2.sent;


						res.render('character', _extends({}, data));
						// res.send(data); // raw response

						next();

					case 9:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, undefined);
	}));

	return function (_x4, _x5, _x6) {
		return _ref3.apply(this, arguments);
	};
}());

/*******************************************************************************
	URL: http://localhost:3000/planetresidents

	@return {Object}
		@prop: 'planet name' {Array.String}

	@example { alderan: ["Like Skywalker"] }

	NOTE: returns an Object with "planet name" as properties, with vaules of
				an Array containing that planets residents.
*******************************************************************************/
router.route('/planetresidents').get(function () {
	var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(req, res, next) {
		var data;
		return regeneratorRuntime.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						data = {};
						_context3.next = 3;
						return rp({
							url: 'http://swapi.co/api/planets',
							json: true
						}).then(function (_ref8) {
							var results = _ref8.results;
							return results.forEach(function (_ref9) {
								var name = _ref9.name,
								    residents = _ref9.residents;
								return data[name] = residents;
							});
						});

					case 3:

						res.render('stringify', { data: data });

						next();

					case 5:
					case 'end':
						return _context3.stop();
				}
			}
		}, _callee3, undefined);
	}));

	return function (_x7, _x8, _x9) {
		return _ref4.apply(this, arguments);
	};
}());
