import React from 'react';
import LogoutButton from '../../small-components/LogoutButton';
import Card from '../../components/Card';
import { useNavigate } from 'react-router-dom';
import HomeButton from '../../small-components/HomeButton';
import { SiSemanticrelease } from 'react-icons/si';
import { TbLockOpen } from "react-icons/tb";

const QualityControlPage = () => {
	const navigate = useNavigate();
	return (
		<div>
			<div className='flex items-center justify-between h-12 px-4 bg-black'>
				<HomeButton />
				<h4 className='text-2xl font-semibold text-white'>Quality Control</h4>
				<LogoutButton />
			</div>
			<div className='h-screen p-4 bg-gray-100'>
				<div className='flex flex-wrap'>
					<Card
						title='QC Approve'
						onClick={() => navigate('/qcr')}
						icon={<SiSemanticrelease size={30} color='green' />}
					/>
					<Card
						title='QC Release'
						onClick={() => navigate('/bqr')}
						icon={<TbLockOpen   size={30} color='green' />}
					/>
					<Card
						title='Unrestricted Stock'
						onClick={() => navigate('/unrestrictedStock')}
						icon={<TbLockOpen   size={30} color='green' />}
					/>
				</div>
			</div>
		</div>
	);
};

export default QualityControlPage;
