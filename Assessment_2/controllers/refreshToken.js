const UserToken = require('../models/Token');
const jwt = require('jsonwebtoken');
const verifyRefreshToken = require('../utils/verifyRefreshToken');

// get new access token
async function GetNewAccessToken(req, res) {
	try{
		const response = await verifyRefreshToken(req.body.refreshToken).catch((err)=>res.send(err)) // if verification fails the return error response

		const accessToken = jwt.sign(
			{mobNumber: response.tokenDetails.mobNumber },
        
			process.env.JWT_SECRET_KEY,
			{ expiresIn: "20m" }
		); 
		res.status(200).json({
			error: false,
			accessToken,
			message: "Access token created successfully",
		});
	}
	catch{
		((err) => res.status(400).json(err));
	}
};

// logout

async function logout(req, res) {
	try {

		const userToken = await UserToken.findOne({ refreshToken: req.body.refreshToken }); // finding document with the matched refresh token  
		if (!userToken)
			return res
				.status(200)
				.json({ error: false, message: "Already logged out" }); // if no user exists, by default return logged out

		await userToken.remove(); // if document exists the delete it, so that no more access token can be generated using it (refresh token verification fails)
		res.status(200).json({ error: false, message: "Logged Out Successfully" });
	} catch (err) {
		res.status(500).json({ error: true, message: "Internal Server Error" });
	}
};

module.exports={GetNewAccessToken,logout}