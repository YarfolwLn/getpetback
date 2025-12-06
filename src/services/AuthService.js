// src/services/AuthService.js
class AuthService {
    static isAuthenticated() {
        const token = localStorage.getItem('auth_token');
        console.log('AuthService.isAuthenticated():', token ? 'ЕСТЬ токен' : 'НЕТ токена');
        return !!token;
    }

    static getUserData() {
        try {
            const userDataStr = localStorage.getItem('user_data');
            const userData = userDataStr ? JSON.parse(userDataStr) : null;
            return userData;
        } catch (error) {
            console.error('Ошибка при чтении user_data:', error);
            return null;
        }
    }

    static getUserName() {
        const userData = this.getUserData();
        if (userData) {
            return userData.name || userData.email || '';
        }
        return '';
    }

    static getUserId() {
        const userData = this.getUserData();
        return userData ? userData.id : null;
    }

    static getToken() {
        return localStorage.getItem('auth_token');
    }

    static logout() {
        console.log('AuthService.logout()');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_email');
        // Отправляем событие для обновления компонентов
        const authChangeEvent = new Event('authChange');
        window.dispatchEvent(authChangeEvent);
    }

    static login(token, userData) {
        console.log('AuthService.login(): сохранение токена и данных пользователя');
        localStorage.setItem('auth_token', token);
        if (userData) {
            localStorage.setItem('user_data', JSON.stringify(userData));
            if (userData.id) {
                localStorage.setItem('user_id', userData.id.toString());
            }
        }
        // Отправляем событие для обновления компонентов
        const authChangeEvent = new Event('authChange');
        window.dispatchEvent(authChangeEvent);
    }

    static updateUserData(newData) {
        try {
            const currentData = this.getUserData() || {};
            const updatedData = { ...currentData, ...newData };
            localStorage.setItem('user_data', JSON.stringify(updatedData));
            const userDataUpdateEvent = new Event('userDataUpdate');
            window.dispatchEvent(userDataUpdateEvent);
            return updatedData;
        } catch (error) {
            console.error('Ошибка при обновлении данных пользователя:', error);
            return null;
        }
    }
}

export default AuthService;