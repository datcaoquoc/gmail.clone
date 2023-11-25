import { connection } from "../config/connecDB.config.js";

import { CONSTANT, TYPE_MESAGE } from "../constants/constant.js";
import {
  validateEmail,
  validateFormLogin,
  validateFormRegister,
} from "../validate/auth.validate.js";

export const login = async (req, res) => {
  const dataBody = req.body;

  try {

    const validate = validateFormLogin(dataBody);
    if (validate !== "") {
      return res.render(CONSTANT.LOGIN_FILE, {
        msg: validate,
        email: dataBody.email,
        password: dataBody.pwd,
      });
    }

    // Perform the database query using async/await
    const infoUser = await new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM user WHERE email=?",
        [dataBody.email],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });

    // If no user found
    if (infoUser.length <= 0) {
      return res.render(CONSTANT.LOGIN_FILE, {
        msg: "Tài khoản không tồn tại trên hệ thống !",
        email: dataBody.email,
        password: dataBody.pwd,
      });
    }

    // Check if email and password match
    const isExit = infoUser.some((user) => {
      return (
        user.email === dataBody.email.trim() &&
        user.password === dataBody.pwd.trim()
      );
    });

    if (isExit) {
      // save islogin in cookie
      res.cookie(CONSTANT.NAME_COOKIE, true, {
        // time 1 day
        maxAge: 86400000,
        httpOnly: true,
      });
    //   save data user
      res.cookie(CONSTANT.NAME_KEY_COOKIE_DATA_USER, infoUser[0], {
         // time 1 day
        maxAge: 86400000,
        httpOnly: true,
      });
      return res.redirect("/inbox");
    } else {
      // Incorrect email or password
      return res.render(CONSTANT.LOGIN_FILE, {
        msg: "Tên người dùng hoặc mật khẩu không chính xác !",
        email: dataBody.email,
        password: dataBody.pwd,
      });
    }
  } catch (error) {
    console.error("Error during login:", error);

    // Handle the error and render an appropriate template
    return res.render("error-layout");
  }
};

export const register = async (req, res) => {
  const dataBody = req.body;
  const valueInsert = [dataBody.fullName, dataBody.email, dataBody.pwd];
  try {
    const validate = validateFormRegister(dataBody);
    if (validate !== "") {
      return res.render(CONSTANT.REGISTER_FILE, {
        msg: validate,
        type: TYPE_MESAGE.ERROR,
        email: dataBody.email,
        fullName: dataBody.fullName,
        password: dataBody.pwd,
        rePassword: dataBody.rePwd,
      });
    }

    // check account exit
    const accountExit = await new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM user WHERE email=?",
        [dataBody.email],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });

    if (accountExit.length > 0) {
      return res.render(CONSTANT.REGISTER_FILE, {
        msg: "Tài khoản email đã tồn tại trên hệ thống, vui lòng kiểm tra lại !",
        type: TYPE_MESAGE.ERROR,
        email: dataBody.email,
        fullName: dataBody.fullName,
        password: dataBody.pwd,
        rePassword: dataBody.rePwd,
      });
    }

    var sqlInsertUser = "INSERT INTO user (name, email, password) VALUES (?, ?, ?)";
    // Perform the database query using async/await
    await new Promise((resolve, reject) => {
      connection.query(sqlInsertUser, valueInsert, (err, result) => {
        if (err) {
            return res.render(CONSTANT.REGISTER_FILE, {
                msg: "Có lỗi xảy ra , vui lòng thử lại",
                type: TYPE_MESAGE.ERROR,
                email: dataBody.email,
                fullName: dataBody.fullName,
                password: dataBody.pwd,
                rePassword: dataBody.rePwd,
              });
        } else {
            return res.render(CONSTANT.REGISTER_FILE, {
                msg: "Đăng ký tài khoản thành công",
                type: TYPE_MESAGE.SUCCESS,
                email: '',
                fullName: '',
                password: '',
                rePassword: '',
              });
        }
      });
    });

  } catch (error) {
    console.error("Error during login:", error);

    // Handle the error and render an appropriate template
    return res.render("error-layout");
  }
};

export const logout = (req, res) => {
    res.clearCookie(CONSTANT.NAME_COOKIE)
    res.clearCookie(CONSTANT.NAME_KEY_COOKIE_DATA_USER)
    res.redirect('/')
    res.render(CONSTANT.LOGIN_FILE)
}

export const signUpPage = (req, res) => {
  res.render(CONSTANT.REGISTER_FILE, {
    fullName: "",
    email: "",
    password: "",
    rePassword: "",
    msg: "",
    type: ''
  });
};
