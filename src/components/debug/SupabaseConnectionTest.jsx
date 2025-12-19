import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';

const SupabaseConnectionTest = () => {
    const [status, setStatus] = useState('TESTING');
    const [message, setMessage] = useState('Connecting to Supabase...');
    const [dataCount, setDataCount] = useState(0);

    useEffect(() => {
        const testConnection = async () => {
            try {
                const { data, error } = await supabase.from('events').select('count', { count: 'exact', head: true });

                if (error) {
                    setStatus('ERROR');
                    setMessage(error.message);
                } else {
                    setStatus('SUCCESS');
                    setMessage(`Connected! Found ${data === null ? '0' : 'some'} events.`);
                    setDataCount(data?.length || 0); // Note: head:true returns null data but count is in wrapper, mostly for just connection test
                }
            } catch (err) {
                setStatus('CRITICAL');
                setMessage(err.message);
            }
        };

        testConnection();
    }, []);

    if (status === 'SUCCESS') return null; // Hide if works perfectly

    return (
        <div className={`p-4 mb-4 rounded-lg border ${status === 'ERROR' || status === 'CRITICAL' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
            <h3 className="font-bold">Database Connection Status: {status}</h3>
            <p className="text-sm font-mono mt-1">{message}</p>
        </div>
    );
};

export default SupabaseConnectionTest;
