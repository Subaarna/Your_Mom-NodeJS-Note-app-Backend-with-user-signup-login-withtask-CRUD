const jwt = require("jsonwebtoken");

const accessTokenDuration = 24 * 60 * 60; // Access token duration in seconds (24 hours)
const refreshTokenDuration = 7 * 24 * 60 * 60; // Refresh token duration in seconds (7 days)
const secretKey = "secret-key"; // Secret key used for signing tokens

// function HashPassword(password) {
//   const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
//   return hash;
// }

// function VerifyPassword(userPassword, providedPassword) {
//   return bcrypt.compareSync(providedPassword, userPassword);
// }
function GenerateAccessToken(userID) {
  try {
    const expirationTime = Math.floor(Date.now() / 1000) + accessTokenDuration;
    const claims = {
      sub: userID,
      role: "user", // Add role claim here
      exp: expirationTime,
    };
    const token = jwt.sign(claims, secretKey, { algorithm: "HS256" });
    return token;
  } catch (error) {
    console.error("Error generating access token:", error);
    throw error;
  }
}
function GenerateRefreshToken(userID) {
  try {
    const expirationTime = Math.floor(Date.now() / 1000) + refreshTokenDuration;
    const claims = {
      sub: userID,
      exp: expirationTime,
    };
    const token = jwt.sign(claims, secretKey, { algorithm: "HS256" });
    return token;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
}

function RefreshTokens(refreshToken) {
  try {
    // Parse the refresh token
    const token = jwt.verify(refreshToken, secretKey);

    // Verify that the token is valid and not expired
    if (!token) {
      throw new Error("Invalid token");
    }

    // Get the user ID from the refresh token
    const userID = token.sub;

    // Generate new access and refresh tokens
    const newAccessToken = GenerateAccessToken(userID);
    const newRefreshToken = GenerateRefreshToken(userID);

    return { newAccessToken, newRefreshToken };
  } catch (error) {
    console.error("Error refreshing tokens:", error);
    throw error;
  }
}

function IsAuthenticated(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const tokenString = authHeader.split("Bearer")[1];
    const token = jwt.verify(tokenString, secretKey);

    if (!token) {
      return res.status(401).json({ message: "Invalid token" });
    }
    next();
  } catch (error) {
    console.error("Error authenticating:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
function GetIdFromAccessToken(req) {
  try {
    const authHeader = req.headers.authorization;

    // Check if auth header is empty
    if (!authHeader) {
      throw new Error("Auth Header is empty.");
    }
    console.log("Auth Header:", authHeader);
    const tokenString = authHeader.split("Bearer ")[1];
    console.log("Token String:", tokenString); // Add this line for debugging
    const decodedToken = jwt.verify(tokenString, secretKey);
    const tokenclaims = decodedToken;
    if (!tokenclaims) {
      throw new Error("Token claims not found.");
    }
    return tokenclaims.sub;
  } catch (error) {
    console.error("Error getting access token:", error);
    throw new Error("Cannot get access token.");
  }
}



const testToken = "Bearer (yourtoken)";
const mockReq = { headers: { authorization: testToken } };

// try {
//   const userId = GetIdFromAccessToken(mockReq);
//   console.log("User ID from token:", userId);
// } catch (error) {
//   console.error("Error:", error);
// }
module.exports = {
  //   HashPassword,
  //   VerifyPassword,
  GenerateRefreshToken,
  GenerateAccessToken,
  RefreshTokens,
  IsAuthenticated,
  GetIdFromAccessToken,
};
