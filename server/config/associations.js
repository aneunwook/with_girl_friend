import Post from "../models/postModel.js";
import Photo from "../models/photoModel.js";
import User from "../models/userModel.js";
import EmailVerification from "../models/emailVerifications.js"

const defineAssociations = () => {
  // 게시글 - 사진 관계
  Post.hasMany(Photo, { foreignKey: "post_id", as: "postPhotos" });
  Photo.belongsTo(Post, { foreignKey: "post_id", as: "post" });

  // ✅ 이메일 인증 - 사용자 관계 (email을 외래키로 사용)
  User.hasOne(EmailVerification, { foreignKey: "email", sourceKey: "email" });
  EmailVerification.belongsTo(User, { foreignKey: "email", targetKey: "email" });
};

export default defineAssociations;