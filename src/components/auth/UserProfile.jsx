import React, { useState, useEffect } from "react";
import { updateUserAttributes, fetchUserAttributes } from "aws-amplify/auth";
import { useAuth } from "../../context/AuthContext";

const UserProfile = () => {
  const { user, checkUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [attributes, setAttributes] = useState({
    email: "",
    name: "",
    phone_number: "",
  });

  useEffect(() => {
    loadUserAttributes();
  }, []);

  const loadUserAttributes = async () => {
    try {
      const userAttributes = await fetchUserAttributes();
      setAttributes({
        email: userAttributes.email || "",
        name: userAttributes.name || "",
        phone_number: userAttributes.phone_number || "",
      });
    } catch (error) {
      setError("Failed to load user attributes");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setUpdating(true);

    try {
      await updateUserAttributes({
        userAttributes: {
          name: attributes.name,
          phone_number: attributes.phone_number,
        },
      });
      await checkUser(); // Refresh user context
      setSuccess("Profile updated successfully!");
    } catch (error) {
      setError(error.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">User Profile</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={attributes.email}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
          />
          <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={attributes.name}
            onChange={(e) =>
              setAttributes({ ...attributes, name: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={attributes.phone_number}
            onChange={(e) =>
              setAttributes({ ...attributes, phone_number: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="+1234567890"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={updating}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md disabled:opacity-50"
          >
            {updating ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
