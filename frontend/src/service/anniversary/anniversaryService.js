import axiosInstance from '../axiosInstance';

const api_url = '/anniversaries';

export const createAnniversary = async (data) => {
  try {
    const response = await axiosInstance.post(api_url, data);
    return response.data;
  } catch (err) {
    console.error('Error creating anniversary', err);
    throw err;
  }
};

export const getAnniversariesByDateRange = async (startDate, endDate) => {
  try {
    const response = await axiosInstance.get(api_url, {
      params: { startDate, endDate },
    });
    return response.data;
  } catch (err) {
    console.error('Error fetching anniversaries', err);
    throw err;
  }
};

export const updateAnniversary = async (id, name, description) => {
  try {
    const response = await axiosInstance.put(`${api_url}/${id}`, {
      name,
      description,
    });

    console.log('📡 백엔드 응답:', response); // ✅ 응답 전체 출력
    console.log('📡 백엔드 응답 data:', response.data); // ✅ `data`가 있는지 확인

    return response.data.data;
  } catch (err) {
    console.error('Error updating anniversary: ', err);
    throw err;
  }
};

export const deleteAnniversary = async (id) => {
  try {
    const response = await axiosInstance.delete(`${api_url}/${id}`);
    return response.data;
  } catch (err) {
    console.error('Error delete anniversary', err);
    throw err;
  }
};
