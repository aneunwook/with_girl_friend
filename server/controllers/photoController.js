import { fileURLToPath } from 'url';
import sequelize from '../config/db.js';
import Post from '../models/postModel.js';
import Photo from '../models/photoModel.js';
import fs from 'fs';
import path from 'path';
import { Op } from 'sequelize';
import User from '../models/userModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadPhotos = async (req, res) => {
  try {
    console.log('요청 파일:', req.files); // 업로드된 파일 확인 로그

    const fileUrls = req.files.map((file) => `/uploads/${file.filename}`);
    console.log('생성된 파일 URL:', fileUrls); // 확인 로그

    res.status(200).json({ urls: fileUrls });
  } catch (error) {
    console.error('이미지 업로드 오류:', error);
    res
      .status(500)
      .json({ message: '이미지 업로드 실패', error: error.message });
  }
};

export const createPostWithPhotos = async (req, res) => {
  const transaction = await Post.sequelize.transaction(); // 트랜잭션 시작

  try {
    // 게시물 저장
    const { title, description, tags, photoUrls } = req.body;
    const user_id = req.user.id;

    const tagsArray = Array.isArray(tags)
      ? tags
      : tags.split(',').map((tag) => tag.trim());

    const newPost = await Post.create(
      { title, description, user_id, tags: tagsArray },
      { transaction }
    );

    // 사진 저장 (photoUrls를 사용)
    if (photoUrls && photoUrls.length > 0) {
      const photoData = photoUrls.map((url) => ({
        post_id: newPost.id,
        photo_url: url, // 클라이언트에서 전달받은 URL
      }));

      await Photo.bulkCreate(photoData, { transaction });
    }

    await transaction.commit(); // 트랜잭션 커밋
    res
      .status(201)
      .json({ message: '게시물과 사진이 성공적으로 저장되었습니다.' });
  } catch (err) {
    await transaction.rollback(); // 트랜잭션 롤백
    console.error(err);
    res.status(500).json({
      message: '게시물 저장 중 오류가 발생했습니다.',
      error: err.message,
    });
  }
};

export const searchPostsByTag = async (req, res) => {
  try {
    console.log('📡 검색 요청 도착:', req.originalUrl, req.query); // ✅ 요청 URL & 쿼리 확인

    const { query } = req.query;
    const userId = req.user.id;

    if (!query || query.trim() === '') {
      return res.status(400).json({ message: '검색어를 입력해주세요.' });
    }

    const postSearch = await Post.findAll({
      where: {
        user_id: userId,
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { tags: { [Op.contains]: [query] } }, // 배열 안에 검색어 포함 여부 확인
        ],
      },
    });

    if (postSearch.length === 0) {
      return res.status(200).json({ posts: [], totalPages: 1 }); //  빈 배열 반환
    }

    console.log('🔎 검색 결과:', postSearch); // 검색된 데이터 확인

    return res.status(200).json(postSearch);
  } catch (err) {
    console.error('Error searching posts:', err);
    return res.status(500).send('Error searching posts');
  }
};

export const getAllPosts = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    // 쿼리 파라미터에서 page와 limit 값을 가져옴, 기본값은 1페이지, 10개씩
    const { page = 1, limit = 12 } = req.query;
    const userId = req.user.id;

    // 페이지 번호와 한 페이지에 보여줄 개수를 정수로 변환
    const pageNum = parseInt(page, 12);
    const limitNum = parseInt(limit, 12);

    // 유효한 페이지 번호와 limit 체크
    if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
      return res.status(400).json({ message: 'Invalid page or limit value' });
    }

    // findAndCountAll로 posts와 totalPosts를 한 번의 쿼리로 가져옴
    //count: 전체 게시물 수를 반환 rows: 해당 페이지에 해당하는 게시물들만 반환
    //데이터베이스 쿼리에서 offset은 몇번째 게시물부터 가져올 것인지를 나타냄
    const { count: totalPosts, rows: posts } = await Post.findAndCountAll({
      where: { user_id: userId }, //  로그인한 사용자의 게시물만 가져옴
      offset: (pageNum - 1) * limitNum, // 페이지 번호에 맞는 데이터 시작 위치
      limit: limitNum, // 한 페이지에 가져올 데이터 개수
      order: [['created_at', 'DESC']], // 최신 게시물 정렬
      include: [
        {
          model: Photo,
          as: 'postPhotos', // photo 모델과의 관계에서 지정된 별칭
          attributes: ['id', 'photo_url'], // 필요한 필드만 가져옴
        },
      ],
    });
    console.log('totalPosts:', totalPosts); // 실제 데이터 개수 확인
    console.log('posts:', posts); // 가져온 포스트 데이터 확인

    // 전체 페이지 수 계산
    const totalPages = Math.ceil(totalPosts / limitNum);

    return res.status(200).json({
      posts, // 현재 페이지에 해당하는 게시물 데이터
      totalPosts, // 전체 게시물 수
      totalPages, // 전체 페이지 수
      currentPage: pageNum, // 현재 페이지
    });
  } catch (err) {
    console.error('Error creating post:', err);
    return res.status(500).send('Error creating post');
  }
};

// 게시물 상세보기
export const getPostDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // 게시물과 관련된 사진들을 포함하여 조회
    const post = await Post.findOne({
      where: { id, user_id: userId },
      include: [
        {
          model: Photo,
          as: 'postPhotos', // 관계 이름
          attributes: ['id', 'photo_url', 'created_at'], // 사진 URL 및 생성일 포함
        },
        {
          model: User,
          as: 'author',
          attributes: ['name'],
        },
      ],
    });

    if (!post) {
      return res.status(404).json({ error: '게시물을 찾을 수 없습니다.' });
    }

    if (post.user_id !== req.user.id) {
      return res
        .status(403)
        .json({ error: '이 게시물에 대한 권한이 없습니다.' });
    }

    res.status(200).json(post); // 게시물과 관련된 사진들을 함께 반환
  } catch (err) {
    console.error('게시물 상세보기 실패:', err);
    res.status(500).json({ error: '게시물 조회 중 문제가 발생했습니다.' });
  }
};

export const updatePostWithPhotos = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { photosToDelete, title, description, tags, is_private } = req.body;

    const newFiles = req.files;

    // 1. 게시물 수정
    const post = await Post.findOne({
      where: { id, user_id: userId }, // 현재 로그인한 사용자의 게시물인지 확인
      include: { model: Photo, as: 'postPhotos' },
    });

    if (!post) {
      return res.status(404).json({ message: '사진을 찾을 수 없습니다' });
    }

    const tagsArray = Array.isArray(tags)
      ? tags
      : tags.split(',').map((tag) => tag.trim());

    // 게시물 정보 업데이트
    post.title = title || post.title; // title이 있을 경우 수정, 없으면 기존 값 유지
    post.description = description || post.description;
    post.tags = tagsArray;
    post.is_private = is_private !== undefined ? is_private : post.is_private;

    await post.save({ transaction: t });

    // 2. 사진 삭제
    if (photosToDelete && Array.isArray(photosToDelete)) {
      const photos = await Photo.findAll({
        where: { id: photosToDelete, post_id: id },
      });

      for (const photo of photos) {
        const filePath = path.join(__dirname, '..', '..', photo.photo_url);
        try {
          await fs.promises.unlink(filePath); // 비동기 삭제
        } catch (err) {
          console.error(`Failed to delete file: ${filePath}`, err);
        }
      }

      // DB에서 사진 데이터 삭제
      await Photo.destroy({
        where: {
          id: photosToDelete,
          post_id: id,
        },
        transaction: t,
      });
    }

    //3. 새 사진 추가
    if (newFiles && newFiles.length > 0) {
      const newPhotoData = newFiles.map((file) => ({
        post_id: id,
        photo_url: `/uploads/${file.filename}`,
      }));

      await Photo.bulkCreate(newPhotoData, { transaction: t });
    }
    await t.commit(); // 트랜잭션 커밋
    console.log('수정 데이터 ', post);

    res
      .status(200)
      .json({ message: '게시물이 성공적으로 수정되었습니다.', post });
  } catch (err) {
    await t.rollback(); // 트랜잭션 롤백
    console.error('게시물 수정 실패:', err);
    res.status(500).json({ error: '게시물 수정 중 문제가 발생했습니다.' });
  }
};

export const deletePostWithPhotos = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;
    const userId = req.user.id; // 현재 로그인한 사용자 ID (토큰에서 가져옴)

    //1. 게시물 확인
    const post = await Post.findOne({
      where: { id, user_id: userId }, // ✅ 현재 로그인한 사용자의 게시물인지 확인
      include: { model: Photo, as: 'postPhotos' },
    });
    if (!post) {
      return res.status(404).json({ message: '게시물이 존재하지 않습니다' });
    }

    // 게시물 소유자 검증 (현재 로그인한 사용자와 게시물 작성자 비교)
    if (post.user_id !== userId) {
      return res.status(403).json({ message: '삭제할 권한이 없습니다.' });
    }

    // 게시물 삭제 (연결된 사진도 함께 삭제됨, `onDelete: CASCADE` 설정 덕분)
    await post.destroy({ transaction: t });

    await t.commit(); // 트랜잭션 커밋
    res.status(200).json({ message: '게시물이 삭제되었습니다.' });
  } catch (err) {
    await t.rollback(); // 트랜잭션 롤백
    console.error('게시물 삭제 실패:', err);
    res.status(500).json({ error: '게시물 삭제 중 문제가 발생했습니다.' });
  }
};
