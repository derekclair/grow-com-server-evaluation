/* eslint new-cap: 0 */

import express from 'express';
// import swapi from 'swapi-node'; // NOTE: npm package
import rp from 'request-promise';
import sortBy from 'lodash.sortby';

const app = express();
const router = express.Router();

/* App will run on port 3000 [http://localhost:3000] */
app.listen(3000);


/* Set the view engine to EJS. */
app.set('view engine', 'ejs');


/* Connect the Express router middleware to the app. */
app.use(router);


/*******************************************************************************
	URL: http://localhost:3000/

	Root url declaration, rendering the ~/index.ejs template
*******************************************************************************/
const options = {
	table: null,
	stringify: null,
};

router.route('/').get((req, res) => res.render('index', options));


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
router.route('/characters').get(async ({ query }, res) => {
	let data = [];

	const addToSet = ({ results }) => results.forEach((char) => data.push(char));

	for (let page = 1; data.length < 50; page++) {
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

	res.render('index', { ...options, table: true, data });
});


/*******************************************************************************
	URL: http://localhost:3000/character/:name

	@arg {String} name

	NOTE: must resolve for the following: 'luke'(1), 'han'(14), 'leia'(5), 'rey'(85)
*******************************************************************************/
router.route('/character/:name').get(async ({ params }, res, next) => {
	if (!params || !params.name) { next(); }

	const cheap = {
		luke: 1,
		han: 14,
		leia: 5,
		rey: 85,
	};

	const data = await rp({
		url: `http://swapi.co/api/people/${cheap[params.name]}`,
		json: true,
	});

	// res.render('index', { ...options, stringify: true, data });
	res.render('stringify', { data });

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

	// res.render('index', { ...options, stringify: true, data });
	res.render('stringify', { data });

	next();
});
