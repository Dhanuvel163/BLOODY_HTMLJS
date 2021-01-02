const router = require('express').Router();
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Blood = require('../models/blood');
const config = require('../config');
const checkJWT = require('../middlewares/check-jwtuser');


router.post('/signup', (req, res, next) => {
 let user = new User();
 user.name = req.body.name;
 user.email = req.body.email;
 user.password = req.body.password;
 user.mobile = req.body.mobile;
 user.picture = user.gravatar();

 User.findOne({ email: req.body.email }, (err, existingUser) => {
  if (existingUser) {
    res.json({
      success: false,
      message: 'Account with that email is already exist'
    });

  } else {
    user.save();

    var token = jwt.sign({
      user: user,
      ishospital:false
    }, config.secret, {
      expiresIn: '7d'
    });

    res.json({
      success: true,
      message: 'Enjoy your token',
      token: token
    });
  }

 });
});

router.post('/login', (req, res, next) => {

  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) throw err;

    if (!user) {
      res.json({
        success: false,
        message: 'Authenticated failed, User not found'
      });
    } else if (user) {

      var validPassword = user.comparePassword(req.body.password);
      if (!validPassword) {
        res.json({
          success: false,
          message: 'Authentication failed. Wrong password'
        });
      } else {
        var token = jwt.sign({
          user: user,
          ishospital:false
        }, config.secret, {
          expiresIn: '7d'
        });

        res.json({
          success: true,
          mesage: "Enjoy your token",
          token: token
        });
      }
    }

  });
});

router.route('/profile')
  .get(checkJWT, (req, res, next) => {
    User.findOne({ _id: req.decoded.user._id }, (err, user) => {
      res.json({
        success: true,
        user: user,
        message: "Successful"
      });
    });
  })
  .post(checkJWT, (req, res, next) => {
    User.findOne({ _id: req.decoded.user._id }, (err, user) => {
      if (err) return next(err);

      if (req.body.name) user.name = req.body.name;
      if (req.body.email) user.email = req.body.email;
      if (req.body.password) user.password = req.body.password;
      if (req.body.mobile) user.mobile = req.body.mobile;

      user.save();
      res.json({
        success: true,
        message: 'Successfully edited your profile'
      });
    });
  });

  // router.route('/address')
  // .get(checkJWT, (req, res, next) => {
  //   User.findOne({ _id: req.decoded.user._id }, (err, user) => {
  //     res.json({
  //       success: true,
  //       address: user.address,
  //       message: "Successful"
  //     });
  //   });
  // })
  // .post(checkJWT, (req, res, next) => {
  //   User.findOne({ _id: req.decoded.user._id }, (err, user) => {
  //     if (err) return next(err);

  //     if (req.body.addr1) user.address.addr1 = req.body.addr1;
  //     if (req.body.addr2) user.address.addr2 = req.body.addr2;
  //     if (req.body.city) user.address.city = req.body.city;
  //     if (req.body.state) user.address.state = req.body.state;
  //     if (req.body.country) user.address.country = req.body.country;
  //     if (req.body.postalCode) user.address.postalCode = req.body.postalCode;
     
  //     user.save();
  //     res.json({
  //       success: true,
  //       message: 'Successfully edited your address'
  //     });
  //   });
  // });

router.get('/bloods', (req, res, next) => {
    Blood.find({locked:false})
      .populate('Hospital','name email')
      .exec((err, bloods) => {
        if (err) {
          res.json({
            success: false,
            message: "Couldn't find blood samples"
          });
        } else {
          res.json({
            success: true,
            message: 'Found blood samples',
            bloods: bloods
          });
        }
      });
});

router.get('/requests',checkJWT, (req, res, next) => {
    Blood.find({Requests:req.decoded.user._id,locked:false})
      // .populate('Hospital')
      .exec((err, bloods) => {
        if (err) {
          res.json({
            success: false,
            message: "Couldn't find blood samples"
          });
        } else {
          res.json({
            success: true,
            message: 'Found blood samples',
            bloods: bloods
          });
        }
      });
});

router.get('/acceptedrequests',checkJWT, (req, res, next) => {
    Blood.find({lockedUser:req.decoded.user._id})
      // .populate('Hospital')
      .exec((err, bloods) => {
        if (err) {
          res.json({
            success: false,
            message: "Couldn't find blood samples"
          });
        } else {
          res.json({
            success: true,
            message: 'Found blood samples',
            bloods: bloods
          });
        }
      });
});

router.get('/rejectedrequests',checkJWT, (req, res, next) => {
    Blood.find({locked:true})
      // .populate('Hospital')
      .exec((err, bloods) => {
        if (err) {
          res.json({
            success: false,
            message: "Couldn't find blood samples"
          });
        } else {
          bloods=bloods.filter((b)=>b.lockedUser!=req.decoded.user._id)
          res.json({
            success: true,
            message: 'Found blood samples',
            bloods: bloods
          });
        }
      });
});

router.post('/request/:id',checkJWT, async(req, res, next) => {
  const bloodid=req.params.id
  let requested=false;
  await Blood.findOne({ _id: bloodid },(err,result)=>{
    if(err){
      res.json({
          success:false,
          message:'some Error Ocurred ! Retry Later'
      })
    }else{
      if(result.Requests.includes(req.decoded.user._id)){
        requested=true;
      }
    }
  })
  if(requested){
      res.json({
          success:false,
          message:'You have already requested'
      })
      return
  }
  Blood.updateOne(
    { _id: bloodid },
    { $addToSet: { Requests: [req.decoded.user._id] } },
    function(err, result) {
      if (err) {
        res.json({
          success:false,
          message:'some Error Ocurred ! Retry Later'
        })
      } else {
        res.json({
          success:true,
          message:'Your request has been sent'
        })
      }
    }
  );
});


module.exports = router;