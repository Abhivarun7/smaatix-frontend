const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const getIDDetails = async (id) => {
  try {
    const response = await fetch(`${backendUrl}/api/employees/basic/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("❌ Error fetching employee basic details:", error);
    throw error;
  }
};
export const uploadIDDetails = async ({ data }) => {
  try {
    const formData = new FormData();

    // Append all form fields
    formData.append("name", data.name);
    formData.append("employeeId", data.employeeId);
    formData.append("phone", data.phone);
    formData.append("address", data.address);
    formData.append("emergencyContact", data.emergencyContact);
    formData.append("bloodGroup", data.bloodGroup);
    formData.append("dob", data.dob);
    formData.append("email", data.email);
    formData.append("gender", data.gender);
    formData.append("designation", data.designation);

    // Important: append the image file with key 'photo'
    if (data.photo instanceof File) {
      formData.append("photo", data.photo); // key MUST match multer.single('photo')
    }

    const response = await fetch(`${backendUrl}/api/employees/full/${data.employeeId}`, {
      method: "PUT",
      body: formData, // Don't set Content-Type header manually!
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("❌ Error uploading employee full details:", error);
    throw error;
  }
};
