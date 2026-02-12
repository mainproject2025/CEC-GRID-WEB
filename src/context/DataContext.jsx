
import React, { createContext, useContext, useState, useCallback } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    // State for data
    const [halls, setHalls] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [exams, setExams] = useState([]);

    // Loading states
    const [loadingHalls, setLoadingHalls] = useState(false);
    const [loadingAdmins, setLoadingAdmins] = useState(false);
    const [loadingExams, setLoadingExams] = useState(false);

    // Errors
    const [errorHalls, setErrorHalls] = useState(null);
    const [errorAdmins, setErrorAdmins] = useState(null);
    const [errorExams, setErrorExams] = useState(null);

    // Timestamps for caching (optional validity check)
    const [hallsTimestamp, setHallsTimestamp] = useState(0);
    const [adminsTimestamp, setAdminsTimestamp] = useState(0);
    const [examsTimestamp, setExamsTimestamp] = useState(0);

    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    // --- Halls ---
    const fetchHalls = useCallback(async (force = false) => {
        const now = Date.now();
        if (!force && halls.length > 0 && (now - hallsTimestamp < CACHE_DURATION)) {
            return; // Return cached data
        }

        setLoadingHalls(true);
        setErrorHalls(null);
        try {
            const res = await fetch("http://localhost:5001/halls");
            const data = await res.json();
            setHalls(data.data || []);
            setHallsTimestamp(now);
        } catch (err) {
            console.error("Failed to fetch halls", err);
            setErrorHalls(err.message);
        } finally {
            setLoadingHalls(false);
        }
    }, [halls.length, hallsTimestamp]);

    // --- Admins ---
    const fetchAdmins = useCallback(async (force = false) => {
        const now = Date.now();
        if (!force && admins.length > 0 && (now - adminsTimestamp < CACHE_DURATION)) {
            return;
        }

        setLoadingAdmins(true);
        setErrorAdmins(null);
        try {
            const token = localStorage.getItem("cecgrid-token");
            const response = await fetch("http://localhost:5001/auth/admins", {
                headers: {
                    "Authorization": token ? `Bearer ${token}` : "",
                }
            });
            if (!response.ok) throw new Error("Failed to fetch admins");

            const data = await response.json();
            if (data && Array.isArray(data.admins)) {
                setAdmins(data.admins);
            } else if (Array.isArray(data)) {
                setAdmins(data);
            } else {
                setAdmins([]);
            }
            setAdminsTimestamp(now);
        } catch (err) {
            console.error("Error fetching admins:", err);
            setErrorAdmins(err.message);
        } finally {
            setLoadingAdmins(false);
        }
    }, [admins.length, adminsTimestamp]);

    // --- Exams ---
    const fetchExams = useCallback(async (force = false) => {
        const now = Date.now();
        if (!force && exams.length > 0 && (now - examsTimestamp < CACHE_DURATION)) {
            return;
        }

        setLoadingExams(true);
        setErrorExams(null);
        try {
            // AbortController logic omitted for simplicity in global context, 
            // but could be added if needed.
            const res = await fetch("http://localhost:5001/FetchExamDetails");
            if (!res.ok) throw new Error("Failed to fetch exams");
            const data = await res.json();
            setExams(data.exams || []);
            setExamsTimestamp(now);
        } catch (err) {
            console.error(err);
            setErrorExams(err.message);
        } finally {
            setLoadingExams(false);
        }
    }, [exams.length, examsTimestamp]);


    const value = {
        halls,
        loadingHalls,
        errorHalls,
        fetchHalls,
        setHalls, // Exposed for optimistic updates

        admins,
        loadingAdmins,
        errorAdmins,
        fetchAdmins,
        setAdmins,

        exams,
        loadingExams,
        errorExams,
        fetchExams,
        setExams
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
