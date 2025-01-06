import React, { createContext, useState } from 'react';

// Create UserContext
export const UserContext = createContext();

// UserProvider component that will wrap the app
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Default user state is null

  return (
    <UserContext.Provider value={{ user, setUser }}> {/* Provide context values */}
      {children}
    </UserContext.Provider>
  );
};
