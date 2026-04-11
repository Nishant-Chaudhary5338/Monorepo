/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useContext, useEffect, useState } from 'react';
import { useMsal, useMsalAuthentication } from '@azure/msal-react';
import { InteractionType } from '@azure/msal-browser';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/login';
import axios from 'axios';
import { loginRequest } from './authConfig';
import { useGroupData } from '../context/groupData';

const AzureADAuth = () => {
	useMsalAuthentication(InteractionType.Redirect);
	const [m_strUser, setm_strUser] = useState('');
	const [username, setUsername] = useState('test');
	const [password, setPassword] = useState('Mohit@123#');
	const [accessDataReceived, setAccessDataReceived] = useState(false);
	const { instance, accounts } = useMsal();
	const navigate = useNavigate();
	const { setGroupData } = useGroupData();

	useEffect(() => {
		if (accounts.length > 0) {
			const userEmail = accounts[0].username;
			const user = userEmail.split('@')[0].replace('.', '');
			localStorage.setItem('user', user);
			localStorage.setItem('accounts', JSON.stringify(accounts));
			localStorage.setItem('useremail', userEmail);
			const userId = accounts[0].idTokenClaims.oid;
			localStorage.setItem('userId', userId);

			// Use acquireTokenSilent to get a valid access token
			instance
				.acquireTokenSilent({
					...loginRequest,
					account: accounts[0],
				})
				.then((response) => {
					const accessToken = response.accessToken;
					localStorage.setItem('MToken', accessToken);

					// Call Microsoft Graph API to get user information and security groups
					userGroups(userId);
				})
				.catch((error) => {
					console.error('Token acquisition error:', error);
				});
		}
	}, [accounts, instance]);

	const userGroups = async (userId) => {
		try {
			const accessToken = localStorage.getItem('MToken');

			console.log('Access Token:', accessToken);
			console.log('User ID:', userId);

			const response = await axios.get(
				`https://graph.microsoft.com/v1.0/users/${userId}/memberOf`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			if (response.status >= 200 && response.status < 300) {
				const data = response.data;

				const groupIds = data.value.map((group) => group.id);
				const groupName = data.value.map((group) => group.displayName);
				localStorage.setItem('groupsData', JSON.stringify(groupName));
				setGroupData(groupName);
				console.log(groupName);
			} else {
				console.error(
					'Error getting user groups:',
					response.status,
					response.statusText,
				);
			}
		} catch (error) {
			console.error('Error getting user groups:', error);
		}
	};

	useEffect(() => {
		const handleLogin = async () => {
			if (username === '' || password === '') {
				setError('Please enter a username and password.');
				return;
			}

			try {
				const accessToken = await loginUser(username, password);

				if (accessToken) {
					localStorage.setItem('access_token', accessToken);
					setTimeout(() => {
						localStorage.removeItem('access_token');
						console.log('Access_token expired. Removed from local storage.');
					}, 30 * 60 * 1000);
					console.log(accessToken);
					localStorage.setItem('username', username);
					setAccessDataReceived(true);
				}
			} catch (error) {
				console.log(error);
				//alert("Please enter the correct Username and Password");
			}
		};

		handleLogin();
	}, []);

	useEffect(() => {
		if (accessDataReceived) {
			navigate('/home');
		}
	}, [accessDataReceived, navigate]);

	return (
		<>
			<div className='text-4xl font-bold text-center'>
				Please wait Authenticating...
			</div>
		</>
	);
};

export default AzureADAuth;
