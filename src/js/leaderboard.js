

const url = ` https://api-houssein.herokuapp.com/user/`;

export default class Leaderboard {
    async getScores() {
        return new Promise((resolve, reject) => {
            this.scoreArray = [];

            fetch(url + "get", {mode: 'cors'})
                .then(result => result.json())
                .catch(error => {
                    reject(error);
                })
                .then((result) => {
                    result.forEach((res) => {
                        const name=res.name
                        const score=res.score
                        this.scoreArray.push({name,score});
                    });
                    const scoreSorted = this.scoreArray.sort((a, b) => {
                        a = parseInt(a.score, 10);
                        b = parseInt(b.score, 10);
                        if (a < b) {
                            return 1;
                        }
                        if (a > b) {
                            return -1;
                        }
                        return 0;
                    });

                    resolve(scoreSorted);
                });
        });
    }

    async postScore(player, score) {
        return new Promise((resolve, reject) => {
            const entry = {score: score};

            fetch(url + "add/" + player, {
                method: 'PATCH',
                mode: 'cors',
                headers: {'Content-type': 'application/json;charset=UTF-8'},
                body: JSON.stringify(entry),
            })
                .then((result) => {
                    if (result.ok) return result.json();
                    throw new Error('An error ocurred');
                })
                .catch((error) => {
                    reject(error);
                })
                .then(() => resolve(this.getScores()));
        });
    }
}