import React from "react";
import { Route } from "react-router-dom";
import EmailStep from "../pages/Auth/EmailStep.js";
import VerificationStep from "../pages/Auth/VerificationStep.js";
import PasswordStep from "../pages/Auth/PasswordStep.js";

const SignUpRoutes = [
    <Route key="email" path="email" element={<EmailStep />} />,
    <Route key="verify" path="verify" element={<VerificationStep />} />,
    <Route key="password" path="password" element={<PasswordStep />} />
];

export default SignUpRoutes;