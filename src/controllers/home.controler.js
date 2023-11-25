import { connection } from "../config/connecDB.config.js";
import { CONSTANT, TYPE_DETAILPAGE } from "../constants/constant.js";
import { renderTime } from "../utill/time.utill.js";

export const InboxPage = async (req, res) => {
  try {
    const curentPage = (req.query?.page - 1 || 0) * 5;
    const sqlgetTotal =
      "SELECT COUNT(*) AS totalRecords FROM mailbox WHERE mailbox.idReceiver = ?";
    const sqls =
      "SELECT mailbox.id, mailbox.title, mailbox.content, mailbox.file, mailbox.readStatus, mailbox.dateTime, user.name AS nameReceiver,user.email AS emailReceiver FROM mailbox JOIN user ON mailbox.idSender = user.id WHERE mailbox.idReceiver = ? ORDER BY mailbox.dateTime DESC LIMIT 5 OFFSET ?";
    const total = await new Promise((resolve, reject) => {
      connection.query(
        sqlgetTotal,
        [req.cookies?.userInfo?.id],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
    const listLetter = await new Promise((resolve, reject) => {
      connection.query(
        sqls,
        [req.cookies?.userInfo?.id, curentPage],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
    const newLetterMapping = listLetter.map((letter) => {
      return {
        ...letter,
        readStatus: Boolean(letter.readStatus),
        dateTime: renderTime(Number(letter.dateTime)),
      };
    });
    res.render(CONSTANT.INBOX_PAGE_FILE, {
      listLetter: newLetterMapping,
      total: Math.ceil(total[0].totalRecords / 5),
      curentPage: (req.query?.page - 1 || 0) + 1,
      userName: req.cookies?.userInfo?.name,
      emailUser: req.cookies?.userInfo?.email,
    });
  } catch (error) {
    console.log(error);
  }
};

export const OutboxPage = async (req, res) => {
  try {
    const curentPage = (req.query?.page - 1 || 0) * 5;
    const sqlgetTotal =
      "SELECT COUNT(*) AS totalRecords FROM mailbox WHERE mailbox.idSender = ?";
    const sqls =
      "SELECT mailbox.id, mailbox.title, mailbox.content, mailbox.file, mailbox.readStatus, mailbox.dateTime, user.name AS nameReceiver,user.email AS emailReceiver FROM mailbox JOIN user ON mailbox.idReceiver = user.id WHERE mailbox.idSender = ? ORDER BY mailbox.dateTime DESC LIMIT 5 OFFSET ?";
    const total = await new Promise((resolve, reject) => {
      connection.query(
        sqlgetTotal,
        [req.cookies?.userInfo?.id],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
    const listLetter = await new Promise((resolve, reject) => {
      connection.query(
        sqls,
        [req.cookies?.userInfo?.id, curentPage],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
    const newLetterMapping = listLetter.map((letter) => {
      return {
        ...letter,
        readStatus: Boolean(letter.readStatus),
        dateTime: renderTime(Number(letter.dateTime)),
      };
    });

    res.render(CONSTANT.OUTBOX_PAGE_FILE, {
      listLetter: newLetterMapping,
      total: Math.ceil(total[0].totalRecords / 5),
      curentPage: (req.query?.page - 1 || 0) + 1,
      userName: req.cookies?.userInfo?.name,
      emailUser: req.cookies?.userInfo?.email,
    });
  } catch (error) {
    console.log(error);
  }
};

export const detailPage = async (req, res) => {
  try {
    if(!req.query?.id) return res.render(CONSTANT.NOT_ACCESS_FILE)
    if(!req.query?.type) return res.render(CONSTANT.NOT_ACCESS_FILE)
    if(req.query?.type !== TYPE_DETAILPAGE.SENDER && req.query?.type !== TYPE_DETAILPAGE.RECEIVER) return res.render(CONSTANT.NOT_ACCESS_FILE)
    
    const queryReadingEmail = 'UPDATE mailbox SET readStatus = 1 WHERE id = ?';
    const sqls =
    `SELECT mailbox.id, mailbox.title, mailbox.content, mailbox.file, mailbox.readStatus, mailbox.dateTime, user.name AS name,user.email AS email FROM mailbox JOIN user ON mailbox.${req.query?.type === TYPE_DETAILPAGE.SENDER ? 'idSender' : 'idReceiver'} = user.id WHERE mailbox.id = ?  LIMIT 1`;

    const readLetter = await new Promise((resolve, reject) => {
      connection.query(
        queryReadingEmail,
        [req.query?.id],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });

    const detailLetter = await new Promise((resolve, reject) => {
      connection.query(
        sqls,
        [req.query?.id],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
    if(!detailLetter) return res.render(CONSTANT.NOT_ACCESS_FILE)

    const newLetterMapping = detailLetter.map((letter) => {
      return {
        ...letter,
        dateTime: renderTime(Number(letter.dateTime)),
      };
    });

    res.render(CONSTANT.DETAIL_FILE,{
      userName: req.cookies?.userInfo?.name,
      emailUser: req.cookies?.userInfo?.email,
      title: newLetterMapping?.[0].title,
      content: newLetterMapping?.[0].content,
      file: newLetterMapping?.[0].file,
      name: newLetterMapping?.[0].name,
      email: newLetterMapping?.[0].email,
      dateTime: newLetterMapping?.[0].dateTime,
      type: req.query?.type
    })
  } catch (error) {
    console.log(error);
  }
};

export const letterCompose = (req, res) => {
  res.render(CONSTANT.LETTER_COMPOSE_FILE);
};
