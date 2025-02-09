import { createContext, useState, useContext } from 'react';

const SignUpContext = createContext();

export const SignUpProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    verificationCode: '',
    startDate: '',
    isVerified: false,
  });

  return (
    <SignUpContext.Provider value={{ formData, setFormData }}>
      {children}
    </SignUpContext.Provider>
  );
};

export const useSignUp = () => useContext(SignUpContext);
