# Youtube MP3 Downloader
Youtube MP3 Convert & Downloader

## Installation
```sh
$ sudo npm install -g
```

## Excute
```sh
$ sudo babel-node server.js
```

## File Detail
| Filename | Description |
| ------ | ------ |
| package.json | Repository Detail |
| server.js | Facebook Account Setting File |
| routes/ | routing & server configuration file |
| public/ | js, css, resource file and directory |
| public/mp3 | mp3 upload directory |
| views/ | jade file directory |

### Setup

`server.js` server port settings

```sh
let app = express();

let http = createServer(app).listen("serverPORT"); // ex) 80
let io = socketio(http);
```

`routes/youtubeProcess.js` Cron Setting

```sh
this.Converter = new Converter({
	"ffmpegPath": "/usr/bin/ffmpeg", // your ffmpeg path
	"outputPath": join(__dirname + "/../public/mp3"), /// upload path
	"youtubeVideoQuality": "highest",
	"queueParallelism": 2,
	"progressTimeout": 500 // progress timeout setting
});
new CronJob('00 00 00 * * *', () => this.fileRemove(), null, true, 'Asia/Seoul'); // remove directory
```

### License
MIT
