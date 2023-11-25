import { Router } from 'express';
import { CONSTANT } from '../constants/constant.js';
import { login, logout, register, signUpPage } from '../controllers/authent.controller.js'
import { InboxPage, OutboxPage, detailPage, letterCompose } from '../controllers/home.controler.js';
import { getAllUser } from '../controllers/user.controller.js';
import { sendLetter } from '../controllers/letter.controller.js';
import multer from 'multer'
import path from 'path'
import { checkAccess } from '../middleware/checkAccess.js';
const router = Router();

// config save file
export const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Specify the directory where uploaded files will be stored
      cb(null, 'public/data/uploads/');
    },
    filename: function (req, file, cb) {
      // Specify the filename for the uploaded file
      if(file === undefined) return
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
export const upload = multer({ storage: storage });
  

// inbox page
router.get('/inbox',checkAccess, InboxPage)

// detail page
router.get('/detail', checkAccess, detailPage)

// outbox page
router.get('/outbox',checkAccess, OutboxPage)

// letter compose
router.get('/soan-thu',checkAccess, letterCompose)

// sign-up
router.get('/dang-ky', signUpPage)

//login api
router.post('/login', login)

// sign-up api
router.post('/register', register)

// logout api
router.get('/logout', logout)

router.get('/getAllUser',checkAccess, getAllUser)

router.post('/send-letter',checkAccess, upload.single('file'), sendLetter)


router.get('/*', async (req, res) => {
  const isLogin = req.cookies?.[CONSTANT.NAME_COOKIE];
  const dataUser = req.cookies?.[CONSTANT.NAME_KEY_COOKIE_DATA_USER];
  if(isLogin && dataUser) {
    await res.redirect('/inbox') 
    await res.render(CONSTANT.INBOX_PAGE_FILE, {
      listLetter: [],
      total: 0,
      curentPage: 0,
      userName: '',
      emailUser: '',
    })
  }
  res.render(CONSTANT.LOGIN_FILE, { msg: "", email: '', password: '' })
})


// // Route for setting the cookies
// router.get('/setcookie', function (req, res) {
//     res.cookie(CONSTANT.NAME_COOKIE, true, { maxAge: 900000, httpOnly: true });
//     res.send('Cookies added');
// })
 
// // Route for getting all the cookies
// router.get('/getcookie', function (req, res) {
//     console.log(req)
//     res.send(req.cookies);
// })

export default router;