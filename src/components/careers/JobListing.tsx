// import React from 'react';
// import JobCard from './JobCard'; // Assuming this component is styled using the theme
// import JobSearch from './JobSearch';
// import { AlertCircle } from 'lucide-react';

// interface Job {
//     // id: string | number;
//     title: string;
//     location: string;
//     department: string;
//     applyLink: string;
// }

// interface JobListingsProps {
//     jobs: Job[];
//     onSearch: (
//         searchTerm?: string | undefined,
//         location?: string | undefined,
//         department?: string | undefined
//     ) => void;
// }

// const JobListings: React.FC<JobListingsProps> = ({ jobs, onSearch }) => {
//     return (
//         <section
//             id='job-listings'
//             className='relative w-full py-24 md:py-32'
//         >
//             <div className='container mx-auto px-6'>
//                 {/* Section Header - Apply theme colors and consistent styling */}
//                 <div className='text-center mb-5 animate-fadeInUp'>
//                     <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4'>
//                         Open Positions
//                     </h2>
//                     {/* Optional Divider */}
//                     <div className='w-20 h-px bg-border mx-auto mb-6'></div>
//                     <p className='max-w-xl mx-auto text-foreground-secondary'>
//                         Find your next career opportunity and grow with us.
//                     </p>
//                 </div>
                
//                 <JobSearch onSearch={onSearch} />
                
//                 {/* Job Listings Grid */}
//                 <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10'>
//                     {jobs && jobs.length > 0 ? (
//                         jobs.map((job, index) => (
//                             // Wrap JobCard for animation staggering
//                             <div
//                                 key={job.title + index}
//                                 className='animate-fadeInUp'
//                                 style={{
//                                     animationDelay: `${200 + index * 100}ms`,
//                                 }}
//                             >
//                                 <JobCard job={job} />
//                             </div>
//                         ))
//                     ) : (
//                         // Styled fallback message
//                         <div className='col-span-full text-center py-12 animate-fadeInUp'>
//                             <p className='text-lg text-foreground-secondary'>
//                                 There are currently no open positions available.
//                                 Please check back later.
//                             </p>
//                         </div>
//                     )}
//                 </div> 
                
//                 <div className="flex justify-center">
//                     <div className="bg-transparent border border-black dark:border-white rounded-lg p-4 my-4 shadow-sm max-w-xl w-full">
//                         <div className="flex items-start">
//                             <div className="w-full">
//                                 <h3 className="font-medium text-gray text-lg dark:text-white">Important Notice</h3>
//                                 <p className="text-white-700 mt-1">
//                                     We're currently in the process of uploading our job listings. For now, please use the
//                                     <span className="font-semibold"> "Apply for a job" </span>
//                                     button to submit your application as many positions may not yet be visible.
//                                 </p>
//                                 <div className="mt-3 text-center sm:text-left">
//                                     <a 
//                                         href="/Application-Form"
//                                         className="inline-block  bg-transparent border border-black hover:bg-blue-700 text-black font-medium py-2 px-4 rounded-md transition-colors dark:text-white dark:border-white dark:hover:bg-blue-700 dark:hover:text-white"
//                                     >
//                                         Apply for a job
//                                     </a>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default JobListings;



import React from 'react';
import JobCard from './JobCard';
import JobSearch from './JobSearch';
import { AlertCircle } from 'lucide-react';

interface Job {
    jobCode: string;
    jobRoles: string;
    jobLocation: string;
    companyName: string;
    skills: string;
    vacancies: number;
    status: string;
}

interface JobListingsProps {
    jobs: Job[];
    onSearch: (
        searchTerm?: string | undefined,
        location?: string | undefined,
        department?: string | undefined
    ) => void;
    uniqueLocations?: string[];
    uniqueDepartments?: string[];
}

const JobListings: React.FC<JobListingsProps> = ({ 
    jobs, 
    onSearch, 
    uniqueLocations = [], 
    uniqueDepartments = [] 
}) => {
    return (
        <section
            id='job-listings'
            className='relative w-full py-24 md:py-32'
        >
            <div className='container mx-auto px-6'>
                {/* Section Header - Apply theme colors and consistent styling */}
                <div className='text-center mb-5 animate-fadeInUp'>
                    <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4'>
                        Open Positions
                    </h2>
                    {/* Optional Divider */}
                    <div className='w-20 h-px bg-border mx-auto mb-6'></div>
                    <p className='max-w-xl mx-auto text-foreground-secondary'>
                        Find your next career opportunity and grow with us.
                    </p>
                </div>
                
                <JobSearch 
                    onSearch={onSearch} 
                    uniqueLocations={uniqueLocations}
                    uniqueDepartments={uniqueDepartments}
                />
                
                {/* Job Listings Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10'>
                    {jobs && jobs.length > 0 ? (
                        jobs.map((job, index) => (
                            // Wrap JobCard for animation staggering
                            <div
                                key={job.jobCode + index}
                                className='animate-fadeInUp'
                                style={{
                                    animationDelay: `${200 + index * 100}ms`,
                                }}
                            >
                                <JobCard job={job} />
                            </div>
                        ))
                    ) : (
                        // Styled fallback message
                        <div className='col-span-full text-center py-12 animate-fadeInUp'>
                            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className='text-lg text-foreground-secondary mb-2'>
                                No positions found matching your criteria.
                            </p>
                            <p className='text-sm text-foreground-secondary'>
                                Try adjusting your search filters or check back later for new opportunities.
                            </p>
                        </div>
                    )}
                </div> 
                
                {/* <div className="flex justify-center">
                    <div className="bg-transparent border border-black dark:border-white rounded-lg p-4 my-4 shadow-sm max-w-xl w-full">
                        <div className="flex items-start">
                            <div className="w-full">
                                <h3 className="font-medium text-gray text-lg dark:text-white">Important Notice</h3>
                                <p className="text-white-700 mt-1">
                                    We're currently in the process of uploading our job listings. For now, please use the
                                    <span className="font-semibold"> "Apply for a job" </span>
                                    button to submit your application as many positions may not yet be visible.
                                </p>
                                <div className="mt-3 text-center sm:text-left">
                                    <a 
                                        href="/Application-Form"
                                        className="inline-block  bg-transparent border border-black hover:bg-blue-700 text-black font-medium py-2 px-4 rounded-md transition-colors dark:text-white dark:border-white dark:hover:bg-blue-700 dark:hover:text-white"
                                    >
                                        Apply for a job
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </section>
    );
};

export default JobListings;