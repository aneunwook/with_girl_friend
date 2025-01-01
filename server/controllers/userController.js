import bcrypt from 'bcrypt';
import User from '../models/userModel.js';

const signUp = async (req, res) => {
  try {
    console.log('Request Body:', req.body);

    const { email, password, name } = req.body;

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

    //비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('암호화된 비밀번호:', hashedPassword);
    //사용자 생성
    await User.create({ email, password: hashedPassword, name });

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
      console.log('사용자가 존재하지 않음');
      return res
        .status(401)
        .json({ message: '이메일 또는 비밀번호가 일치하지 않습니다' });
    }

    // 비밀번호 일치 확인
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('비밀번호 비교 결과:', passwordMatch);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: '이메일 또는 비밀번호가 일치하지 않습니다' });
    }

    console.log('로그인 성공');
    return res.json({
      success: true,
      message: '로그인 성공',
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

export { signIn, signUp };
