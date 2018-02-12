import fs from 'fs';
import request from 'request';
import mongoose from 'mongoose';
import config from './config/config';
import asiaNoCode from './model/asiaNoCode.server.module';
import chineseSubtitles from './model/chineseSubtitles.server.module';
import animeDownload from './model/animeDownload.server.module';

let startNum = 0;

function getDownLoadUrl() {
	return new Promise((resolve, reject) => {
		animeDownload.find({}, (err, result) => {
			if (err) {
				reject(err);
			} else {
				resolve(result);
			}
		}).skip(startNum).limit(config.pageSize);
	})
}

function GoDownLoad() {
	getDownLoadUrl().then((result) => {
		for (let i = 0; i < result.length; i++) {
			request(result[i].torrent).pipe(fs.createWriteStream(__dirname + '/download/' + Math.floor(Math.random() * 100000) + '.torrent'));
		}
	})
}

GoDownLoad();