"use client"

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useForm } from "react-hook-form";

const UserProfileUpdate = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();

  const watchedImage = watch("image");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/user");
        setUser(response.data.data);
        reset(response.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [reset]);

  console.log(user)

  useEffect(() => {
    if (watchedImage && watchedImage[0]) {
      setImagePreview(URL.createObjectURL(watchedImage[0]));
    }
  }, [watchedImage]);

  const onSubmit = async (data) => {
    setUpdating(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'image' && data[key][0]) {
        formData.append(key, data[key][0]);
      } else if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });

    try {
      const response = await axios.put("/api/user", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser(response.data.data);
      setSuccess("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    reset(user);
    setImagePreview(null);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (!user) {
    return <div className="text-center mt-8 text-xl font-semibold">User not found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Update Profile</h1>
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <p className="font-bold">Success</p>
          <p>{success}</p>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-32 h-32 mb-4">
            <Image
              src={imagePreview ||user?.user.image}
              alt="Profile"
              layout="fill"
              objectFit="cover"
              className="rounded-full"
            />
            <input
              type="file"
              id="image"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              {...register("image")}
            />
          </div>
          <label htmlFor="image" className="cursor-pointer text-blue-500 hover:text-blue-600">
            Change Profile Picture
          </label>
        </div>
        <div>
          <label htmlFor="name" className="block mb-1 font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            className="w-full px-3 py-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="bio" className="block mb-1 font-medium text-gray-700">Bio</label>
          <textarea
            id="bio"
            className="w-full px-3 py-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            {...register("bio")}
          ></textarea>
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={updating}
          >
            {updating ? "Updating..." : "Update Profile"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfileUpdate;