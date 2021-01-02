const router = require('express').Router();
const jwt = require('jsonwebtoken');

const Hospital = require('../models/hospital');
const Blood = require('../models/blood');
const config = require('../config');
const checkJWT = require('../middlewares/check-jwthospital');
const mongoose=require('mongoose')

router.post('/signup', (req, res, next) => {
 let hospital = new Hospital();
 console.log(req.body)
 hospital.name = req.body.name;
 hospital.email = req.body.email;
 hospital.password = req.body.password;
 hospital.mobile = req.body.mobile;
 hospital.picture = hospital.gravatar();

 Hospital.findOne({ email: req.body.email }, (err, existingUser) => {
  if (existingUser) {
    res.json({
      success: false,
      message: 'Account with that email is already exist'
    });

  } else {
    hospital.save();

    var token = jwt.sign({
        hospital: hospital,
        ishospital:true
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

    Hospital.findOne({ email: req.body.email }, (err, hospital) => {
    if (err) throw err;

    if (!hospital) {
      res.json({
        success: false,
        message: 'Authenticated failed, User not found'
      });
    } else if (hospital) {

      var validPassword = hospital.comparePassword(req.body.password);
      if (!validPassword) {
        res.json({
          success: false,
          message: 'Authentication failed. Wrong password'
        });
      } else {
        var token = jwt.sign({
            hospital: hospital,
            ishospital:true
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
    Hospital.findOne({ _id: req.decoded.hospital._id }, (err, hospital) => {
      res.json({
        success: true,
        hospital: hospital,
        message: "Successful"
      });
    });
  })
  .post(checkJWT, (req, res, next) => {
    Hospital.findOne({ _id: req.decoded.hospital._id }, (err, hospital) => {
      if (err) return next(err);
      console.log(req.body)
      if (req.body.name) hospital.name = req.body.name;
      if (req.body.email) hospital.email = req.body.email;
      if (req.body.password) hospital.password = req.body.password;
      if (req.body.mobile) hospital.mobile = req.body.mobile;
      try{
        hospital.save();
      console.log(hospital)
      }
      catch(e){
        console.log(e)
      }
      res.json({
        success: true,
        message: 'Successfully edited your profile'
      });
    });
  });

  // router.route('/address')
  // .get(checkJWT, (req, res, next) => {
  //   Hospital.findOne({ _id: req.decoded.hospital._id }, (err, hospital) => {
  //    res.json({
  //       success: true,
  //       address: hospital.address,
  //       message: "Successful"
  //     });
  //   });
  // })
  // .post(checkJWT, (req, res, next) => {
  //   Hospital.findOne({ _id: req.decoded.hospital._id }, (err, hospital) => {
  //     if (err) return next(err);

  //     if (req.body.addr1) hospital.address.addr1 = req.body.addr1;
  //     if (req.body.addr2) hospital.address.addr2 = req.body.addr2;
  //     if (req.body.city) hospital.address.city = req.body.city;
  //     if (req.body.state) hospital.address.state = req.body.state;
  //     if (req.body.country) hospital.address.country = req.body.country;
  //     if (req.body.postalCode) hospital.address.postalCode = req.body.postalCode;
  //    try{
  //     Hospital.save();
  //    }
  //    catch(e){
  //      console.log(e)
  //    }
  //     res.json({
  //       success: true,
  //       message: 'Successfully edited your address'
  //     });
  //   });
  // });


router.get('/bloods', checkJWT, (req, res, next) => {
    Blood.find({ Hospital: req.decoded.hospital._id })
      // .populate('User')
      .exec((err, blood) => {
        if (err) {
          res.json({
            success: false,
            message: "Couldn't find your blood"
          });
        } else {
          res.json({
            success: true,
            message: 'Found your blood',
            blood: blood
          });
        }
      });
  });

  
router.post('/bloods', checkJWT, (req, res, next) => {
    let newblood= new Blood();
    newblood.Hospital=req.decoded.hospital._id;
    newblood.bloodgroup = req.body.bloodgroup;
    newblood.noofsamples = req.body.noofsamples;

    try{
      newblood.save()
      res.json({
        success: true,
        message: 'Added succesfully',
      });
    }catch(e){
      console.log(e)
      res.json({
        success: false,
        message: e.message,
      });      
    }
  });

  router.get('/pendingRequest', checkJWT, (req, res, next) => {
    try{
     Blood.find({ Requests: { $exists: true, $not: {$size: 0} },locked:false })
      .populate('Requests','name email mobile')
      .exec((err, bloods) => {
        if (err) {
          res.json({
            success: false,
            message: "Couldn't find your blood"
          });
        } else {
          res.json({
            success: true,
            message: 'Found your blood',
            bloods
          });
        }
      });
    }catch(e){
      console.log("error",e)
    }

  });
// collection.find({ arrayElementName: { $exists: true, $not: {$size: 0} } })


router.post('/accept/:id/:userid',checkJWT, (req, res, next) => {
  Blood.updateOne(
    { _id: req.params.id , Hospital:req.decoded.hospital._id},
    { lockedUser: req.params.userid,locked:true },
    function(err, result) {
      if (err) {
        res.json({
          success:false,
          message:'some Error Ocurred ! Retry Later'
        })
      } else {
        if(result['nModified']==0){
          res.json({
            success:false,
            message:'Your are not Authenticated to accept'
          })          
        }else{
          res.json({
            success:true,
            message:'Blood Sample request is accepted'
          })
        }
      }
    }
  );
})

router.get('/acceptedbloods', checkJWT, (req, res, next) => {
    Blood.find({ Hospital: req.decoded.hospital._id ,locked:true})
      .populate('lockedUser','name email')
      .exec((err, blood) => {
        if (err) {
          res.json({
            success: false,
            message: "Couldn't find your blood"
          });
        } else {
          res.json({
            success: true,
            message: 'Found your blood',
            blood: blood
          });
        }
      });
});

router.post('/blood/inc/:id', checkJWT, (req, res, next) => {
  Blood.updateOne(
    { _id: req.params.id , Hospital:req.decoded.hospital._id},
    { $inc: { noofsamples: 1 }},
    function(err, result) {
      if (err) {
        res.json({
          success:false,
          message:'some Error Ocurred ! Retry Later'
        })
      } else {
        if(result['nModified']==0){
          res.json({
            success:false,
            message:'Your are not Authenticated to Update'
          })          
        }else{
          res.json({
            success:true,
            message:'Blood Sample Updated'
          })
        }
      }
    }
  );
});

router.post('/blood/dec/:id', checkJWT, (req, res, next) => {
  Blood.updateOne(
    { _id: req.params.id , Hospital:req.decoded.hospital._id},
    { $inc: { noofsamples: -1 }},
    function(err, result) {
      if (err) {
        res.json({
          success:false,
          message:'some Error Ocurred ! Retry Later'
        })
      } else {
        if(result['nModified']==0){
          res.json({
            success:false,
            message:'Your are not Authenticated to Update'
          })          
        }else{
          res.json({
            success:true,
            message:'Blood Sample Updated'
          })
        }
      }
    }
  );
});
  
  // router.get('/cases/:id', checkJWT, (req, res, next) => {
  //   Case.findOne({ _id: req.params.id })
  //     .populate('User')
  //     .exec((err, cases) => {
  //       if (err) {
  //         res.json({
  //           success: false,
  //           message: "Couldn't find your case"
  //         });
  //       } else {
  //         res.json({
  //           success: true,
  //           message: 'Found your case',
  //           cases: cases
  //         });
  //       }
  //     });
  // });


module.exports = router;
