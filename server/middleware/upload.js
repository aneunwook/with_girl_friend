import multer from 'multer';
import path from 'path';
import fs from 'fs';

// 업로드 경로 설정
const uploadDir = path.join(process.cwd(), '../uploads');
const tripDir = path.join(process.cwd(), '../trip');

// 기본 디렉토리 생성 (없으면 생성)
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(tripDir)) {
  fs.mkdirSync(tripDir, { recursive: true });
}


// 파일 저장 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 조건적으로 저장 경로 설정
    if (file.fieldname === 'trip') {
      // trip 파일은 trip 폴더에 저장
      cb(null, tripDir);
    } else {
      // 그 외의 파일은 uploads 폴더에 저장
      cb(null, uploadDir);
    }
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

// 파일 필터링 (이미지 파일만 허용)
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
    fileSize: 50 * 1024 * 1024, // 50MB까지 허용
  },
  fileFilter,
});

export default upload;
