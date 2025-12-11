import React, { createContext, useContext, useState, useMemo } from 'react';
import { MOCK_DATA } from '../data/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(MOCK_DATA.currentUser);

    const permissions = useMemo(() => ({
        canCreateEvent: ['owner', 'lead'].includes(currentUser.role),
        canViewBudget: ['owner', 'lead'].includes(currentUser.role),
        canApprove: ['owner', 'lead'].includes(currentUser.role),
        canManageWorkforce: currentUser.role === 'owner',
        isWorker: currentUser.role === 'worker'
    }), [currentUser.role]);

    const value = {
        currentUser,
        setCurrentUser,
        permissions
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
