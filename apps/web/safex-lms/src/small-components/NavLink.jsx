import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavLink = ({ to, label, icon }) => {
	const location = useLocation();

	const isActive = (path) => {
		return location.pathname === path;
	};

	const linkStyle = {
		color: isActive(to) ? 'white' : 'black',
		backgroundColor: isActive(to) ? 'bg-green-500' : 'transparent',
	};

	return (
		<div
			className={`flex items-center hover:bg-green-500 rounded-sm px-4 py-2 space-x-2 w-48 ${linkStyle.backgroundColor}`}
		>
			<span className={isActive(to) ? 'text-white' : 'text-black'}>{icon}</span>
			<Link
				className={`text-gray-300 font-medium text-xs  rounded-md`}
				to={to}
				style={{ color: linkStyle.color }}
			>
				{label}
			</Link>
		</div>
	);
};

export default NavLink;
