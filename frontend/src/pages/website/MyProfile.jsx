import { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const MyProfile = () => {
  const { userData, setUserData, BackendUrl, token, loadUserProfileData } =
    useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateUserProfileData = async () => {
    setLoading(true);

    try {
      let imageUrl = userData.image;

      if (image) {
        const cloudinaryData = new FormData();

        cloudinaryData.append("file", image);
        cloudinaryData.append(
          "upload_preset",
          import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
        );

        const cloudinaryResponse = await axios.post(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUDINARY_NAME
          }/image/upload`,
          cloudinaryData,
        );

        imageUrl = cloudinaryResponse.data.secure_url;
      }

      const profileData = {
        name: userData.name,
        phone: userData.phone,
        address: userData.address,
        gender: userData.gender,
        dob: userData.dob,
        image: imageUrl,
      };

      const { data } = await axios.post(
        BackendUrl + "/api/user/update-profile",
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (data.success) {
        toast.success(data.message || "Profile updated successfully");

        await loadUserProfileData();

        setIsEdit(false);
        setImage(null);
      } else {
        toast.error(data.message || "Failed to update profile");
        console.log("data message", data.message);
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update profile. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg flex flex-col gap-2 text-sm">
      <label htmlFor="profile-image">
        <img
          className={`w-36 rounded ${isEdit ? "cursor-pointer" : ""}`}
          src={
            image
              ? URL.createObjectURL(image)
              : userData?.image || assets.profile_pic
          }
          alt="Profile"
        />
      </label>

      {isEdit && (
        <input
          id="profile-image"
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setImage(e.target.files[0]);
            }
          }}
        />
      )}

      {isEdit ? (
        <input
          className="bg-gray-50 text-3xl font-medium max-w-60 mt-4"
          type="text"
          value={userData?.name || ""}
          onChange={(e) =>
            setUserData((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }
        />
      ) : (
        <p className="font-medium text-3xl text-neutral-800 mt-4">
          {userData?.name}
        </p>
      )}

      <hr className="bg-zinc-400 h-px border-none" />

      <div>
        <p className="text-neutral-500 underline mt-3">CONTACT INFORMATION</p>

        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Email id:</p>

          <p className="text-blue-500">{userData?.email}</p>

          <p className="font-medium">Phone:</p>

          {isEdit ? (
            <input
              className="bg-gray-100 max-w-52"
              type="text"
              value={userData?.phone || ""}
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  phone: e.target.value,
                }))
              }
            />
          ) : (
            <p className="text-blue-500">{userData?.phone}</p>
          )}

          <p className="font-medium">Address:</p>

          {isEdit ? (
            <div>
              <input
                className="bg-gray-50 border px-2 py-1"
                type="text"
                value={userData?.address?.line1 || ""}
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: {
                      ...prev.address,
                      line1: e.target.value,
                    },
                  }))
                }
              />

              <br />

              <input
                className="bg-gray-50 border px-2 py-1 mt-2"
                type="text"
                value={userData?.address?.line2 || ""}
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: {
                      ...prev.address,
                      line2: e.target.value,
                    },
                  }))
                }
              />
            </div>
          ) : (
            <p className="text-gray-500">
              {userData?.address?.line1}
              <br />
              {userData?.address?.line2}
            </p>
          )}
        </div>
      </div>

      <div>
        <p className="text-neutral-500 underline mt-3">BASIC INFORMATION</p>

        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Gender:</p>

          {isEdit ? (
            <select
              className="max-w-28 bg-gray-100"
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  gender: e.target.value,
                }))
              }
              value={userData?.gender || ""}
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p className="text-gray-400">{userData?.gender}</p>
          )}

          <p className="font-medium">Birthday:</p>

          {isEdit ? (
            <input
              type="date"
              className="max-w-32 bg-gray-100"
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  dob: e.target.value,
                }))
              }
              value={userData?.dob || ""}
            />
          ) : (
            <p className="text-gray-400">{userData?.dob}</p>
          )}
        </div>
      </div>

      <div className="mt-10">
        {isEdit ? (
          <button
            disabled={loading}
            className="border border-[#5f6FFF] px-8 py-2 rounded-full hover:bg-[#5f6FFF] hover:text-white transition-all disabled:opacity-50"
            onClick={updateUserProfileData}
          >
            {loading ? "Saving..." : "Save Information"}
          </button>
        ) : (
          <button
            className="border border-[#5f6FFF] px-8 py-2 rounded-full hover:bg-[#5f6FFF] hover:text-white transition-all"
            onClick={() => setIsEdit(true)}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
