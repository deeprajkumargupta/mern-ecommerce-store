import React from "react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const {user, loading}= useAuth();

  if(loading){
    return <p className="text-center mt-10">Loading...</p>
  }

  if(!user){
    return <p className="text-center mt-10 text-red-500">Not authorized</p>
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-background shadow-lg rounded-2xl p-8 w-full max-w-md space-y-4">
        <h2 className="text-2xl font-semibold text-center">Profile</h2>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Username</p>
          <p className="font-medium text-lg">{user.username}</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Email</p>
          <p className="font-medium text-lg">{user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
