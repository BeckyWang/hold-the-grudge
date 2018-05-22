const PORT = 8088;

const http = require('http'),
	fs = require('fs'),
	path = require('path'),
	url = require('url'),
	mine = require('./mine').types;

const server = http.createServer((request, response) => {
	const pathname = url.parse(request.url).pathname;
	const realPath = path.join('./', pathname);
	const ext = path.extname(realPath) ? path.extname(realPath).slice(1) : 'unknown';

	fs.exists(realPath, exists => {
		if (!exists) {
			response.writeHead(404, {
				'Content-Type': 'text-plain'
			});
			response.write(`This request URL ${realPath} was not found on this server.`);
			response.end();
		} else {
			fs.readFile(realPath, 'binary', (err, file) => {
				if (err) {
					response.writeHead(500, {
						'Content-Type': 'text-plain'
					});
					response.end(err);
				} else {
					response.writeHead(200, {
						'Content-Type': mine[ext] || 'text-plain'
					});
					response.write(file, 'binary');
					response.end();
				}
			});
		}
	});
});

server.listen(PORT);
console.log("Server running at port: " + PORT + ".");