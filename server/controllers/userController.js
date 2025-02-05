import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import EmailVerification from '../models/emailVerifications.js';
import generateToken from '../utils/generateToken.js';
import dotenv from 'dotenv';
import crypto from "crypto";
import nodemailer from "nodemailer";

dotenv.config();

// 이메일 전송 설정 (nodemailer)
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: process.env.EMAIL_HOST,  
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === "false", // true면 SSL, false면 TLS(STARTTLS)
  auth : {
    user : process.env.EMAIL_USER,
    pass : process.env.EMAIL_PASS,
  },
})

// 6자리 랜덤 코드 생성 함수
const generateVerificaionCode = () => {
  return crypto.randomInt(100000, 999999).toString();
}

// 이메일 인증 코드 요청 API
const sendVerificationEmail = async (req,res) => {
  const { email } = req.body;

  try {
    const code = generateVerificaionCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10분 후 만료
  
    // 기존 인증 코드 삭제 후 새 코드 저장
    await EmailVerification.destroy({ where: { email } });
    await EmailVerification.create({ email, code, expiresAt });

    // 이메일 전송
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "이메일 인증 코드",
      text: `인증 코드: ${code} (10분 내 입력)`,
    });

    res.status(200).json({ message: "이메일 인증 코드가 전송되었습니다." });
  } catch (error) {
    res.status(500).json({ error: "이메일 전송 실패" });
  }
}

const verifyEmailCode = async (req, res) => {
  const { email, code } = req.body;

  try{
    const record = await EmailVerification.findOne({where : {email, code}});

    if (!record) {
      return res.status(400).json({ error: "잘못된 인증 코드입니다." });
    }

    if (new Date() > record.expiresAt) {
      return res.status(400).json({ error: "인증 코드가 만료되었습니다." });
    }

    //인증 성공 -> User 테이블 업데이트
    await User.update({ isVerified: true }, { where: { email } });

    // 인증 성공하면 삭제하고 회원가입 허용
    await EmailVerification.destroy({where: { email }});

    res.status(200).json({message: '이메일 인증 성공!'});
  }catch(error){
    res.status(500).json({ error : '서버 오류 발생'});
  }
}

const signUp = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    console.log('Request Body:', req.body);

    if (!email || !password || !name) {
      return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
    }
    console.log('Received body:', req.body);

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: '비밀번호가 최소 8자 이상이여야 합니다' });
    }

    //이메일 중복확인
    const duplicationEmail = await User.findOne({ where: { email } });
    if (duplicationEmail) {
      return res.status(409).json({ message: '이미 존재하는 이메일 입니다' });
    }

      // 이메일 인증 여부 확인
      const emailVerified = await EmailVerification.findOne({ where: { email } });
      if (!emailVerified) {
        return res.status(400).json({ error: "이메일 인증이 필요합니다." });
      }

    //비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('암호화된 비밀번호:', hashedPassword);

    //사용자 생성
    const newUser = await User.create({ email, password: hashedPassword, name });

    //이메일 인증 토큰 생성 (1시간 유효)
    const token = jwt.sign({email : newUser.email}, process.env.JWT_SECRET_KEY, {
      expiresIn : '1h'
    })

    res.status(201).json({ message: '회원가입 성공' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버오류' });
  }
};

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
      return res.status(403).json({ message: '이메일 인증 후 로그인 가능합니다.' });
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
  try{
    const user = await User.findByPk(req.user.id);

    if(!user){
      return res.status(404).json({message: '사용자를 찾을 수 없습니다'});
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
}

export { signIn, signUp, getUserProfile, sendVerificationEmail, verifyEmailCode };
