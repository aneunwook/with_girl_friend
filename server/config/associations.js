import Post from '../models/postModel.js';
import Photo from '../models/photoModel.js';
import User from '../models/userModel.js';
import Couple from '../models/couples.js';
import Playlist from '../models/Playlist.js';

const defineAssociations = () => {
  // 게시글 - 사진 관계
  Post.hasMany(Photo, { foreignKey: 'post_id', as: 'postPhotos' });
  Photo.belongsTo(Post, { foreignKey: 'post_id', as: 'post' });

  Couple.belongsTo(User, { foreignKey: 'user1_id', as: 'partner1' });
  Couple.belongsTo(User, { foreignKey: 'user2_id', as: 'partner2' });

  Playlist.belongsTo(Couple, { foreignKey: "couple_id", as: "couple" });


};  

export default defineAssociations;
