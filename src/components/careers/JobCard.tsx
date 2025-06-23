// import { Button } from '../UI/button';

// interface Job {
//     title: string;
//     location: string;
//     department: string;
//     applyLink: string;
// }
// const JobCard = ({ job }: { job: Job }) => {
//     return (
//         <div className='flex flex-col bg-[--card-background] border border-[--card-border] rounded-xl p-6 shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] transition-all duration-300 hover:scale-[1.03]'>
//             <a href={job.applyLink}>
//                 <span className=' inset-0 absolute z-0'></span>
//                 <h3 className='text-lg font-semibold'>{job.title}</h3>
//             </a>
//             <p>Location: {job.location}</p>
//             <p>Department: {job.department}</p>

//             <Button variant={'link'}>Apply Now</Button>
//         </div>
//     );
// };
// export default JobCard;

import React, { useState, useEffect } from 'react';
import { X, MapPin, Building, Users, Code, Calendar, Briefcase } from 'lucide-react';

interface Job {
    jobCode: string;
    jobRoles: string;
    jobLocation: string;
    companyName: string;
    skills: string;
    vacancies: number;
    status: string;
    // Add any other fields your API returns
    description?: string;
    salary?: string;
    experience?: string;
    jobType?: string;
    postedDate?: string;
}

interface JobPopupProps {
    jobCode: string;
    isOpen: boolean;
    onClose: () => void;
}

const JobPopup: React.FC<JobPopupProps> = ({ jobCode, isOpen, onClose }) => {
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch job details when popup opens
    useEffect(() => {
        if (isOpen && jobCode) {
            fetchJobDetails();
        }
    }, [isOpen, jobCode]);

    const fetchJobDetails = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`http://192.168.1.221:8090/api/jobs/code/${jobCode}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const jobData = await response.json();
            setJob(jobData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch job details');
            console.error('Error fetching job details:', err);
        } finally {
            setLoading(false);
        }
    };

    // Get status badge color
    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'active':
            case 'open':
                return 'bg-green-100 text-green-800';
            case 'closed':
                return 'bg-red-100 text-red-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Handle backdrop click
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">Job Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {loading && (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-3 text-gray-600">Loading job details...</span>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                            <p className="text-red-800">Error: {error}</p>
                            <button 
                                onClick={fetchJobDetails}
                                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {job && !loading && (
                        <div className="space-y-6">
                            {/* Job Title and Status */}
                            <div>
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-2xl font-bold text-gray-900">{job.jobCode}</h3>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
                                        {job.status}
                                    </span>
                                </div>
                                
                                <div className="flex items-center text-gray-600 mb-2">
                                    <Briefcase className="w-4 h-4 mr-2" />
                                    <span className="font-medium">Job ID: {job.jobRoles}</span>
                                </div>
                            </div>

                            {/* Job Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center text-gray-700">
                                    <Building className="w-5 h-5 mr-3 text-blue-600" />
                                    <div>
                                        <p className="text-sm text-gray-500">Company</p>
                                        <p className="font-medium">{job.companyName}</p>
                                    </div>
                                </div>

                                <div className="flex items-center text-gray-700">
                                    <MapPin className="w-5 h-5 mr-3 text-red-600" />
                                    <div>
                                        <p className="text-sm text-gray-500">Location</p>
                                        <p className="font-medium">{job.jobLocation}</p>
                                    </div>
                                </div>

                                <div className="flex items-center text-gray-700">
                                    <Users className="w-5 h-5 mr-3 text-green-600" />
                                    <div>
                                        <p className="text-sm text-gray-500">Vacancies</p>
                                        <p className="font-medium">{job.vacancies} {job.vacancies === 1 ? 'position' : 'positions'}</p>
                                    </div>
                                </div>

                                {job.jobType && (
                                    <div className="flex items-center text-gray-700">
                                        <Briefcase className="w-5 h-5 mr-3 text-purple-600" />
                                        <div>
                                            <p className="text-sm text-gray-500">Job Type</p>
                                            <p className="font-medium">{job.jobType}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Skills Section */}
                            {job.skills && (
                                <div>
                                    <div className="flex items-center mb-3">
                                        <Code className="w-5 h-5 mr-2 text-orange-600" />
                                        <h4 className="text-lg font-semibold text-gray-900">Required Skills</h4>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-gray-700 leading-relaxed">{job.skills}</p>
                                    </div>
                                </div>
                            )}

                            {/* Description Section */}
                            {job.description && (
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h4>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-gray-700 leading-relaxed">{job.description}</p>
                                    </div>
                                </div>
                            )}

                            {/* Additional Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {job.salary && (
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <p className="text-sm text-blue-600 font-medium">Salary</p>
                                        <p className="text-blue-900 font-semibold">{job.salary}</p>
                                    </div>
                                )}

                                {job.experience && (
                                    <div className="bg-green-50 rounded-lg p-4">
                                        <p className="text-sm text-green-600 font-medium">Experience Required</p>
                                        <p className="text-green-900 font-semibold">{job.experience}</p>
                                    </div>
                                )}
                            </div>

                            {/* Apply Button */}
                            <div className="pt-4 border-t">
                                <button
                                    className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                                        job.status.toLowerCase() === 'active' || job.status.toLowerCase() === 'open'
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                    disabled={job.status.toLowerCase() !== 'active' && job.status.toLowerCase() !== 'open'}
                                    onClick={() => {
                                        if (job.status.toLowerCase() === 'active' || job.status.toLowerCase() === 'open') {
                                            // Handle apply logic here
                                            window.open(`/apply/${job.jobCode}`, '_blank');
                                        }
                                    }}
                                >
                                    {job.status.toLowerCase() === 'active' || job.status.toLowerCase() === 'open' 
                                        ? 'Apply Now' 
                                        : 'Position Not Available'
                                    }
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Demo component to show how to use the popup
const JobCardWithPopup: React.FC = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedJobCode, setSelectedJobCode] = useState('');

    const handleViewDetails = (jobCode: string) => {
        setSelectedJobCode(jobCode);
        setIsPopupOpen(true);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Job Listings</h1>
            
            {/* Example job cards */}
            <div className="grid gap-4 mb-8">
                <div className="bg-white border rounded-lg p-4 shadow-sm">
                    <h3 className="font-semibold mb-2">Software Developer</h3>
                    <p className="text-gray-600 mb-3">Job Code: JOB202506201000</p>
                    <button
                        onClick={() => handleViewDetails('JOB202506201000')}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        View Details
                    </button>
                </div>
                
                <div className="bg-white border rounded-lg p-4 shadow-sm">
                    <h3 className="font-semibold mb-2">Data Analyst</h3>
                    <p className="text-gray-600 mb-3">Job Code: JOB202506201001</p>
                    <button
                        onClick={() => handleViewDetails('JOB202506201001')}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        View Details
                    </button>
                </div>
            </div>

            {/* Popup */}
            <JobPopup
                jobCode={selectedJobCode}
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
            />
        </div>
    );
};

export default JobCardWithPopup;