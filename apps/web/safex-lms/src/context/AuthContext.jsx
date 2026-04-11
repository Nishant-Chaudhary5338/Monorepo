// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

const DEV_MOCK_USER = {
  uid: "dev-bypass-uid",
  email: "nidhi@safex.com",
  displayName: "Nidhi",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(DEV_MOCK_USER);
  const [loading, setLoading] = useState(false);
  const auth = getAuth();

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null); //
    } catch (error) {
      console.log(error);
    }
  };

  const value = {
    user,
    setUser, // Provide setUser function
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
