import { CONSTANT } from "../constants/constant.js";

export const checkAccess = (req, res, next) => {
    const isLogin = req.cookies?.[CONSTANT.NAME_COOKIE];
  const dataUser = req.cookies?.[CONSTANT.NAME_KEY_COOKIE_DATA_USER];
  if(isLogin && dataUser) {
    next()
  }else{
    res.render(CONSTANT.NOT_ACCESS_FILE)
  }
}
