import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getIDDetails, uploadIDDetails } from "../APIs/IDCardAPI";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const EmployeeIDForm = () => {
  const { uuid } = useParams();
  const [details, setDetails] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      const data = await getIDDetails(uuid);
      setDetails(data);
    };

    fetchDetails();
  }, [uuid]);

  // Validation rules
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value || value.trim().length === 0) {
          return 'Full name is required';
        }
        if (value.trim().length < 2) {
          return 'Name must be at least 2 characters long';
        }
        if (!/^[a-zA-Z\s.'-]+$/.test(value)) {
          return 'Name can only contain letters, spaces, dots, apostrophes, and hyphens';
        }
        if (value.trim().length > 100) {
          return 'Name cannot exceed 100 characters';
        }
        return '';

      case 'bloodGroup':
        if (!value) {
          return 'Blood group is required';
        }
        if (!bloodGroups.includes(value)) {
          return 'Please select a valid blood group';
        }
        return '';

      case 'gender':
        if (!value) {
          return 'Gender is required';
        }
        if (!['Male', 'Female', 'Other'].includes(value)) {
          return 'Please select a valid gender';
        }
        return '';

      case 'dob':
        if (!value) {
          return 'Date of birth is required';
        }
        const today = new Date();
        const birthDate = new Date(value);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (birthDate > today) {
          return 'Date of birth cannot be in the future';
        }
        if (age < 18 || (age === 18 && monthDiff < 0)) {
          return 'Employee must be at least 18 years old';
        }
        if (age > 65) {
          return 'Please verify the date of birth (age cannot exceed 65)';
        }
        return '';

      case 'address':
        if (!value || value.trim().length === 0) {
          return 'Address is required';
        }
        if (value.trim().length < 10) {
          return 'Please provide a complete address (minimum 10 characters)';
        }
        if (value.trim().length > 500) {
          return 'Address cannot exceed 500 characters';
        }
        return '';

      case 'emergencyContact':
        if (!value || value.trim().length === 0) {
          return 'Emergency contact is required';
        }
        if (!/^\+?[\d\s\-\(\)]{10,15}$/.test(value.replace(/\s/g, ''))) {
          return 'Please provide a valid phone number (10-15 digits)';
        }
        return '';

      case 'designation':
        if (!value || value.trim().length === 0) {
          return 'Designation is required';
        }
        if (value.trim().length < 2) {
          return 'Designation must be at least 2 characters long';
        }
        if (value.trim().length > 100) {
          return 'Designation cannot exceed 100 characters';
        }
        return '';

      case 'photo':
        if (!value && !photoPreview) {
          return 'Profile photo is required';
        }
        if (value && value instanceof File) {
          const maxSize = 5 * 1024 * 1024; // 5MB
          if (value.size > maxSize) {
            return 'Photo size cannot exceed 5MB';
          }
          const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
          if (!allowedTypes.includes(value.type)) {
            return 'Only JPG, PNG, and GIF files are allowed';
          }
        }
        return '';

      default:
        return '';
    }
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['name', 'bloodGroup', 'gender', 'dob', 'address', 'emergencyContact', 'designation', 'photo'];
    
    requiredFields.forEach(field => {
      const error = validateField(field, details?.[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
    
    // Mark field as touched
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate field and update errors
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const error = validateField('photo', file);
      
      if (error) {
        setErrors(prev => ({ ...prev, photo: error }));
        setTouched(prev => ({ ...prev, photo: true }));
        return;
      }

      setPhotoPreview(URL.createObjectURL(file));
      setDetails((prev) => ({ ...prev, photo: file }));
      setErrors(prev => ({ ...prev, photo: '' }));
      setTouched(prev => ({ ...prev, photo: true }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const formErrors = validateForm();
    setErrors(formErrors);
    
    // Mark all fields as touched to show validation errors
    const allFields = ['name', 'bloodGroup', 'gender', 'dob', 'address', 'emergencyContact', 'designation', 'photo'];
    const allTouched = {};
    allFields.forEach(field => {
      allTouched[field] = true;
    });
    setTouched(allTouched);

    // Check if there are any errors
    if (Object.keys(formErrors).length > 0) {
      // Scroll to first error
      const firstErrorField = Object.keys(formErrors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`) || document.querySelector(`input[type="file"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log("Form submitted:", details);
      
      await uploadIDDetails({ uuid, data: details });

      setShowSuccessModal(true);
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      // You could add an error modal or toast notification here
      alert('There was an error submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowSuccessModal(false);
  };

  // Helper function to get input classes based on validation state
  const getInputClasses = (fieldName, baseClasses) => {
    const hasError = errors[fieldName] && touched[fieldName];
    const isValid = !errors[fieldName] && touched[fieldName] && details?.[fieldName];
    
    let classes = baseClasses;
    
    if (hasError) {
      classes += ' border-red-500 focus:border-red-500';
    } else if (isValid) {
      classes += ' border-green-500 focus:border-green-500';
    } else {
      classes += ' border-black/20 focus:border-black';
    }
    
    return classes;
  };

  // Error message component
  const ErrorMessage = ({ fieldName }) => {
    if (!errors[fieldName] || !touched[fieldName]) return null;
    
    return (
      <p className="mt-1 text-sm text-red-600 font-medium">
        {errors[fieldName]}
      </p>
    );
  };

  // Success indicator component
  const SuccessIndicator = ({ fieldName }) => {
    if (errors[fieldName] || !touched[fieldName] || !details?.[fieldName]) return null;
    
    return (
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
    );
  };

  if (!details) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          <p className="mt-4 text-black font-medium">Loading employee details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-1 bg-black mx-auto mb-6"></div>
          <h1 className="text-4xl font-bold text-black mb-2">Employee Registration for ID Cards</h1>
          <p className="text-black/60 text-lg">Please complete all required information</p>
        </div>

        {/* Form Container */}
        <div className="bg-white border-2 border-black/10 rounded-none shadow-lg">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information Section */}
              <div>
                <h2 className="text-xl font-semibold text-black mb-6 pb-2 border-b border-black/10">
                  Personal Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="md:col-span-2 relative">
                    <label className="block text-sm font-semibold text-black mb-2 uppercase tracking-wide">
                      Full Name *
                      <span className="text-xs font-normal text-black/50 ml-2 normal-case">(as per Aadhaar)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={details.name || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={getInputClasses('name', "w-full border-2 rounded-none p-4 text-black font-medium focus:outline-none transition-colors bg-white pr-12")}
                        placeholder="Enter full name"
                      />
                      <SuccessIndicator fieldName="name" />
                    </div>
                    <ErrorMessage fieldName="name" />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2 uppercase tracking-wide">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={details.phone || ''}
                      readOnly
                      className="w-full border-2 border-black/10 rounded-none p-4 text-black/50 bg-black/5 font-medium cursor-not-allowed"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2 uppercase tracking-wide">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={details.email || ''}
                      readOnly
                      className="w-full border-2 border-black/10 rounded-none p-4 text-black/50 bg-black/5 font-medium cursor-not-allowed"
                    />
                  </div>

                  {/* Employee ID */}
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2 uppercase tracking-wide">
                      Employee ID
                    </label>
                    <input
                      type="text"
                      value={details.employeeId || ''}
                      readOnly
                      className="w-full border-2 border-black/10 rounded-none p-4 text-black/50 bg-black/5 font-medium cursor-not-allowed"
                    />
                  </div>

                  {/* Blood Group */}
                  <div className="relative">
                    <label className="block text-sm font-semibold text-black mb-2 uppercase tracking-wide">
                      Blood Group *
                    </label>
                    <div className="relative">
                      <select
                        name="bloodGroup"
                        value={details.bloodGroup || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={getInputClasses('bloodGroup', "w-full border-2 rounded-none p-4 text-black font-medium focus:outline-none transition-colors bg-white pr-12")}
                      >
                        <option value="" className="text-black/50">Select Blood Group</option>
                        {bloodGroups.map((group) => (
                          <option key={group} value={group} className="text-black">
                            {group}
                          </option>
                        ))}
                      </select>
                      <SuccessIndicator fieldName="bloodGroup" />
                    </div>
                    <ErrorMessage fieldName="bloodGroup" />
                  </div>

                  {/* Gender */}
                  <div className="relative">
                    <label className="block text-sm font-semibold text-black mb-2 uppercase tracking-wide">
                      Gender *
                    </label>
                    <div className="relative">
                      <select
                        name="gender"
                        value={details.gender || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={getInputClasses('gender', "w-full border-2 rounded-none p-4 text-black font-medium focus:outline-none transition-colors bg-white pr-12")}
                      >
                        <option value="" className="text-black/50">Select Gender</option>
                        <option value="Male" className="text-black">Male</option>
                        <option value="Female" className="text-black">Female</option>
                        <option value="Other" className="text-black">Other</option>
                      </select>
                      <SuccessIndicator fieldName="gender" />
                    </div>
                    <ErrorMessage fieldName="gender" />
                  </div>

                  {/* DOB */}
                  <div className="relative">
                    <label className="block text-sm font-semibold text-black mb-2 uppercase tracking-wide">
                      Date of Birth *
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="dob"
                        value={details.dob || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={getInputClasses('dob', "w-full border-2 rounded-none p-4 text-black font-medium focus:outline-none transition-colors bg-white pr-12")}
                      />
                      <SuccessIndicator fieldName="dob" />
                    </div>
                    <ErrorMessage fieldName="dob" />
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div>
                <h2 className="text-xl font-semibold text-black mb-6 pb-2 border-b border-black/10">
                  Contact & Address Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Address */}
                  <div className="md:col-span-2 relative">
                    <label className="block text-sm font-semibold text-black mb-2 uppercase tracking-wide">
                      Full Address *
                    </label>
                    <textarea
                      name="address"
                      value={details.address || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      rows="4"
                      className={getInputClasses('address', "w-full border-2 rounded-none p-4 text-black font-medium focus:outline-none transition-colors bg-white resize-none")}
                      placeholder="Enter complete address"
                    />
                    <ErrorMessage fieldName="address" />
                  </div>

                  {/* Emergency Contact */}
                  <div className="relative">
                    <label className="block text-sm font-semibold text-black mb-2 uppercase tracking-wide">
                      Emergency Contact *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="emergencyContact"
                        value={details.emergencyContact || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={getInputClasses('emergencyContact', "w-full border-2 rounded-none p-4 text-black font-medium focus:outline-none transition-colors bg-white pr-12")}
                        placeholder="Emergency contact number"
                      />
                      <SuccessIndicator fieldName="emergencyContact" />
                    </div>
                    <ErrorMessage fieldName="emergencyContact" />
                  </div>

                  {/* Designation */}
                  <div className="relative">
                    <label className="block text-sm font-semibold text-black mb-2 uppercase tracking-wide">
                      Designation *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="designation"
                        value={details.designation || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={getInputClasses('designation', "w-full border-2 rounded-none p-4 text-black font-medium focus:outline-none transition-colors bg-white pr-12")}
                        placeholder="Job title/designation"
                      />
                      <SuccessIndicator fieldName="designation" />
                    </div>
                    <ErrorMessage fieldName="designation" />
                  </div>
                </div>
              </div>

              {/* Photo Upload Section */}
              <div>
                <h2 className="text-xl font-semibold text-black mb-6 pb-2 border-b border-black/10">
                  Profile Photo
                </h2>
                
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-black mb-2 uppercase tracking-wide">
                      Upload Photo *
                    </label>
                    <div className={`border-2 border-dashed p-6 text-center transition-colors ${
                      errors.photo && touched.photo 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-black/20 hover:border-black/40'
                    }`}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full text-sm text-black file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-black/90 cursor-pointer"
                      />
                      <p className="mt-2 text-xs text-black/50 uppercase tracking-wide">
                        JPG, PNG or GIF (MAX. 5MB)
                      </p>
                    </div>
                    <ErrorMessage fieldName="photo" />
                  </div>

                  {photoPreview && (
                    <div className="flex-shrink-0">
                      <p className="text-sm font-semibold text-black mb-2 uppercase tracking-wide">
                        Preview
                      </p>
                      <div className="w-32 h-32 border-2 border-black/20">
                        <img
                          src={photoPreview}
                          alt="Profile Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-8 border-t border-black/10">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white py-4 px-8 font-semibold uppercase tracking-wide hover:bg-black/90 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Employee Information'}
                </button>
                
                {/* Required fields note */}
                <p className="mt-3 text-center text-sm text-black/60">
                  Fields marked with * are required
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-black/40 text-sm">
            Please ensure all information is accurate before submitting
          </p>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-black max-w-md w-full relative">
            {/* Modal Header */}
            <div className="border-b border-black/20 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-black uppercase tracking-wide">
                  Submission Successful
                </h3>
                <button
                  onClick={closeModal}
                  className="text-black hover:text-black/70 text-2xl font-bold leading-none"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 border-4 border-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-black mb-2">Data Submitted Successfully!</h4>
                <p className="text-black/60">
                  Your employee information has been submitted and is being processed.
                </p>
              </div>

              {/* Submitted Data Summary */}
              <div className="bg-black/5 border border-black/10 p-4 mb-6">
                <h5 className="font-semibold text-black mb-3 text-sm uppercase tracking-wide">Submitted Information:</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-black/60">Name:</span>
                    <span className="text-black font-medium">{details?.name || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/60">Employee ID:</span>
                    <span className="text-black font-medium">{details?.employeeId || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/60">Designation:</span>
                    <span className="text-black font-medium">{details?.designation || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/60">Blood Group:</span>
                    <span className="text-black font-medium">{details?.bloodGroup || 'Not provided'}</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-xs text-black/50 mb-4">
                  Reference ID: EMP-{Date.now().toString().slice(-6)}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-black/20 p-6">
              <button
                onClick={closeModal}
                className="w-full bg-black text-white py-3 px-6 font-semibold uppercase tracking-wide hover:bg-black/90 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeIDForm;