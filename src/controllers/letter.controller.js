import { connection } from "../config/connecDB.config.js";

export const sendLetter = (req,res) => {
    try {
        if(!req.cookies?.userInfo?.id){
            return res.send('Gửi thư không thành công !')
        } 
        const currentTime = new Date().getTime()
        console.log('currentTime', currentTime)
        const sql = "INSERT INTO mailbox (title, content, file, idSender, idReceiver, dateTime) VALUES (?,?,?,?,?,?)"
        const uploadedFile = req.file;
        const mapData = [
            req.body.title || 'Không có tiêu đề',
            req.body.content,
            uploadedFile?.path || '',
            req.cookies?.userInfo?.id,
            Number(req.body.receiver),
            currentTime
        ]
         connection.query(sql, mapData,(error, 
        results) => {
           if (error) return res.json({ msg: error.message });
           if(results) {
                return res.json({ msg: 'Thư đã được gửi thành công'});
           }
           });
    } catch (error) {
        return res.json({ msg: 'Có lỗi xảy ra, vui lòng thử lại'});
    }
}
