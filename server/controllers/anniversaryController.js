import { Op } from 'sequelize';
import Anniversary from '../models/anniversaryModel.js';

export const createAnniversary = async (req, res) => {
  try {
    const { name, anniversaryDate, description } = req.body;
    const userId = req.user.id;

    if (!userId || !name || !anniversaryDate) {
      return res.status(400).json({ message: '필수 데이터가 누락되었습니다' });
    }

    const newAnniversary = await Anniversary.create({
      user_id: userId,
      name,
      anniversary_date: anniversaryDate,
      description,
    });

    res.status(201).json({
      message: '기념일이 성공적으로 추가되었습니다',
      date: newAnniversary,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: '기념일 추가 중 오류가 발생했습니다.',
      error: err.message,
    });
  }
};

export const getAnniversariesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.user.id; // ✅ 현재 로그인한 사용자 ID 가져오기

    if (!startDate || !endDate) {
      return res.status(400).json({ message: '날짜 범위를 입력해 주세요' });
    }

    const anniversaries = await Anniversary.findAll({
      where: {
        user_id: userId, // 현재 로그인한 사용자의 기념일만 가져오기

        anniversary_date: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    console.log('📡 DB에서 가져온 데이터:', anniversaries); // ✅ DB 데이터 확인

    res.status(200).json(anniversaries);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: '기념일 조회 중 오류가 발생했습니다.',
      error: err.message,
    });
  }
};

export const updateAnniversary = async (req, res) => {
  const { id } = req.params;
  const { name, anniversaryDate, description } = req.body;
  const userId = req.user.id; // 로그인한 사용자 ID 가져오기

  try {
    const anniversary = await Anniversary.findOne({
      where: {
        id,
        user_id: userId, // ✅ 로그인한 사용자의 기념일만 수정 가능
      },
    });

    anniversary.name = name || anniversary.name;
    anniversary.anniversary_date =
      anniversaryDate || anniversary.anniversary_date;
    anniversary.description = description || anniversary.description;

    await anniversary.save();

    console.log('📡 업데이트된 데이터:', anniversary); // ✅ 응답 확인

    res.status(200).json({
      message: '기념일이 성공적으로 수정되었습니다',
      data: anniversary,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: '기념일 수정 중 오류가 발생했습니다.',
      error: err.message,
    });
  }
};

export const deleteAnniversary = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // ✅ 로그인한 사용자 ID 가져오기

  try {
    const anniversary = await Anniversary.findOne({
      where: {
        id,
        user_id: userId, // ✅ 로그인한 사용자의 기념일만 삭제 가능
      },
    });

    if (!anniversary) {
      return res.status(404).json({ message: '기념일을 찾을 수 없습니다' });
    }

    await anniversary.destroy();
    res.status(200).json({ message: '기념일이 성공적으로 삭제되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: '기념일 삭제 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
};
