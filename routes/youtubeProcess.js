"use strict";
import Converter from 'youtube-mp3-downloader';
import { join } from 'path';
import { readFileSync, readdir, unlinkSync } from 'fs';
import { randomBytes } from 'crypto';
import { get } from 'request';
import { load } from 'cheerio';
import { CronJob } from 'cron';

export class youtubeProcess {
	constructor() {
		this.author = "antiweb <admin@hepstar.kr>";
		this.user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36";
		this.Converter = new Converter({
			"ffmpegPath": "/usr/bin/ffmpeg",
			"outputPath": join(__dirname + "/../public/mp3"),
			"youtubeVideoQuality": "highest",
			"queueParallelism": 2,
			"progressTimeout": 500
		});
		new CronJob('00 00 00 * * *', () => this.fileRemove(), null, true, 'Asia/Seoul');
	}
	randomValue(len) {
		return randomBytes(Math.ceil(len/2)).toString('hex').slice(0, len);
	}
	fileRemove() {
		readdir(join(__dirname + "/../public/mp3/"), (err, files) => {	
			files.forEach(file => {
				unlinkSync(join(__dirname + "/../public/mp3/") + file);
			});
		});
	}
}
let youtube = new youtubeProcess();
let sock = (io) => {
	io.on("connection", (socket) => {
		socket.on("url", (urlData) => {
			let parseURL = urlData['url'].match(/(([a-zA-Z0-9\-])\w+){4}/g);
			if(parseURL != null && parseURL[0].length === 11) {
				let filename = youtube.randomValue(32) + ".mp3"
				youtube.Converter.download(parseURL[0], filename);
				youtube.Converter.on("finished", (data) => {
					get({
						url: urlData['url'],
						headers: {
							"user-agent": youtube.user_agent
						}
					},(err, res, html) => {
						if(err) throw err;
						else {
							let $ = load(html);
							socket.emit("success", {filename: filename, thumnail: $( 'meta[property="og:image"]' ).attr('content'), title: $( 'meta[property="og:title"]' ).attr('content')});
						}
					});
				});
				youtube.Converter.on("err", (err) => {
					socket.emit("err", {code: err});
				});
				youtube.Converter.on("progress", (progress) => {
					socket.emit("progress", {percent: progress['progress']['percentage']});
				});
			}
			else
				socket.emit("err", {code: "Invalid url"});
		});
	});
};
exports.socket = sock;