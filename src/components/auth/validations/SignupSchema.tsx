import * as Yup from 'yup';

const nonEmptyString = Yup.string().trim().test(
  'nonEmptyString',
  'This field cannot be empty or contain only spaces',
  (value) => value !== ''
);

const SignupSchema = Yup.object().shape({
  name: nonEmptyString
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  email: Yup.string()
    .trim()
    .email('Invalid email')
    .required('Required'),
  password: nonEmptyString
    .min(6, 'Password too short!')
    .required('Required'),
  confirmPassword: Yup.string()
    .trim()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Required'),
});

export default SignupSchema;
