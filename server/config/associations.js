import Post from '../models/postModel.js';
import Photo from '../models/photoModel.js';
import User from '../models/userModel.js';
import EmailVerification from '../models/emailVerifications.js';

const defineAssociations = () => {
  // 게시글 - 사진 관계
  Post.hasMany(Photo, { foreignKey: 'post_id', as: 'postPhotos' });
  Photo.belongsTo(Post, { foreignKey: 'post_id', as: 'post' });
};

export default defineAssociations;
