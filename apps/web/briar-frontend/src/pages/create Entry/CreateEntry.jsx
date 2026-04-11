import React from 'react';
import ServiceInput from './ServiceInput';
import LogoutButton from '../../small-components/LogoutButton';
import HomeButton from '../../small-components/HomeButton';

const CreateEntry = () => {
	return (
		<div className='overflow-x-hidden'>
			<div className='h-12 bg-[#71a311] items-center flex justify-between px-1 sm:px-4'>
				<HomeButton />
				<h1 className='text-white text-md sm:text-2xl font-semibold '>
					Create Maintenance Entry
				</h1>
				<LogoutButton />
			</div>
			<div className='bg-gray-50 h-screen w-full p-6 sm:px-16 2xl:px-[10%] pt-10 2xl:pt-20 space-y-6'>
				<div className=''>
					<div className='bg-white shadow-[#b4ed47] rounded-2xl p-10 shadow-2xl'>
						<ServiceInput />
					</div>
				</div>
			</div>
		</div>
	);
};

export default CreateEntry;
