import sequelize from "../config/db.js";
import Couple from "../models/couples.js";
import User from "../models/userModel.js";
import { Op } from "sequelize"; // Sequelize에서 OR 조건을 사용하기 위해 Op 연산자 가져오기


export const registerCouple = async (req, res) =>{
    try{
        const user1_id = req.user.id; // 🔥 JWT에서 추출한 로그인한 사용자의 ID
        const { user2_email } = req.body;

        //상대방 이메일로 ID 찾기
        const user2 = await User.findOne({
            where : { email : user2_email},
            attributes : ["id"],
        })

        if (!user2) {
            return res.status(404).json({ message: "상대방을 찾을 수 없습니다." });
        }

        const user2_id = user2.id;

        if (user1_id === user2_id) {
            return res.status(400).json({ message: "자기 자신과는 커플 등록할 수 없습니다." });
        }

        // 이미 등록된 커플인지 확인
        const existingCouple = await Couple.findOne({
            where: {
                [Op.or]: [ // Op.or을 사용하면 두 가지 조건 중 하나라도 만족하면 조회됨
                    { user1_id, user2_id },
                    { user1_id: user2_id, user2_id: user1_id }
                ],
            },
        })

        if (existingCouple) {
            return res.status(400).json({ message: "이미 커플로 등록되어 있습니다." });
        }

        // 커플 등록
        const newCouple = await Couple.create({
            user1_id,
            user2_id,
        });

        res.json({message : "커플 등록 완료!", couple: newCouple});
    }catch(error){
        console.error("서버오류 :" , error);
        res.status(500).json({message : "서버오류"})
    }
}