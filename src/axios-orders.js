import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://burgerbuilder-885df.firebaseio.com/'
});

export default instance;
