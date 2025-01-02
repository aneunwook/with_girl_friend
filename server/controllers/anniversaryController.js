import Anniversary from "../models/anniversaryModel.js";

export const createAnniversary = async(req, res) => {
    try{
        const {userId, name, anniversaryDate, description} = req.body;

        if(!userId || !name || !anniversaryDate){
            return res.status(400).json({message: '필수 데이터가 누락되었습니다'})
        }

        const newAnniversary = await Anniversary.create({
            user_id: userId,
            name,
            anniversary_date: anniversaryDate,
            description,
        })

        res.status(201).json({message: '기념일이 성공적으로 추가되었습니다', date: newAnniversary});

    }catch(err){
        console.error(err);
        res.status(500).json({message: '기념일 추가 중 오류가 발생했습니다.', error: err.message});
    }
}