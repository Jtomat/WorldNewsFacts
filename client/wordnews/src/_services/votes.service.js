
const config = {
    apiUrl: 'http://localhost:5001/api'
}

export const voteService = {
    vote,
    votesForUser
}

function vote(name, result, proof, news) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({user: name, result, proof, news})
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

function votesForUser(name) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };

    return fetch(`${config.apiUrl}/vote/votesForUser?user=${name}`, requestOptions)
        .then(handleResponse)
        .then(votes => {
            if (votes) {
                localStorage.setItem('votes', JSON.stringify(votes));
            }
            return votes;
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