import { authHeader } from '../_helpers';

const config = {
    apiUrl: 'http://localhost:5001/api'
}

export const newsService = {
    getAll
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };

    return fetch(`${config.apiUrl}/news/getAllNews`, requestOptions)
    .then(handleResponse)
    .then(news => {
        // login successful if there's a jwt token in the response
        if (news && news.lenght) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('news', JSON.stringify(news));
        }
        return news;
    });

}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}