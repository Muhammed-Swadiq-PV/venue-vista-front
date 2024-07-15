// src/pages/user/validations/OtpSchema.ts
import * as Yup from 'yup';

const OtpSchema = Yup.object().shape({
  otp: Yup.string()
    .length(6, 'OTP must be exactly 6 digits')
    .matches(/^[0-9]+$/, 'OTP must be a number')
    .required('OTP is required'),
});

export default OtpSchema;
