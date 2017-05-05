'use strict';
import { Router } from 'express';
import { readFileSync, readdir, createReadStream, unlinkSync } from 'fs';
import { join, basename } from 'path';
import { youtubeProcess } from './youtubeProcess';

let router = Router();

router.get("/", (req, res) => {
	let logoSVG = readFileSync(join(__dirname + "/../public/images/logo.svg"), "utf8");
	res.render("index", {logo: logoSVG});
});

router.get("/Download", (req, res) => {
	readdir(join(__dirname + "/../public/mp3/"), (err, files) => {
		let count = 0;
		files.forEach(file => {
			if(file === req.query['down'])
				count += 1;
		});
		if(count === 1) {
			let file = join(__dirname + "/../public/mp3/") + req.query['down'];

			res.setHeader('Content-disposition', 'attachment; filename=' +  basename(file));
			createReadStream(file).pipe(res);
		}
		else
			res.redirect("/");
	});
});

module.exports = router;