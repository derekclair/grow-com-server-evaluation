/* eslint new-cap: 0 */

import express from 'express';
// import swapi from 'swapi-node'; // NOTE: npm package
import rp from 'request-promise';
import sortBy from 'lodash.sortby';

// import table from './views/table.ejs';

const app = express();
const router = express.Router();

/* App will run on port 3000 [http://localhost:3000] */
app.listen(3000);


/* Set the view engine to EJS, and their path to the relative directory. */
app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);


/* Connect the Express router middleware to the app. */
app.use(router);


/* Send the ~/public folder to the client for CSS style link */
app.use(express.static('public'));


/*******************************************************************************
	URL: http://localhost:3000/

	Root url declaration, rendering the ~/index.ejs template
*******************************************************************************/
router.route('/').get((req, res) => res.render('index'));


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
router.route('/characters').get(async ({ query }, res, next) => {
	let data = [];

	const addToSet = ({ results }) => results.forEach((char) => data.push(char));

	for (let page = 1; data.length < 50; page += 1) {
		await rp({
			url: 'http://swapi.co/api/people/',
			qs: { page },
			json: true,
		}).then(addToSet);
	}

	if (query && !!query.sort) {
		data = sortBy(data.map(({ height, mass, ...char }) => ({
			...char,
			height: parseInt(height.replace(',', ''), 10),
			mass: parseInt(mass.replace(',', ''), 10),
		})), query.sort);
	}

	res.render('table', { data }); // table of data
	// res.send(data); // raw response

	// next();
});


/*******************************************************************************
	URL: http://localhost:3000/character/:name

	@arg {String} name

	NOTE: must resolve for the following: 'luke'(1), 'han'(14), 'leia'(5), 'rey'(85)
*******************************************************************************/
router.route('/character/:name').get(async ({ params }, res, next) => {
	if (!params || !params.name) { next(); }

	let { name } = params;
	const cheap = {
		luke: 1,
		han: 14,
		leia: 5,
		rey: 85,
	};

	// NOTE: this is a very "cheap" way to accomplish the same as a first name
	// 			 query. It utilizes the 'search' API to essentially return the
	// 			 same response.
	if (!cheap[name]) {
		// Query for the character by their first name, using ' ' as delimiter.
		if (name.includes('')) { name = name.slice(0, name.indexOf(' ')); }

		// This is to resolve the only duplicae first name conflict; between
		// Darth Vader & Darth Maul.
		if (name === 'darth') { name = params.name.slice(5); }
	}

	const data = await rp({
		url: `http://swapi.co/api/people/${cheap[name] || `?search=${name}`}`,
		json: true,
	}).then((response) => (cheap[name] ? response : response.results[0]));

	res.render('character', { ...data });
	// res.send(data); // raw response

	next();
});


/*******************************************************************************
	URL: http://localhost:3000/planetresidents

	@return {Object}
		@prop: 'planet name' {Array.String}

	@example { alderan: ["Like Skywalker"] }

	NOTE: returns an Object with "planet name" as properties, with vaules of
				an Array containing that planets residents.
*******************************************************************************/
router.route('/planetresidents').get(async (req, res, next) => {
	const data = {};

	await rp({
		url: 'http://swapi.co/api/planets',
		json: true,
	}).then(({ results }) => results.forEach(({ name, residents }) => (
		data[name] = residents
	)));

	res.render('stringify', { data });

	next();
});
