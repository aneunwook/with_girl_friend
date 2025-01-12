import Post from '../models/postModel.js';
import Photo from '../models/photoModel.js';

const defineAssociations = () => {
  Post.hasMany(Photo, { foreignKey: 'post_id' });
  Photo.belongsTo(Post, { foreignKey: 'post_id' });
};

export default defineAssociations;
