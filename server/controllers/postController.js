import Post from '../models/postModel.js';
import { Op } from 'sequelize';

const createPost = async (req, res) => {
  try {
    const { user_id, title, description, tags } = req.body;

    const tagsArray = Array.isArray(tags)
      ? tags
      : tags.split(',').map((tag) => tag.trim());

    const newPost = await Post.create({
      user_id,
      title,
      description,
      tags: tagsArray,
    });
    return res.status(200).json(newPost);
  } catch (err) {
    console.error('Error creating post: ', err);
    return res.status(500).send('Error creating post');
  }
};

const getAllPosts = async (req, res) => {
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

const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ message: 'post not found' });
    }

    post.title = title || post.title;
    post.content = content || post.content;

    await post.save();

    return res.status(200).json(post);
  } catch (err) {
    console.error('Error updating post:', err);
    return res.status(500).json({ message: 'Error updating post' });
  }
};

const getPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ message: 'post not found' });
    }
    return res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ message: 'post not found' });
    }

    await post.destroy();
    return res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
export { createPost, getAllPosts, updatePost, getPostById, deletePost };
