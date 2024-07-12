import * as Yup from 'yup';

const OtpSchema = Yup.object().shape({
    email: Yup.string()
    .email('Invalid email address')
    .required('Required'),
password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Required'),
});

export default OtpSchema;