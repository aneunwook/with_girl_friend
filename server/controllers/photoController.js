import sequelize from '../config/db.js';
import Post from '../models/postModel.js';
import Photo from '../models/photoModel.js';

export const createPostWithPhotos = async (req, res) => {
  const t = await sequelize.transaction(); // 트랜잭션 시작
  try {
    const { user_id, title, description, tags } = req.body;

    // 파일이 업로드되지 않았을 경우 에러 처리
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: '파일이 업로드 되지 않았습니다.' });
    }
    const userId = 1;

    // 1. 게시물 생성
    const newPost = await Post.create(
      { user_id: userId, title, description, tags },
      { transaction: t }
    );

    // 2. 사진 데이터 준비
    const photoData = req.files.map((file) => ({
      post_id: newPost.id,
      photo_url: `/uploads/${file.filename}`,
    }));

    // 3. 사진 저장
    await Photo.bulkCreate(photoData, { transaction: t });

    await t.commit(); // 트랜잭션 커밋
    res
      .status(201)
      .json({ message: '게시물이 생성되었습니다.', post: newPost });
  } catch (err) {
    await t.rollback(); // 트랜잭션 롤백
    console.error('사진 업로드 실패:', err);
    res.status(500).json({ error: '사진 업로드 중 문제가 발생했습니다.' });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    // 쿼리 파라미터에서 page와 limit 값을 가져옴, 기본값은 1페이지, 10개씩
    const { page = 1, limit = 10 } = req.query;

    // 페이지 번호와 한 페이지에 보여줄 개수를 정수로 변환
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    // 유효한 페이지 번호와 limit 체크
    if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
      return res.status(400).json({ message: 'Invalid page or limit value' });
    }

    // findAndCountAll로 posts와 totalPosts를 한 번의 쿼리로 가져옴
    //count: 전체 게시물 수를 반환 rows: 해당 페이지에 해당하는 게시물들만 반환
    const { count: totalPosts, rows: posts } = await Post.findAndCountAll({
      //데이터베이스 쿼리에서 offset은 몇번째 게시물부터 가져올 것인지를 나타냄
      offset: (pageNum - 1) * limitNum, // 페이지 번호에 맞는 데이터 시작 위치
      limit: limitNum, // 한 페이지에 가져올 데이터 개수
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
    const { post_id } = req.params;

    // 게시물과 관련된 사진들을 포함하여 조회
    const post = await Post.findOne({
      where: { id: post_id },
      include: [
        {
          model: Photo,
          as: 'photos', // 관계 이름
          attributes: ['id', 'photo_url', 'created_at'], // 사진 URL 및 생성일 포함
        },
      ],
    });

    if (!post) {
      return res.status(404).json({ error: '게시물을 찾을 수 없습니다.' });
    }

    res.status(200).json(post); // 게시물과 관련된 사진들을 함께 반환
  } catch (err) {
    console.error('게시물 상세보기 실패:', err);
    res.status(500).json({ error: '게시물 조회 중 문제가 발생했습니다.' });
  }
};

export const updatePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const { photo_url, title, description, tags, is_private } = req.body;

    const photo = await Photo.findByPk(id);

    if (!photo) {
      return res.status(404).json({ message: '사진을 찾을 수 없습니다' });
    }

    photo.photo_url = photo_url || photo.photo_url; // title이 있을 경우 수정, 없으면 기존 값 유지
    photo.title = title || photo.title;
    photo.description = description || photo.description;
    photo.tags = tags || photo.tags;
    photo.is_private = is_private !== undefined ? is_private : photo.is_private;

    await photo.save();

    res.status(200).json(photo); // 수정된 사진 반환
  } catch (err) {
    console.error('사진 수정 실패', err);
    res.status(500).json({ error: '사진 수정 중 문제가 발생했습니다.' });
  }
};
