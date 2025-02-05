// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';

// dotenv.config();

// const transporter = nodemailer.createTransport({
//     service : 'gmail',
//     auth : {
//         user : process.env.EMAIL_USER,
//         pass : process.env.EMAIL_PASS, 
//     },
// })

// // 이메일 전송 함수
// export const sendVerificationEmail = async (email, token) => {
//     const verificationLink = `${process.env.BASE_URL}/verify-email?token=${token}`;

//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: email,
//         subject: '이메일 인증 요청',
//         html: `
//         <h3>회원가입을 완료하려면 이메일을 인증하세요.</h3>
//         <p>아래 링크를 클릭하여 이메일 인증을 완료하세요.</p>
//         <a href="${verificationLink}">${verificationLink}</a>
//         `,
//   };

//   await transporter.sendMail(mailOptions);
// }