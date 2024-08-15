import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { toast, ToastContainer } from 'react-toastify';
import { API_BASE_URL } from '../../apiConfig';
import * as Yup from 'yup';
import Spinner from '../../components/Spinner';
import { useNavigate } from 'react-router-dom';
import { storage } from '../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAxiosInterceptor } from '../../axios/useAxiosInterceptor';
import Cookies from 'js-cookie';
import LocationModal from '../../components/organizer/LocationModal';
import { LatLng } from 'leaflet';


interface FormValues {
    eventHallName: string;
    phoneNumber: string;
    state: string;
    district: string;
    city: string;
    buildingFloor: string;
    pincode: string;
    ownerIdCard: File | null;
    eventHallLicense: File | null;
}

const districtsOfKerala = [
    "Thiruvananthapuram",
    "Kollam",
    "Pathanamthitta",
    "Alappuzha",
    "Kottayam",
    "Idukki",
    "Ernakulam",
    "Thrissur",
    "Palakkad",
    "Malappuram",
    "Wayanad",
    "Kozhikode",
    "Kannur",
    "Kasargod"
];

const districtsToCities: { [key: string]: string[] } = {
    "Thiruvananthapuram": ["Thiruvananthapuram City", "Nedumangad", "Vattiyoorkavu"],
    "Kollam": ["Kollam City", "Paravur", "Karunagappally"],
    "Pathanamthitta": ["Pathanamthitta City", "Kumbanadu", "Ranni"],
    "Alappuzha": ["Alappuzha City", "Cherthala", "Mavelikkara"],
    "Kottayam": ["Kottayam City", "Changanassery", "Pala"],
    "Idukki": ["Idukki Town", "Munnar", "Thodupuzha"],
    "Ernakulam": ["Kochi", "North Paravur", "Angamaly"],
    "Thrissur": ["Thrissur City", "Kodungallur", "Irinjalakuda"],
    "Palakkad": ["Palakkad City", "Ottappalam", "Mannarkkad"],
    "Malappuram": ["Malappuram City", "Perinthalmanna", "Tirur"],
    "Wayanad": ["Kalpetta", "Mananthavady", "Sultan Bathery"],
    "Kozhikode": ["Kozhikode City", "Vadakara", "Kunnamangalam"],
    "Kannur": ["Kannur City", "Thalassery", "Payyannur"],
    "Kasargod": ["Kasargod City", "Kanjangad", "Puttur"],
};

const CreateProfile: React.FC = () => {
    const navigate = useNavigate();
    const axiosInstance = useAxiosInterceptor();
    const [cities, setCities] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [showLocationModal, setShowLocationModal] = useState(false);

    const initialValues: FormValues = {
        eventHallName: '',
        phoneNumber: '',
        state: 'Kerala', // currently I am implementing data for only Kerala
        district: '',
        city: '',
        buildingFloor: '',
        pincode: '',
        ownerIdCard: null,
        eventHallLicense: null,
    };

    const validationSchema = Yup.object().shape({
        eventHallName: Yup.string().required('Event Hall Name is required'),
        phoneNumber: Yup.string().required('Phone Number is required'),
        state: Yup.string().required('State is required'),
        district: Yup.string().required('District is required'),
        city: Yup.string().required('City is required'),
        buildingFloor: Yup.string().required('Building/Floor is required'),
        pincode: Yup.string().required('Pincode is required'),
        ownerIdCard: Yup.mixed()
            .required('Owner ID Card is required')
            .test('fileType', 'Unsupported File Format', value => {
                return value && value instanceof File;
            }),
        eventHallLicense: Yup.mixed()
            .required('Event Hall License is required')
            .test('fileType', 'Unsupported File Format', value => {
                return value && value instanceof File;
            }),
    });


    const handleSubmit = async (values: FormValues, { setSubmitting }: any) => {
        setLoading(true);
        let ownerIdCardUrl: string | null = null;
        let eventHallLicenseUrl: string | null = null;

        try {
            if (values.ownerIdCard) {
                const ownerIdCardRef = ref(storage, `ownerIdCards/${values.ownerIdCard.name}`);
                await uploadBytes(ownerIdCardRef, values.ownerIdCard);
                ownerIdCardUrl = await getDownloadURL(ownerIdCardRef);
                console.log(ownerIdCardUrl, 'ownercardurl')
            }

            if (values.eventHallLicense) {
                const eventHallLicenseRef = ref(storage, `eventHallLicenses/${values.eventHallLicense.name}`);
                await uploadBytes(eventHallLicenseRef, values.eventHallLicense);
                eventHallLicenseUrl = await getDownloadURL(eventHallLicenseRef);
                console.log(eventHallLicenseUrl, 'event hall license url')
            }

            const profileData = {
                eventHallName: values.eventHallName,
                phoneNumber: values.phoneNumber,
                district: values.district,
                city: values.city,
                buildingFloor: values.buildingFloor,
                pincode: values.pincode,
                ownerIdCardUrl: ownerIdCardUrl,
                eventHallLicenseUrl: eventHallLicenseUrl
            };

            const organizerToken = Cookies.get('OrganizerAccessToken');

            const response = await axiosInstance.post(`${API_BASE_URL}/organizer/create-profile`, profileData, {
                headers: {
                    'Authorization': `Bearer ${organizerToken}`,
                },
            });

            toast.success('Profile created successfully!', { position: "top-center" });
            setSubmitting(false);

            setShowLocationModal(true);
        } catch (error: any) {
            console.error('Error creating profile:', error);
            toast.error('Failed to create profile. Please try again.', { position: "top-center" });
            setSubmitting(false);
        } finally {
            setLoading(false);
        }
    };

    const handleLocationSave = async (location: LatLng) => {
        try {

            const organizerId = Cookies.get('OrganizerId');

            const locationData = {
                lat: location.lat,
                lng: location.lng,
                organizerId
            };
            console.log(locationData, 'location data')

            await axiosInstance.post('/organizer/savelocation', locationData);
            console.log('Location saved:', location);
            toast.success('Location saved successfully!');
            navigate('/organizer/home');
        } catch (error) {
            console.error('Error saving location:', error);
            toast.error('Failed to save location. Please try again.');
        }
    };

    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>, setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void) => {
        const selectedDistrict = e.target.value;
        setFieldValue('district', selectedDistrict);
        const citiesForSelectedDistrict = districtsToCities[selectedDistrict];
        setCities(citiesForSelectedDistrict || []);
        setFieldValue('city', '');
    };

    return (
        <section className="bg-white pt-20">
            <ToastContainer />
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <Link to="/organizer/home" className="flex items-center mb-6 text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-teal-900">
                    Venue-Vista
                </Link>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8 ">
                        <h1 className="text-xl leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
                            Create Event Hall Profile
                        </h1>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting, setFieldValue, values }) => (
                                <Form className="space-y-4 md:space-y-6">
                                    <div>
                                        <label htmlFor="eventHallName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Event Hall Name</label>
                                        <Field
                                            type="text"
                                            name="eventHallName"
                                            id="eventHallName"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="Event Hall Name"
                                        />
                                        <ErrorMessage name="eventHallName" component="div" className="text-red-500 text-sm" />
                                    </div>
                                    <div className='flex space-x-5'>
                                        <div>
                                            <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone Number</label>
                                            <Field
                                                type="text"
                                                name="phoneNumber"
                                                id="phoneNumber"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder="Phone Number"
                                            />
                                            <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-sm" />
                                        </div>
                                        <div>
                                            <label htmlFor="state" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">State</label>
                                            <Field
                                                type="text"
                                                name="state"
                                                id="state"
                                                value={values.state}
                                                disabled
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder="State"
                                            />
                                            <ErrorMessage name="state" component="div" className="text-red-500 text-sm" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="district" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">District</label>
                                            <Field
                                                as="select"
                                                name="district"
                                                id="district"
                                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleDistrictChange(e, setFieldValue)}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            >
                                                <option value="" label="Select a district" />
                                                {districtsOfKerala.map((district) => (
                                                    <option key={district} value={district} label={district} />
                                                ))}
                                            </Field>
                                            <ErrorMessage name="district" component="div" className="text-red-500 text-sm" />
                                        </div>
                                        <div>
                                            <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">City</label>
                                            <Field
                                                as="select"
                                                name="city"
                                                id="city"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            >
                                                <option value="" label="Select a city" />
                                                {cities.map((city) => (
                                                    <option key={city} value={city} label={city} />
                                                ))}
                                            </Field>
                                            <ErrorMessage name="city" component="div" className="text-red-500 text-sm" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="buildingFloor" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Building/Floor</label>
                                            <Field
                                                type="text"
                                                name="buildingFloor"
                                                id="buildingFloor"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder="Building/Floor"
                                            />
                                            <ErrorMessage name="buildingFloor" component="div" className="text-red-500 text-sm" />
                                        </div>
                                        <div>
                                            <label htmlFor="pincode" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Pincode</label>
                                            <Field
                                                type="text"
                                                name="pincode"
                                                id="pincode"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder="Pincode"
                                            />
                                            <ErrorMessage name="pincode" component="div" className="text-red-500 text-sm" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="ownerIdCard" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Owner ID Card</label>
                                            <input
                                                type="file"
                                                name="ownerIdCard"
                                                id="ownerIdCard"
                                                onChange={(event) => {
                                                    setFieldValue('ownerIdCard', event.currentTarget.files ? event.currentTarget.files[0] : null);
                                                }}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            />
                                            <ErrorMessage name="ownerIdCard" component="div" className="text-red-500 text-sm" />
                                        </div>
                                        <div>
                                            <label htmlFor="eventHallLicense" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Event Hall License</label>
                                            <input
                                                type="file"
                                                name="eventHallLicense"
                                                id="eventHallLicense"
                                                onChange={(event) => {
                                                    setFieldValue('eventHallLicense', event.currentTarget.files ? event.currentTarget.files[0] : null);
                                                }}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            />
                                            <ErrorMessage name="eventHallLicense" component="div" className="text-red-500 text-sm" />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <button
                                            type="submit"
                                            className="text-white bg-blue-500 hover:bg-blue-700 transition-colors duration-300 ease-in-out focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 flex items-center justify-center"
                                            disabled={isSubmitting}
                                        >
                                            {loading ? (
                                                <Spinner size="sm" width="20px" height="20px" /> // Adjust size if needed
                                            ) : (
                                                'Create Profile'
                                            )}
                                        </button>
                                    </div>



                                    <LocationModal
                                        isOpen={showLocationModal}
                                        onClose={() => setShowLocationModal(false)}
                                        onSave={handleLocationSave}
                                    />
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CreateProfile;
