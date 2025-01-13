import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { refreshToken } from '../utils/auth';
import { useAuth } from '../context/AuthContext';

interface LoginResponse {
    access: string;
    refresh: string;
    user: {
        id: number;
        username: string;
        first_name: string;
        last_name: string;
        phone: string;
        bonus: string;
    };
}

const API_URL = 'http://109.196.101.160';

export const Login = () => {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/token/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Неверный логин или пароль');
            }

            const data: LoginResponse = await response.json();
            
            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);
            localStorage.setItem('userData', JSON.stringify(data.user));
            
            setUser(data.user);

            try {
                await refreshToken();
                navigate('/');
            } catch (refreshError) {
                throw new Error('Ошибка авторизации');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Произошла ошибка при входе');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full min-h-[80vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
                    <div className="flex justify-center mb-8">
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <LogIn className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
                        Вход в аккаунт
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Имя пользователя
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Пароль
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
                                isLoading
                                    ? 'bg-blue-400 dark:bg-blue-500 cursor-not-allowed'
                                    : 'bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700'
                            }`}
                        >
                            {isLoading ? 'Вход...' : 'Войти'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};