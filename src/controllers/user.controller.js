import { connection } from "../config/connecDB.config.js";

export const getAllUser = (req,res) => {
    const sql = 'SELECT * FROM user WHERE id <> ?'
    connection.query(
        sql,[req.cookies?.userInfo?.id],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            const data = result.map(user => {
                return {
                    id: user.id,
                    email: user.email
                }
            })
            res.send(data);
          }
        }
      );
}