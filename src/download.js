import fs from 'fs';
import request from 'request';
import mongoose from 'mongoose';
import config from './config/config';
import asiaNoCode from './model/asiaNoCode.server.module';

let startNum = 0;

function getDownLoadUrl() {
	return new Promise((resolve, reject) => {
		asiaNoCode.find({}, (err, result) => {
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
			request(result[i].torrent).pipe(fs.createWriteStream(__dirname + '/download/' + result[i].name + '.torrent'));
		}
	})
}