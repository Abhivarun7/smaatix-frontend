import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getIDDetails, uploadIDDetails } from "../APIs/IDCardAPI";


const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const EmployeeIDForm = () => {
  const { uuid } = useParams();
  const [details, setDetails] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      const data = await getIDDetails(uuid);
      setDetails(data);
    };

    fetchDetails();
  }, [uuid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
      setDetails((prev) => ({ ...prev, photo: file }));
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    console.log("Form submitted:", details);
    
    await uploadIDDetails({ uuid, data: details });

    setShowSuccessModal(true); // show success message/modal
  } catch (error) {
    console.error("❌ Error submitting form:", error);
    // Optionally show error message to the user
  }
};
  const closeModal = () => {
    setShowSuccessModal(false);
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
            <div onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information Section */}
              <div>
                <h2 className="text-xl font-semibold text-black mb-6 pb-2 border-b border-black/10">
                  Personal Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-black mb-2 uppercase tracking-wide">
                      Full Name
                      <span className="text-xs font-normal text-black/50 ml-2 normal-case">(as per Aadhaar)</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={details.name}
                      onChange={handleChange}
                      className="w-full border-2 border-black/20 rounded-none p-4 text-black font-medium focus:border-black focus:outline-none transition-colors bg-white"
                      placeholder="Enter full name"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2 uppercase tracking-wide">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={details.phone}
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
                      value={details.email}
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
                      value={details.employeeId}
                      readOnly
                      className="w-full border-2 border-black/10 rounded-none p-4 text-black/50 bg-black/5 font-medium cursor-not-allowed"
                    />
                  </div>

                  {/* Blood Group */}
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2 uppercase tracking-wide">
                      Blood Group
                    </label>
                    <select
                      name="bloodGroup"
                      value={details.bloodGroup || ""}
                      onChange={handleChange}
                      className="w-full border-2 border-black/20 rounded-none p-4 text-black font-medium focus:border-black focus:outline-none transition-colors bg-white"
                    >
                      <option value="" className="text-black/50">Select Blood Group</option>
                      {bloodGroups.map((group) => (
                        <option key={group} value={group} className="text-black">
                          {group}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2 uppercase tracking-wide">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={details.gender || ""}
                      onChange={handleChange}
                      className="w-full border-2 border-black/20 rounded-none p-4 text-black font-medium focus:border-black focus:outline-none transition-colors bg-white"
                    >
                      <option value="" className="text-black/50">Select Gender</option>
                      <option value="Male" className="text-black">Male</option>
                      <option value="Female" className="text-black">Female</option>
                      <option value="Other" className="text-black">Other</option>
                    </select>
                  </div>

                  {/* DOB */}
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2 uppercase tracking-wide">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={details.dob || ""}
                      onChange={handleChange}
                      className="w-full border-2 border-black/20 rounded-none p-4 text-black font-medium focus:border-black focus:outline-none transition-colors bg-white"
                    />
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
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-black mb-2 uppercase tracking-wide">
                      Full Address
                    </label>
                    <textarea
                      name="address"
                      value={details.address || ""}
                      onChange={handleChange}
                      rows="4"
                      className="w-full border-2 border-black/20 rounded-none p-4 text-black font-medium focus:border-black focus:outline-none transition-colors bg-white resize-none"
                      placeholder="Enter complete address"
                    />
                  </div>

                  {/* Emergency Contact */}
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2 uppercase tracking-wide">
                      Emergency Contact
                    </label>
                    <input
                      type="text"
                      name="emergencyContact"
                      value={details.emergencyContact || ""}
                      onChange={handleChange}
                      className="w-full border-2 border-black/20 rounded-none p-4 text-black font-medium focus:border-black focus:outline-none transition-colors bg-white"
                      placeholder="Emergency contact number"
                    />
                  </div>

                  {/* Designation */}
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2 uppercase tracking-wide">
                      Designation
                    </label>
                    <input
                      type="text"
                      name="designation"
                      value={details.designation || ""}
                      onChange={handleChange}
                      className="w-full border-2 border-black/20 rounded-none p-4 text-black font-medium focus:border-black focus:outline-none transition-colors bg-white"
                      placeholder="Job title/designation"
                    />
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
                      Upload Photo
                    </label>
                    <div className="border-2 border-dashed border-black/20 p-6 text-center hover:border-black/40 transition-colors">
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
                  type="button"
                  onClick={handleSubmit}
                  className="w-full bg-black text-white py-4 px-8 font-semibold uppercase tracking-wide hover:bg-black/90 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                >
                  Submit Employee Information
                </button>
              </div>
            </div>
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