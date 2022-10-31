const jwt = require('jsonwebtoken');
const UserToken =require('../models/Token');

const generateTokens = async (user) => {
	try {
		const accessToken = jwt.sign(
			{mobNumber: user.mobNumber },
			process.env.JWT_SECRET_KEY,
			{ expiresIn: "10m" }
		);
		const refreshToken = jwt.sign(
			{mobNumber: user.mobNumber },
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: "10d" }
		);

		const userToken = await UserToken.findOne({ mobNumber: user.mobNumber  });
		if (userToken) await userToken.remove(); // remove matched document with old refresh token
		await new UserToken({ mobNumber: user.mobNumber, refreshToken: refreshToken }).save(); // create new document with new refresh token
		return Promise.resolve({ refreshToken });
	} catch (err) {
		return Promise.reject(err);
	}
};

module.exports = generateTokens;