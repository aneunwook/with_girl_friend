import axiosInstance from '../axiosInstance';

const api_url = '/trips';

export const uploadTripPhoto = async (formData) => {
  try {
    const response = await axiosInstance.post(
      `${api_url}/tripPhoto`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      'Error uploading photos:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const addTrip = async (tripData) => {
  try {
    const response = await axiosInstance.post(`${api_url}/add`, tripData);
    return response.data;
  } catch (error) {
    console.error('Error adding trip:', error.response?.data || error.message);
    throw error;
  }
};

export const getAllTrips = async () => {
  try {
    const response = await axiosInstance.get(`${api_url}`);
    console.log('Response:', response); // 응답 전체 확인

    return response.data;
  } catch (error) {
    console.error('여행지 목록 로딩 중 오류: ', error);
    throw error;
  }
};

export const getTripDetails = async (id) => {
  try {
    const response = await axiosInstance.get(`${api_url}/${id}`);
    console.log('API URL:', `${api_url}/${id}`);

    return response.data;
  } catch (error) {
    console.error(
      'Error fetching trip details:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateTrip = async (id, updatedData) => {
  try {
    const response = await axiosInstance.put(`${api_url}/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error(
      'Error updating trip:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteTrip = async (id) => {
  try {
    const response = await axiosInstance.delete(`${api_url}/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      'Error deleting trip:',
      error.response?.data || error.message
    );
    throw error;
  }
};
