import * as Yup from 'yup';

const nonEmptyString = Yup.string().trim().test(
  'nonEmptyString',
  'This field cannot be empty or contain only spaces',
  (value) => value !== ''
);

const SignupSchema = Yup.object().shape({
  ownerName: nonEmptyString.required('Owner name is required'),
  email: Yup.string().trim().email('Invalid email').required('Email is required'),
  phoneNumber: nonEmptyString.required('Phone number is required'),
  password: nonEmptyString.required('Password is required'),
  confirmPassword: Yup.string()
    .trim()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Required'),
  eventHallName: nonEmptyString.required('Event hall name is required'),
  state: nonEmptyString.required('State is required'),
  district: nonEmptyString.required('District is required'),
  city: nonEmptyString.required('City is required'),
  buildingFloor: nonEmptyString.required('Building/Floor is required'),
  pincode: nonEmptyString.required('Pincode is required'),
  ownerIdCard: nonEmptyString.required('Owner ID Card is required'),
  eventHallLicence: nonEmptyString.required('Event Hall Licence is required'),
});

export default SignupSchema;
