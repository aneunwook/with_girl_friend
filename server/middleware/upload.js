import multer from 'multer';
import path from 'path';
import fs from 'fs'; // ES6 모듈 방식

// 저장 경로 확인 및 생성
const uploadDir = path.join(process.cwd(), '../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // 폴더 생성
}

// 파일 저장 경로와 이름 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Uploading to:', uploadDir); // 업로드 경로 확인
    cb(null, uploadDir); // 업로드 파일 저장 경로
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.random(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
    console.log(req.file);
  },
});

//파일 필터링
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('이미지 파일만 업로드 가능합니다!'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 파일 크기 제한 (50MB)
    fieldSize: 50 * 1024 * 1024, // 텍스트 필드 크기 제한 (50MB)
  },
  fileFilter,
});

export default upload;
