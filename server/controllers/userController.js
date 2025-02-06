import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import EmailVerification from '../models/emailVerifications.js';
import generateToken from '../utils/generateToken.js';
import dotenv from 'dotenv';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { where } from 'sequelize';

dotenv.config();

// 이메일 전송 설정 (nodemailer)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT), // 숫자로 변환
  secure: process.env.EMAIL_SECURE === 'true', // true면 SSL, false면 TLS(STARTTLS)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 이메일 인증 코드 요청 API
const sendVerificationCode = async (req, res) => {
  const { email } = req.body;
  console.log('📩 이메일 인증 코드 요청:', email);

  try {
   // 랜덤한 인증 코드 생성
   const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 인증 코드 저장 (기존 레코드가 있다면 덮어쓰기)
    await EmailVerification.upsert({
      email,
      code,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10분 후 만료
      isVerified: false, // 인증 전 상태
    });

    // 이메일 전송 코드 추가
    const mailOptions = {
      from: process.env.EMAIL_USER, // 발신자 이메일
      to: email, // 수신자 이메일
      subject: '이메일 인증 코드',
      text: `인증 코드: ${code} (10분 내에 입력해주세요)`,
    };

    await transporter.sendMail(mailOptions); // 이메일 전송 실행

    console.log(`인증 코드 발송 완료: ${email}, 코드: ${code}`);

    res.status(200).json({ message: '인증 코드가 전송되었습니다.' });
  } catch (error) {
    console.error('인증 코드 발송 실패:', error);
    res.status(500).json({ error: '서버 오류 발생' });
  }
};


const verifyEmailCode = async (req, res) => {
  const { email, code } = req.body;
  console.log('📩 받은 요청 데이터:', req.body);

  try {
    // 🔍 인증 코드 확인
    const record = await EmailVerification.findOne({ where: { email, code } });

    console.log('🔍 찾은 레코드:', record);

    if (!record) {
      return res.status(400).json({ error: '잘못된 인증 코드입니다.' });
    }

    if (new Date() > record.expiresAt) {
      return res.status(400).json({ error: '인증 코드가 만료되었습니다.' });
    }

    console.log('✅ 이메일 인증 완료:', email);

    // 인증 성공 시, 해당 이메일의 인증 코드 삭제
    await EmailVerification.destroy({ where: { email } });

    res.status(200).json({ message: '이메일 인증 성공!' });
  } catch (error) {
    console.error('❌ 서버 에러 발생:', error);
    res.status(500).json({ error: '서버 오류 발생', details: error.message });
  }
};

const signUp = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    console.log('Request Body:', req.body);

    if (!email || !password || !name) {
      return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: '비밀번호가 최소 8자 이상이여야 합니다' });
    }

    //비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('암호화된 비밀번호:', hashedPassword);

    //사용자 생성
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
      isVerified: true, // 회원가입 후에도 유지
    });

    //이메일 인증 토큰 생성 (1시간 유효)
    const token = jwt.sign(
      { email: newUser.email },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: '1h',
      }
    );

    console.log('회원가입 완료:', newUser);

    res.status(201).json({ message: '회원가입 성공' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버오류' });
  }
};

const checkEmail = async (req, res) => {
  try{
    const {email} = req.body

    if(!email){
      return res.status(400).json({message : '이메일 인증이 필요합니다.'});
    }

     //이메일 중복확인
     const duplicationEmail = await User.findOne({where : { email }});
      if(duplicationEmail){
        return res.status(409).json({message : '이미 존재하는 이메일 입니다.'})
      }

    res.status(200).json({message : '사용 가능한 이메일 입니다.'})
  }catch(err){
    console.error(err);
    res.status(500).json({message : '서버 오류 입니다.'});
  }
}

const signIn = async (req, res) => {
  try {
    console.log('signIn 요청 데이터:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('필드 누락 에러 발생');
      return res.status(400).json({ message: '모든 필드를 입력해 주세요' });
    }

    // 사용자 조회
    const user = await User.findOne({ where: { email } });
    console.log('DB에서 찾은 사용자:', user);

    if (!user) {
      return res
        .status(401)
        .json({ message: '이메일 또는 비밀번호가 일치하지 않습니다' });
    }

    // 이메일 인증 확인 추가
    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: '이메일 인증 후 로그인 가능합니다.' });
    }

    // 비밀번호 일치 확인
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('비밀번호 비교 결과:', passwordMatch);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: '이메일 또는 비밀번호가 일치하지 않습니다' });
    }

    //jwt 토큰 생성
    const token = generateToken(user);

    console.log('로그인 성공, 발급된 토큰', token);
    return res.json({
      success: true,
      message: '로그인 성공',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: '서버오류' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다' });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: '서버 오류' });
  }
};

export {
  signIn,
  signUp,
  getUserProfile,
  sendVerificationCode,
  verifyEmailCode,
  checkEmail
};
