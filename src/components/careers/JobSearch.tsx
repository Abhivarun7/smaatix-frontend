// import React, { useState } from 'react';
// import { Input } from '../UI/input'; // Assuming styled via className
// import { Button } from '../UI/button'; // Assuming styled via className + variant
// import { FaSearch } from 'react-icons/fa'; // Icon for search button

// interface JobSearchProps {
//     onSearch: (
//         searchTerm: string,
//         location: string,
//         department: string
//     ) => void;
// }

// const JobSearch: React.FC<JobSearchProps> = ({ onSearch }) => {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [location, setLocation] = useState('');
//     const [department, setDepartment] = useState('');

//     const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
//         event.preventDefault();
//         onSearch(searchTerm, location, department);
//     };

//     // Define consistent vertical padding and text size for all elements
//     const verticalPadding = 'py-2.5'; // e.g., corresponds to h-10 or h-11 depending on border/font
//     const textSize = 'text-sm md:text-base';

//     // Base classes for inputs and selects
//     const formElementBaseClasses = `
//         w-full h-10 rounded-lg border border-[--color-border] bg-background
//         px-4 ${verticalPadding} ${textSize} text-foreground placeholder:text-foreground-secondary
//         focus:outline-none focus:ring-2 focus:ring-[--color-text-accent-start]
//         focus:ring-offset-1 focus:border-[--color-text-accent-start]
//         dark:focus:ring-offset-slate-900 transition-shadow
//     `;

//     // Select specific classes including custom arrow
//     const selectClasses = `
//         ${formElementBaseClasses}
//         pr-10 appearance-none bg-no-repeat
//         bg-[url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")]
//         dark:bg-[url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")]
//         bg-[position:right_0.75rem_center] bg-[size:1.25em]
//     `;

//     // Classes for the button to match the height
//     // Adjust px-* as needed for button width, py-* must match inputs/selects
//     const buttonClasses = `
//         w-full ${verticalPadding} px-6 ${textSize} /* Ensure vertical padding matches */
//         /* Add other button-specific styles if not covered by variant */
//         flex items-center justify-center /* Center icon and text */
//     `;

//     return (
//         <form
//             onSubmit={handleSearch}
//             className='w-full max-w-screen-lg mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 items-end gap-4 px-4 mb-10'
//         >
//             {/* Search Term Input */}
//             <div className='sm:col-span-2 md:col-span-1'>
//                 <label
//                     htmlFor='job-search-term'
//                     className='sr-only'
//                 >
//                     Search job titles or keywords
//                 </label>
//                 <Input
//                     type='text'
//                     id='job-search-term'
//                     placeholder='Search titles or keywords'
//                     className={formElementBaseClasses} // Use base classes
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//             </div>

//             {/* Location Select */}
//             <div>
//                 <label
//                     htmlFor='job-search-location'
//                     className='sr-only '
//                 >
//                     Location
//                 </label>
//                 <select
//                     id='job-search-location'
//                     className={`${selectClasses} h-10`}
//                     value={location}
//                     onChange={(e) => setLocation(e.target.value)}
//                 >
//                     <option
//                         value=''
//                         disabled
//                     >
//                         Location
//                     </option>
//                     <option value='all'>All Locations</option>
//                     <option value='remote'>Remote</option>
//                     <option value='new-york'>New York</option>
//                     <option value='san-francisco'>San Francisco</option>
//                 </select>
//             </div>

//             {/* Department Select */}
//             <div>
//                 <label
//                     htmlFor='job-search-department'
//                     className='sr-only'
//                 >
//                     Department
//                 </label>
//                 <select
//                     id='job-search-department'
//                     className={`${selectClasses} h-10`}
//                     value={department}
//                     onChange={(e) => setDepartment(e.target.value)}
//                 >
//                     <option
//                         value=''
//                         disabled
//                     >
//                         Department
//                     </option>
//                     <option value='all'>All Departments</option>
//                     <option value='engineering'>Engineering</option>
//                     <option value='marketing'>Marketing</option>
//                     <option value='hr'>HR</option>
//                 </select>
//             </div>

//             {/* Search Button */}
//             <div>
//                 <Button
//                     variant={'default'}
//                     // REMOVED size prop, using className for padding/height control
//                     type='submit'
//                     className={buttonClasses} // Apply button classes with matching padding
//                 >
//                     <FaSearch className='mr-2 h-4 w-4' />
//                     Search
//                 </Button>
//             </div>
//         </form>
//     );
// };
// export default JobSearch;


import React, { useState } from 'react';
import { Input } from '../UI/input';
import { Button } from '../UI/button';
import { FaSearch } from 'react-icons/fa';

interface JobSearchProps {
    onSearch: (
        searchTerm: string,
        location: string,
        department: string
    ) => void;
    uniqueLocations?: string[];
    uniqueDepartments?: string[];
}

const JobSearch: React.FC<JobSearchProps> = ({ 
    onSearch, 
    uniqueLocations = [], 
    uniqueDepartments = [] 
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [location, setLocation] = useState('');
    const [department, setDepartment] = useState('');

    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSearch(searchTerm, location, department);
    };

    const handleReset = () => {
        setSearchTerm('');
        setLocation('');
        setDepartment('');
        onSearch('', '', '');
    };

    // Define consistent vertical padding and text size for all elements
    const verticalPadding = 'py-2.5';
    const textSize = 'text-sm md:text-base';

    // Base classes for inputs and selects
    const formElementBaseClasses = `
        w-full h-10 rounded-lg border border-[--color-border] bg-background
        px-4 ${verticalPadding} ${textSize} text-foreground placeholder:text-foreground-secondary
        focus:outline-none focus:ring-2 focus:ring-[--color-text-accent-start]
        focus:ring-offset-1 focus:border-[--color-text-accent-start]
        dark:focus:ring-offset-slate-900 transition-shadow
    `;

    // Select specific classes including custom arrow
    const selectClasses = `
        ${formElementBaseClasses}
        pr-10 appearance-none bg-no-repeat
        bg-[url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")]
        dark:bg-[url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")]
        bg-[position:right_0.75rem_center] bg-[size:1.25em]
    `;

    // Classes for the button to match the height
    const buttonClasses = `
        w-full ${verticalPadding} px-6 ${textSize}
        flex items-center justify-center
    `;

    return (
        <div className="w-full max-w-screen-lg mx-auto mb-10">
            <form
                onSubmit={handleSearch}
                className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 items-end gap-4 px-4'
            >
                {/* Search Term Input */}
                <div className='sm:col-span-2 md:col-span-1'>
                    <label
                        htmlFor='job-search-term'
                        className='sr-only'
                    >
                        Search job titles or keywords
                    </label>
                    <Input
                        type='text'
                        id='job-search-term'
                        placeholder='Search roles, skills...'
                        className={formElementBaseClasses}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Location Select */}
                <div>
                    <label
                        htmlFor='job-search-location'
                        className='sr-only'
                    >
                        Location
                    </label>
                    <select
                        id='job-search-location'
                        className={`${selectClasses} h-10`}
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    >
                        <option value=''>All Locations</option>
                        <option value='all'>All Locations</option>
                        {uniqueLocations.map((loc) => (
                            <option key={loc} value={loc}>
                                {loc}
                            </option>
                        ))}
                        {/* Default options if no unique locations */}
                        {uniqueLocations.length === 0 && (
                            <>
                                <option value='remote'>Remote</option>
                                <option value='new-york'>New York</option>
                                <option value='san-francisco'>San Francisco</option>
                            </>
                        )}
                    </select>
                </div>

                {/* Department Select */}
                <div>
                    <label
                        htmlFor='job-search-department'
                        className='sr-only'
                    >
                        Department
                    </label>
                    <select
                        id='job-search-department'
                        className={`${selectClasses} h-10`}
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                    >
                        <option value=''>All Departments</option>
                        <option value='all'>All Departments</option>
                        {uniqueDepartments.map((dept) => (
                            <option key={dept} value={dept.toLowerCase()}>
                                {dept}
                            </option>
                        ))}
                        {/* Default options if no unique departments */}
                        {uniqueDepartments.length === 0 && (
                            <>
                                <option value='engineering'>Engineering</option>
                                <option value='marketing'>Marketing</option>
                                <option value='hr'>HR</option>
                                <option value='design'>Design</option>
                                <option value='finance'>Finance</option>
                            </>
                        )}
                    </select>
                </div>

                {/* Search Button */}
                <div>
                    <Button
                        variant={'default'}
                        type='submit'
                        className={buttonClasses}
                    >
                        <FaSearch className='mr-2 h-4 w-4' />
                        Search
                    </Button>
                </div>

                {/* Reset Button */}
                <div>
                    <Button
                        variant={'outline'}
                        type='button'
                        className={buttonClasses}
                        onClick={handleReset}
                    >
                        Reset
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default JobSearch;