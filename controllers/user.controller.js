const User = require("../models/user.model");
const config = require("config");

exports.register = function (req, res) {
  User.findOne({
    email: req.body.email,
  })
    .then((user) => {
      if (user) {
        return res.status(500).json({
          success: false,
          message: "User already exists.",
        });
      } else {
        const user = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          phoneNumber: req.body.phoneNumber,
        });

        user
          .save()
          .then((result) => {
            return res.status(200).json({
              success: true,
              message: "Registration successful",
            });
          })
          .catch((error) => {
            return res.status(500).json({
              success: false,
              message: error.message,
            });
          });
      }
    })
    .catch((error) => {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    });
};

exports.login = function(req, res) {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({
            success: false,
            message:
              "The email address " +
              req.body.email +
              " is not associated with any account. Double-check your email address and try again."
          });
        }
  
        user.comparePassword(req.body.password, function(error, isMatch) {
          if (error) {
            return res
              .status(500)
              .json({ success: false, message: error.message });
          }
  
          if (!isMatch) {
            return res
              .status(401)
              .json({ success: false, message: "Invalid email or password" });
          }
  
          if (!user.isVerified) {
            return res.status(401).json({
              success: false,
              message: "Your account has not been verified."
            });
          }
  
          const payload = {
            userId: user._id
          };
  
          var token = jwt.sign(payload, config.get("secret"));
  
          res.json({
            success: true,
            message: "Access token generation successfull.",
            data: token
          });
        });
      })
      .catch(error => {
        return res.status(500).json({ success: false, message: error.message });
      });
  };