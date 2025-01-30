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
    const formData = new FormData();
    formData.append('name', updatedData.name);
    formData.append('address', updatedData.address);
    formData.append('memo', updatedData.memo);

    // 📸 **대표 사진 처리**
    if (updatedData.photo_url instanceof File) {
      formData.append('trip', updatedData.photo_url);
    } else {
      formData.append('photo_url', updatedData.photo_url);
    }

    // 🖼 **추가 사진 처리**
    updatedData.additionalPhotos.forEach((photo, index) => {
      if (photo.file instanceof File) {
        formData.append('additionalPhotos', photo.file);
      } else {
        formData.append(`additionalPhotos[${index}]`, photo.photo_url);
      }
    });

    console.log('📸 전송할 FormData:', [...formData.entries()]);

    const response = await axiosInstance.put(`${api_url}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  } catch (error) {
    console.error(
      '🔴 여행지 수정 오류:',
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
