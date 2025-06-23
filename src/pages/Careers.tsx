// import React, { useState, useEffect, useRef, useMemo } from 'react';
// import ScrollToTop from '../components/UI/scrollToTop';
// import HeroSection from '../components/careers/HeroSection';
// import JobListings from '../components/careers/JobListing';
// import JobSearch from '../components/careers/JobSearch';
// import LifeAtCompany from '../components/careers/LifeAtCompany';

// interface Job {
//     title: string;
//     location: string;
//     department: string;
//     applyLink: string;
// }

// const Careers = () => {
//     const [jobs, setJobs] = useState<Job[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [location, setLocation] = useState('');
//     const [department, setDepartment] = useState('');

//     const originalJobs = useRef<Job[]>([]);

//     const [page, setPage] = useState(1); // If you want pagination

//     useEffect(() => {
//         const fetchJobs = async () => {
//             try {
//                 const response = await fetch(`http://localhost:8080/api/jobs?page=${page}`);
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }

//                 const data = await response.json();
//                 setJobs(data.jobs);  // Ensure this matches your backend response format
//                 originalJobs.current = data.jobs;
//                 setLoading(false);
//             } catch (err) {
//                 console.error('Error fetching jobs:', err);
//                 setError('Failed to fetch jobs. Please try again later.');
//                 setLoading(false);
//             }
//         };

//         fetchJobs();
//     }, [page]);

//     const filteredJobs = useMemo(() => {
//         const lowerSearchTerm = searchTerm.toLowerCase();
//         const lowerLocation = location.toLowerCase();
//         const lowerDepartment = department.toLowerCase();

//         return jobs.filter(
//             (job) =>
//                 job.title.toLowerCase().includes(lowerSearchTerm) &&
//                 (!location || job.location.toLowerCase() === lowerLocation) &&
//                 (!department ||
//                     job.department.toLowerCase() === lowerDepartment)
//         );
//     }, [jobs, searchTerm, location, department]);

//     const handleSearch = (
//         searchTerm: string,
//         location: string,
//         department: string
//     ) => {
//         setSearchTerm(searchTerm);
//         setLocation(location);
//         setDepartment(department);
//     };

//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>{error}</div>;

//     return (
//         <main className='bg-gradient-to-br from-purple-50/80 via-background to-pink-50/80 dark:from-slate-900 dark:via-slate-800/50 dark:to-purple-950/60'>
//             <HeroSection />

//             <section id='job-listings'>
//                 <JobListings
//                     jobs={filteredJobs}
//                     onSearch={handleSearch}
//                 />
//             </section>
//             {/* <LifeAtCompany /> */}
//             <ScrollToTop />
//         </main>
//     );
// };

// export default Careers;



import React, { useState, useEffect, useRef, useMemo } from 'react';
import ScrollToTop from '../components/UI/scrollToTop';
import HeroSection from '../components/careers/HeroSection';
import JobListings from '../components/careers/JobListing';
import JobSearch from '../components/careers/JobSearch';
import LifeAtCompany from '../components/careers/LifeAtCompany';

interface Job {
    jobCode: string;
    jobRoles: string;
    jobLocation: string;
    companyName: string;
    skills: string;
    vacancies: number;
    status: string;
}

interface JobsApiResponse {
    jobs: Job[];
    hasMore: boolean;
    totalResults: number;
    from: number;
    to: number;
}

const Careers = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [location, setLocation] = useState('');
    const [department, setDepartment] = useState('');

    const originalJobs = useRef<Job[]>([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                const response = await fetch(`https://smaatixbackend.clinimode.com/api/jobs?page=${page}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: JobsApiResponse = await response.json();
                
                // Only show jobs with active status
                const activeJobs = data.jobs.filter(job => 
                    job.status.toLowerCase() === 'active' || job.status.toLowerCase() === 'open'
                );
                
                setJobs(activeJobs);
                originalJobs.current = activeJobs;
                setLoading(false);
            } catch (err) {
                console.error('Error fetching jobs:', err);
                setError('Failed to fetch jobs. Please try again later.');
                setLoading(false);
            }
        };

        fetchJobs();
    }, [page]);

    // Get unique locations and departments for filter options
    const uniqueLocations = useMemo(() => {
        const locations = Array.from(new Set(originalJobs.current.map(job => job.jobLocation)));
        return locations.filter(Boolean); // Remove empty values
    }, [originalJobs.current]);

    const uniqueDepartments = useMemo(() => {
        // Extract departments from jobRoles or create categories
        const departments = Array.from(new Set(originalJobs.current.map(job => {
            // You might want to categorize based on jobRoles or create a mapping
            const role = job.jobRoles.toLowerCase();
            if (role.includes('engineer') || role.includes('developer') || role.includes('tech')) {
                return 'Engineering';
            } else if (role.includes('market') || role.includes('sales')) {
                return 'Marketing';
            } else if (role.includes('hr') || role.includes('human')) {
                return 'HR';
            } else if (role.includes('design')) {
                return 'Design';
            } else if (role.includes('finance') || role.includes('account')) {
                return 'Finance';
            }
            return 'Other';
        })));
        return departments.filter(Boolean);
    }, [originalJobs.current]);

    const filteredJobs = useMemo(() => {
        if (!searchTerm && !location && !department) {
            return jobs;
        }

        const lowerSearchTerm = searchTerm.toLowerCase();
        
        return jobs.filter((job) => {
            const matchesSearch = !searchTerm || 
                job.jobRoles.toLowerCase().includes(lowerSearchTerm) ||
                job.skills.toLowerCase().includes(lowerSearchTerm) ||
                job.companyName.toLowerCase().includes(lowerSearchTerm);

            const matchesLocation = !location || 
                location === 'all' || 
                job.jobLocation.toLowerCase().includes(location.toLowerCase());

            // Map department filter to job roles
            let matchesDepartment = true;
            if (department && department !== 'all') {
                const role = job.jobRoles.toLowerCase();
                switch (department.toLowerCase()) {
                    case 'engineering':
                        matchesDepartment = role.includes('engineer') || role.includes('developer') || role.includes('tech');
                        break;
                    case 'marketing':
                        matchesDepartment = role.includes('market') || role.includes('sales');
                        break;
                    case 'hr':
                        matchesDepartment = role.includes('hr') || role.includes('human');
                        break;
                    case 'design':
                        matchesDepartment = role.includes('design');
                        break;
                    case 'finance':
                        matchesDepartment = role.includes('finance') || role.includes('account');
                        break;
                    default:
                        matchesDepartment = true;
                }
            }

            return matchesSearch && matchesLocation && matchesDepartment;
        });
    }, [jobs, searchTerm, location, department]);

    const handleSearch = (
        searchTerm: string,
        location: string,
        department: string
    ) => {
        setSearchTerm(searchTerm);
        setLocation(location);
        setDepartment(department);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                    <p className="text-gray-600">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className='bg-gradient-to-br from-purple-50/80 via-background to-pink-50/80 dark:from-slate-900 dark:via-slate-800/50 dark:to-purple-950/60'>
            <HeroSection />

            <section id='job-listings'>
                <JobListings
                    jobs={filteredJobs}
                    onSearch={handleSearch}
                    uniqueLocations={uniqueLocations}
                    uniqueDepartments={uniqueDepartments}
                />
            </section>
            {/* <LifeAtCompany /> */}
            <ScrollToTop />
        </main>
    );
};

export default Careers;