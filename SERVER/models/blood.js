const mongoose = require('mongoose');
// const deepPopulate = require('mongoose-deep-populate')(mongoose);
const Schema = mongoose.Schema;

const BloodSchema = new Schema({
  Hospital: { type: Schema.Types.ObjectId, ref: 'Hospital'},
  bloodgroup:String,
  noofsamples:Number,
  Requests:[{type:Schema.Types.ObjectId,ref:'User'}],
  created: { type: Date, default: Date.now },
  lockedUser:{type:Schema.Types.ObjectId,ref:'User'},
  locked:{type:Schema.Types.Boolean,default:false}
});

// BloodSchema.plugin(deepPopulate);

module.exports = mongoose.model('Blood', BloodSchema);
