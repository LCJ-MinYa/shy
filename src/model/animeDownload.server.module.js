import mongoose from 'mongoose';
//引入只是为了执行链接数据库
import db from '../config/mongoose';

let ShySchema = new mongoose.Schema({
	name: String,
	torrent: String,
	type: String,
	place: String,
	updateTime: String,
	imgArray: Array,
	time: {
		type: Date,
		default: new Date()
	}
})

export default mongoose.model('AnimeDownload', ShySchema, 'AnimeDownload');