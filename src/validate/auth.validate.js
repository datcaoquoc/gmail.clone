export const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

export const validateFormRegister = (dataBody) => {
  var msg = ''
  // check if fullname empty
  if (dataBody.fullName.trim() === "") return msg = 'Vui lòng nhập Họ và tên !'
    // Check if email is empty
  if (dataBody.email.trim() === "") return msg = 'Vui lòng nhập email !'
   // Check if email format
  if (validateEmail(dataBody.email.trim()) === null) return msg = 'Định dạng email không chính xác !'
   // Check if password is empty
  if (dataBody.pwd.trim() === "") return msg = 'Vui lòng nhập mật khẩu !'
  // Check if password length
  if (dataBody.pwd.trim().length < 6) return msg = 'Mật khẩu phải lớn hơn 6 ký tự !'
  // Check if re-password is empty
  if (dataBody.rePwd.trim() === "") return msg = 'Vui lòng nhập xác nhận mật khẩu !'
  // Check if re-password not match password is empty
  if (dataBody.rePwd.trim() !== dataBody.pwd.trim()) return msg = 'Xác nhận mật khẩu không đúng !'
  return msg 
}

export const validateFormLogin = (dataBody) => {
  var msg = ''
  if (dataBody.email.trim() === "") return msg = 'Vui lòng nhập email !'
  if (dataBody.pwd.trim() === "") return msg = 'Vui lòng nhập mật khẩu !'
  return msg
}

