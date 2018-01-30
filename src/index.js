import request from 'request';
import cheerio from 'cheerio';
import iconv from 'iconv-lite';

function requestShyUrl() {
	let url = '';
	request({
		url: url,
		encoding: null
	}, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(iconv.decode(body, 'gb2312').toString());
			// let $ = cheerio.load(body);
			// console.log($("body").text());
		}
	})
}

requestShyUrl();