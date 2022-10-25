const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const userTokenSchema = new Schema({
	mobNumber: {
		type: Number,
		required: true,
	},
	refreshToken: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 10 * 86400, // deletes itself in 30 days
	}
});

const UserToken = mongoose.model("UserToken", userTokenSchema);
module.exports =  UserToken;