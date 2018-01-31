import request from 'request';
import cheerio from 'cheerio';
import iconv from 'iconv-lite';

export function getHttpReq(url) {
	return new Promise((resolve, reject) => {
		request({
			url: url,
			encoding: null
		}, (error, response, body) => {
			if (!error && response.statusCode == 200) {
				let bodyString = iconv.decode(body, 'gb2312').toString();
				let $ = cheerio.load(bodyString);
				resolve($);
			} else {
				reject(error);
			}
		})
	})
}