import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isSupabaseConfigured) {
            setLoading(false);
            return;
        }

        // Safety fallback so UI is never stuck in loading
        const timer = setTimeout(() => {
            setLoading(false);
        }, 4000);

        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            clearTimeout(timer);
            if (session?.user) {
                fetchProfile(session.user);
            } else {
                setLoading(false);
            }
        }).catch((err) => {
            console.error("Auth session error:", err);
            clearTimeout(timer);
            setLoading(false);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                fetchProfile(session.user);
            } else {
                setCurrentUser(null);
                setLoading(false);
            }
        });

        return () => {
            clearTimeout(timer);
            subscription?.unsubscribe?.();
        };
    }, []);

    const fetchProfile = async (user) => {
        try {
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            let orgId = profile?.organization_id;

            // Fallback: If no profile or no orgId, find or create the default organization
            if (!orgId) {
                console.log("No Organization ID found. Searching default...");
                // 1. Try to find any org
                const { data: orgData } = await supabase
                    .from('organizations')
                    .select('id')
                    .limit(1)
                    .single();

                if (orgData) {
                    orgId = orgData.id;
                    console.log("Found existing default organization:", orgId);
                } else {
                    // 2. Create one if none exists (Auto-provisioning)
                    console.log("No organizations found. Creating default...");
                    const { data: newOrg, error: createError } = await supabase
                        .from('organizations')
                        .insert([{ name: 'My First Organization', plan: 'free', code: 'DEMO02' }])
                        .select()
                        .single();

                    if (newOrg) {
                        orgId = newOrg.id;
                        console.log("Created new default organization:", orgId);
                    } else if (createError) {
                        console.error("Failed to create default organization:", createError);
                    }
                }

                // FIX: Update the profile with this orgId so it persists
                if (orgId) {
                    await supabase
                        .from('profiles')
                        .update({ organization_id: orgId })
                        .eq('id', user.id);
                }
            }

            if (error || !profile) {
                console.warn("Profile issue, using constructed user object:", error?.message);
                const role = user.email?.includes('owner') ? 'owner' :
                    user.email?.includes('lead') ? 'lead' : 'worker';

                setCurrentUser({
                    ...user,
                    role,
                    name: user.email?.split('@')[0] || 'User',
                    phone: user.user_metadata?.phone, // Try metadata fallback
                    organizationId: orgId
                });
            } else {
                setCurrentUser({
                    ...user,
                    role: profile.role,
                    name: profile.full_name || user.email?.split('@')[0],
                    phone: profile.phone, // [FIX] Explicitly include phone from profile
                    organizationId: orgId
                });
            }
        } catch (err) {
            console.error("Auth Error:", err);
            // Emergency Fallback
            setCurrentUser({ ...user, role: 'worker', name: 'ErrorUser', organizationId: null });
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error("Login error:", error.message);
            return { success: false, error: error.message };
        }
        return { success: true, error: null };
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setCurrentUser(null);
    };

    const permissions = useMemo(() => {
        if (!currentUser) return {};
        const role = currentUser.role || 'worker';

        return {
            canCreateEvent: ['owner', 'lead'].includes(role),
            canViewBudget: ['owner', 'lead'].includes(role),
            canApprove: ['owner', 'lead'].includes(role),
            canManageWorkforce: ['owner', 'lead'].includes(role), // Leads can now manage/invite too
            canInvite: ['owner', 'lead'].includes(role), // New Permission
            canManageRoles: role === 'owner', // Only Owner can change roles
            isWorker: role === 'worker',
            isOwner: role === 'owner'
        };
    }, [currentUser]);

    const value = {
        currentUser,
        login,
        logout,
        permissions,
        loading,
        isSupabaseConfigured
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div className="flex min-h-screen items-center justify-center bg-gray-50">
                    <div className="flex flex-col items-center gap-3">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
                        <p className="text-sm font-medium text-gray-600">Loading EventFlow...</p>
                    </div>
                </div>
            ) : (
                children
            )}
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
