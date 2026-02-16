'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/firebaseConfig';
import { supabase } from '@/supabaseClient';
import { useRouter } from 'next/navigation';
import Sidebar from './components/Sidebar';
import VenueDashboard from './components/VenueDashboard';
import EventPlannerDashboard from './components/EventPlannerDashboard';

const Dashboard = () => {
    const router = useRouter();
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUserRole = async () => {
            const currentUser = auth.currentUser;
            
            if (!currentUser) {
                router.push('/signIn');
                return;
            }

            setUser(currentUser);

            // Fetch user role from Supabase
            const { data } = await supabase
                .from('users')
                .select('role')
                .eq('firebase_uid', currentUser.uid)
                .single();

            if (data?.role) {
                setRole(data.role);
            } else {
                // If no role found, redirect to onboarding
                router.push('/getStarted');
            }

            setLoading(false);
        };

        fetchUserRole();
    }, [router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="text-4xl mb-4">⏳</div>
                    <p className="text-white text-lg">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen">
            <Sidebar role={role} />
            <div className="flex-1 flex flex-col overflow-hidden">
                {role === 'venue' && <VenueDashboard user={user} />}
                {role === 'event_planner' && <EventPlannerDashboard user={user} />}
                {!role && (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-white">No dashboard available for your role</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;