import { clearAuthToken, getAuthToken } from '@/utils/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
	isAuthenticated: boolean;
	isLoading: boolean;
	token: string | null;
	login: (token: string) => Promise<void>;
	logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [token, setToken] = useState<string | null>(null);

	useEffect(() => {
		checkAuthStatus();
	}, []);

	const checkAuthStatus = async () => {
		try {
			const storedToken = await getAuthToken();
			if (storedToken) {
				setToken(storedToken);
				setIsAuthenticated(true);
			}
		} catch (error) {
			console.log('Auth check error:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const login = async (newToken: string) => {
		setToken(newToken);
		setIsAuthenticated(true);
	};

	const logout = async () => {
		await clearAuthToken();
		setToken(null);
		setIsAuthenticated(false);
	};

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				isLoading,
				token,
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
