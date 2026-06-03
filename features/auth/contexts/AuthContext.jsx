"use client"

import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext();

export const AuthProvider = ( { children} ) => {
    const [loggedUser, setLoggedUser] = useState({});

    const value = {
        loggedUser,
        setLoggedUser
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be within AuthProvider")
    }

    return context;
}