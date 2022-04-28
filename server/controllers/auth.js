const bcrypt = require("bcrypt");
const signUpValidator = require("../validators/signUpValidator");
const User = require("../models/User");
const logInValidator = require("../validators/logInValidator");
const tokenGenerator = require("../validators/tokenGenerator");

const signup = async (userObject) => {
  const { error } = signUpValidator(userObject);
  if (error) return { error: "invalidObjectFormat" };
  try {
    const userAlreadyExists = await User.findOne({
      userName: userObject.userName,
    });
    if (userAlreadyExists) return { error: "userNameAlreadyExists" };
    let hashedPass = await bcrypt.hash(userObject.password, 10);
    userObject.password = hashedPass;
    const user = new User(userObject);
    const newUser = await user.save();
    console.log(newUser);
    return { error: null };
  } catch (error) {
    return { error };
  }
};

const login = async (userObject) => {
  const { error } = logInValidator(userObject);
  if (error) return { error: "invalidObjectFormat" };
  try {
    const userExists = await User.findOne(
      {
        userName: userObject.userName,
      },
      {
        personalChats: 0,
        groupChats: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      }
    );
    if (userExists) {
      const ifSame = await bcrypt.compare(
        userObject.password,
        userExists.password
      );
      if (!ifSame) return { error: "credsNotMatched" };
      userExists.password = "";
      const jwtoken = await tokenGenerator(userExists.toJSON(), "1d");
      return { error: null, jwtoken };
    }
    return { error: "credsNotMatched" };
  } catch (error) {
    return { error };
  }
};

module.exports = { signup, login };
