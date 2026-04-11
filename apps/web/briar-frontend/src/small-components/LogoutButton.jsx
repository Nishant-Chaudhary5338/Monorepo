import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdLogout } from 'react-icons/md';
import { useMsal } from '@azure/msal-react';
import { BrowserUtils } from '@azure/msal-browser';

const LogoutButton = () => {
	const navigate = useNavigate();
	const { instance } = useMsal();

	const handleLogoutClick = () => {
		localStorage.removeItem('access_token');
		localStorage.removeItem('username');
		localStorage.removeItem('access_data');
		localStorage.removeItem('groupsData');

		navigate('/');
		instance.logoutRedirect({
			account: instance.getActiveAccount(),
			onRedirectNavigate: () => !BrowserUtils.isInIframe(),
		});
	};

	return (
		<div
			onClick={handleLogoutClick}
			className='flex items-center px-2 py-2 text-white space-x-1 text-xs font-semibold rounded-md shadow-md bg-red-500'
		>
			<span>LogOut</span>
			<span>
				{' '}
				<MdLogout color='white' />
			</span>
		</div>
	);
};

export default LogoutButton;

/*

import React, { useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { BrowserUtils } from "@azure/msal-browser";

export function Logout() {
    const { instance } = useMsal();

    useEffect(() => {
        instance.logoutRedirect({
            account: instance.getActiveAccount(),
            onRedirectNavigate: () => !BrowserUtils.isInIframe()
        })
    }, [ instance ]);

    return (
        <div>Logout</div>
    )
}

*/
