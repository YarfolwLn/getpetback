// src/services/api.js
import { API_HOST, BASE_URL } from '../config/api';

class ApiService {
    constructor() {
        this.baseUrl = API_HOST;
        this.token = localStorage.getItem('auth_token');
        this.searchTimeout = null;
    }

    // Добавляем метод для получения полного URL изображения
    getImageUrl(imagePath) {
        if (!imagePath) return null;
        // Если URL уже полный, возвращаем как есть
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        // Иначе добавляем базовый URL
        return `${BASE_URL}${imagePath}`;
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('auth_token', token);
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('auth_token');
    }

    getHeaders(isFormData = false) {
        const headers = {};
        
        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        return headers;
    }

    async request(endpoint, method = 'GET', data = null, isFormData = false) {
        const url = `${this.baseUrl}${endpoint}`;
        const options = {
            method,
            headers: this.getHeaders(isFormData),
        };

        if (data) {
            if (isFormData) {
                options.body = data;
            } else {
                options.body = JSON.stringify(data);
            }
        }

        try {
            const response = await fetch(url, options);
            
            // Handle 204 No Content
            if (response.status === 204) {
                return { success: true };
            }

            const responseData = await response.json();
            
            if (!response.ok) {
                throw {
                    status: response.status,
                    data: responseData
                };
            }

            return responseData;
        } catch (error) {
            console.error(`API Error (${method} ${endpoint}):`, error);
            throw error;
        }
    }

    // Слайдер с животными
    async getPetsSlider(empty = false) {
        const endpoint = empty ? '/pets/slider/empty' : '/pets/slider';
        const result = await this.request(endpoint);
        
        // Преобразуем пути изображений в полные URL
        if (result && result.data && result.data.pets) {
            result.data.pets = result.data.pets.map(pet => ({
                ...pet,
                image: pet.image ? this.getImageUrl(pet.image) : null
            }));
        }
        
        return result;
    }

    // Быстрый поиск
    async searchPets(query = '', delay = 1000) {
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        
        return new Promise((resolve) => {
            this.searchTimeout = setTimeout(async () => {
                const endpoint = query ? `/search?query=${encodeURIComponent(query)}` : '/search';
                const result = await this.request(endpoint);
                
                // Преобразуем пути изображений
                if (result && result.data && result.data.orders) {
                    result.data.orders = result.data.orders.map(order => ({
                        ...order,
                        photo: order.photo ? this.getImageUrl(order.photo) : null,
                        photos: order.photos ? this.getImageUrl(order.photos) : null
                    }));
                }
                
                resolve(result);
            }, delay);
        });
    }

    // Последние найденные животные
    async getRecentPets() {
        const result = await this.request('/pets');
        
        // Преобразуем пути изображений
        if (result && result.data && result.data.orders) {
            result.data.orders = result.data.orders.map(order => ({
                ...order,
                photo: order.photo ? this.getImageUrl(order.photo) : null,
                photos: order.photos ? this.getImageUrl(order.photos) : null
            }));
        }
        
        return result;
    }

    // Подписка на новости
    async subscribeToNews(email) {
        return this.request('/subscription', 'POST', { email });
    }

    // Регистрация пользователя
    async register(userData) {
        return this.request('/register', 'POST', {
            ...userData,
            confirm: userData.confirm ? 1 : 0
        });
    }

    // Авторизация
    async login(email, password) {
        const result = await this.request('/login', 'POST', { email, password });
        if (result.data && result.data.token) {
            this.setToken(result.data.token);
        }
        return result;
    }

    // Поиск по объявлениям
    async searchOrders(params) {
        const { district, kind } = params;
        let queryString = '';
        const paramsArray = [];
        
        if (district) paramsArray.push(`district=${encodeURIComponent(district)}`);
        if (kind) paramsArray.push(`kind=${encodeURIComponent(kind)}`);
        
        if (paramsArray.length > 0) {
            queryString = `?${paramsArray.join('&')}`;
        }
        
        const result = await this.request(`/search/order${queryString}`);
        
        // Преобразуем пути изображений
        if (result && result.data && result.data.orders) {
            result.data.orders = result.data.orders.map(order => ({
                ...order,
                photo: order.photo ? this.getImageUrl(order.photo) : null,
                photos: order.photos ? this.getImageUrl(order.photos) : null
            }));
        }
        
        return result;
    }

    // Получение информации о пользователе
    async getUserProfile(userId) {
        return this.request(`/users/${userId}`);
    }

    // Обновление телефона
    async updatePhone(userId, phone) {
        return this.request(`/users/${userId}/phone`, 'PATCH', { phone });
    }

    // Обновление email
    async updateEmail(userId, email) {
        return this.request(`/users/${userId}/email`, 'PATCH', { email });
    }

    // Объявления пользователя
    async getUserOrders(userId) {
        const result = await this.request(`/users/orders/${userId}`);
        
        // Преобразуем пути изображений
        if (result && result.data && result.data.orders) {
            result.data.orders = result.data.orders.map(order => ({
                ...order,
                photo: order.photo ? this.getImageUrl(order.photo) : null,
                photos: order.photos ? this.getImageUrl(order.photos) : null
            }));
        }
        
        return result;
    }

    // Удаление объявления
    async deleteOrder(orderId) {
        return this.request(`/users/orders/${orderId}`, 'DELETE');
    }

    // Редактирование объявления
    async updateOrder(orderId, formData) {
        return this.request(`/pets/${orderId}`, 'PATCH', formData, true);
    }

    // Получение карточки животного
    async getPetDetails(petId) {
        const result = await this.request(`/pets/${petId}`);
        
        // Преобразуем пути изображений
        if (result && result.data && result.data.pet && result.data.pet.length > 0) {
            const pet = result.data.pet[0];
            if (pet.photos && Array.isArray(pet.photos)) {
                pet.photos = pet.photos.map(photo => 
                    photo ? this.getImageUrl(photo) : null
                );
            }
        }
        
        return result;
    }

    // Добавление нового объявления - БЕЗ авторизации!
    async createOrder(formData) {
        return this.request('/pets', 'POST', formData, true);
    }

    // Проверка токена
    async verifyToken() {
        if (!this.token) return false;
        
        try {
            // Используем endpoint профиля для проверки
            await this.request('/users/1'); // ID будет заменен на реальный
            return true;
        } catch (error) {
            if (error.status === 401) {
                this.clearToken();
            }
            return false;
        }
    }
}

export default new ApiService();