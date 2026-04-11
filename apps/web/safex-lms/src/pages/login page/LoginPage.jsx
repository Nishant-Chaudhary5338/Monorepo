import React, { useEffect } from 'react';
import GoogleButton from 'react-google-button';
import { signInWithPopup, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { auth, googleAuthProvider } from '../../firebase';
import { loginUser } from '../../api/login';

const LoginPage = () => {
	const navigate = useNavigate();
	const { user, setUser } = useAuth();

	useEffect(() => {
		if (user) {
			// If the user is already authenticated, redirect to the home page
			navigate('/home');
		}
	}, [user, navigate]);

	const handleSignInWithGoogle = async () => {
		try {
			const result = await signInWithPopup(auth, googleAuthProvider);
			console.log(result);

			if (result.user) {
				const userEmail = result.user.email;
				const approvedDomains = [
					'agcaretech.com',
					'safexchemicals.com',
					'smithnsmith.net',
				];
				const userDomain = userEmail.split('@')[1];

				if (approvedDomains.includes(userDomain)) {
					// Update the user state in the context
					setUser(result.user);
					const jwt = await loginUser(result.user.displayName, result.user.email);
					console.log("jwt", jwt)
					console.log(result);
					navigate('/home');
				} else {
					// Sign out the user and display a message
					navigate('/');
					await signOut(auth);
					navigate('/login');
					alert("You don't have access to this app.");
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div
			className='min-h-screen text-4xl font-semibold bg-center bg-no-repeat bg-cover'
			style={{ backgroundImage: 'url(/assets/bg.png)' }}
		>
			<div className='flex items-center justify-center h-full'>
				<div className='flex justify-center p-10 hover:scale-105'>
					<GoogleButton onClick={handleSignInWithGoogle} />
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
