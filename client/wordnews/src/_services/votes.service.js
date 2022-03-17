
const config = {
    apiUrl: 'http://localhost:5001/api'
}

export const voteService = {
    vote
}

function vote(name, result, proof, news) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({name, result, proof, news})
    };

    return fetch(`${config.apiUrl}/vote/newVote`, requestOptions)
        .then(handleResponse)
        .then(vote => {
            if (vote) {
                localStorage.setItem('vote', JSON.stringify(vote));
            }
            return vote;
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