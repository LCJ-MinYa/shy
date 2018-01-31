import mongoose from 'mongoose';
import config from './config';

export default mongoose.connect(config.mongodb)
	.then(() => {
		console.log('——数据库连接成功！——');
	}, (err) => {
		console.log('——数据库连接失败：——' + err);
	});