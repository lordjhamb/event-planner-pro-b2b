import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                // TEMPORARY: Derive role from email for MV1 until 'profiles' table exists
                const role = session.user.email.includes('owner') ? 'owner' :
                    session.user.email.includes('lead') ? 'lead' : 'worker';

                setCurrentUser({ ...session.user, role, name: session.user.email.split('@')[0] });
            }
            setLoading(false);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                const role = session.user.email.includes('owner') ? 'owner' :
                    session.user.email.includes('lead') ? 'lead' : 'worker';
                setCurrentUser({ ...session.user, role, name: session.user.email.split('@')[0] });
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error("Login error:", error.message);
            return false;
        }
        return true;
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setCurrentUser(null);
    };

    const permissions = useMemo(() => {
        if (!currentUser) return {};
        // Default to 'worker' if role is missing
        const role = currentUser.role || 'worker';

        return {
            canCreateEvent: ['owner', 'lead'].includes(role),
            canViewBudget: ['owner', 'lead'].includes(role),
            canApprove: ['owner', 'lead'].includes(role),
            canManageWorkforce: role === 'owner',
            isWorker: role === 'worker'
        };
    }, [currentUser]);

    const value = {
        currentUser,
        login,
        logout,
        permissions,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
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
