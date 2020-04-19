const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10;
const bcrypt = require("bcryptjs");

let UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
      expires: 86400000,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", function (next) {
  var user = this;
  if (!user.isModified("password")) return next();

  try {
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } catch (error) {
    throw error;
  }
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

UserSchema.methods.updateResetPassword = function (
  resetPasswordToken,
  resetPasswordExpires
) {
  this.resetPasswordToken = resetPasswordToken;
  this.resetPasswordExpires = resetPasswordExpires;
  return this.save();
};

UserSchema.methods.changePassword = async function (password) {
  this.password = password;
  this.resetPasswordToken = undefined;
  this.resetPasswordExpires = undefined;
  return this.save();
};

module.exports = mongoose.model("user", UserSchema, "users");
