import config from './config/config';
import mongoose from 'mongoose';
import {
	getHttpReq
} from './utils/httpRequest';
import Shy from './model/asiaNoCode.server.module';

async function requestPageNum() {
	for (let i = 1; i <= config.pageNum; i++) {
		await requestPageLine(i);
	}
	mongoose.disconnect();
}

function requestPageLine(pageNum) {
	return new Promise((resolve, reject) => {
		let pathArray = [];
		let url = config.url + config.path;
		if (pageNum !== 1) {
			url += '/p_' + pageNum + '.html';
		}
		getHttpReq(url)
			.then(($) => {
				$('div.list ul li').map((i, el) => {
					let shyUrlDetail = $(el).children('a').attr('href');
					if (shyUrlDetail.indexOf('/xz/31') > -1) {
						pathArray.push($(el).children('a').attr('href'));
					}
				})
				console.log('第' + pageNum + '页目录请求成功');
				requestDetailPage(pathArray, pageNum)
					.then((data) => {
						console.log('第' + pageNum + '页目录和详情保存完成');
						resolve(data);
					})
					.catch((err) => {
						console.log('第' + pageNum + '页目录和详情保存失败');
						reject(err);
					})
			})
			.catch((err) => {
				console.log('请求第' + pageNum + '页目录失败');
				reject(err);
			})
	})
}

async function requestDetailPage(pathArray, pageNum) {
	let lastPromise;
	for (let i = 0; i < pathArray.length; i++) {
		if (i == pathArray.length - 1) {
			lastPromise = await saveShyData(pathArray[i], i, pageNum);
		} else {
			await saveShyData(pathArray[i], i, pageNum);
		}
	}
	return lastPromise;
}

function saveShyData(path, i, pageNum) {
	return new Promise((resolve, reject) => {
		let url = config.url + path;
		getHttpReq(url)
			.then(($) => {
				let imgArray = [];
				$('div.post>ul img').map((i, el) => {
					imgArray.push($(el).attr('src'));
				})
				let content = {
					name: $('div.post p').eq(0).text().replace('【档案名称】：', ''),
					torrent: $('div.post dl.downlink-dl dd ul li a').attr('href'),
					type: $('div.post p').eq(1).children('a').text(),
					place: $('div.post p').eq(2).text().replace('【档案地区】：', ''),
					updateTime: $('div.post p').eq(3).text().replace('【更新时间】：', ''),
					imgArray: imgArray
				}
				shyInsert(content, i, pageNum)
					.then((data) => {
						resolve(data);
					})
					.catch((err) => {
						reject(err);
					})
			})
			.catch((err) => {
				console.log('请求第' + pageNum + '页第' + (i + 1) + '条详情失败');
				reject(err);
			})
	})
}

function shyInsert(content, i, pageNum) {
	return new Promise((resolve, reject) => {
		let shyData = new Shy(content);
		shyData.save((err) => {
			if (err) {
				console.log('存储第' + pageNum + '页第' + (i + 1) + '条数据失败');
				reject(err);
			} else {
				console.log('存储第' + pageNum + '页第' + (i + 1) + '条数据成功');
				resolve(true);
			}
		})
	})
}

requestPageNum();