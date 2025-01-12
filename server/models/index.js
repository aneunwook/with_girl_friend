import Post from './postModel.js';
import Photo from './photoModel.js';

Post.hasMany(Photo, { foreignKey: 'post_id', as: 'photos' });
Photo.belongsTo(Post, { foreignKey: 'post_id', as: 'post' });

export { Post, Photo };
