let jwt= require('jsonwebtoken');
let config=require('../config');

module.exports = function(req, res, next) {
  let token = req.headers["authorization"];

  if (token) {
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        res.json({
          success: false,
          message: 'Failed to authenticate token'
        });
      } else
      {
        if(decoded.ishospital){
          res.json({
            success: false,
            message: 'Your are not authorized'
          });
        }else{
          req.decoded = decoded;
          next();
        }
      }
    });
  } else {
    res.status(403).json({
      success: false,
      message: 'No token provided'
    });
  }
}