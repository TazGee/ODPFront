const teams = [
    "T1","T2","T3","T4",
    "T5","T6","T7","T8",
    "T9","T10","T11","T12",
    "T13","T14","T15","T16"
];

const bracket =
    generateBracket(teams);

function generateBracket(teams){
    const rounds = [];
    let currentTeams = [...teams];
    while(currentTeams.length > 1){
        const round = [];
        for(let i = 0; i < currentTeams.length; i += 2){
            const team1 =
                currentTeams[i];
            const team2 =
                currentTeams[i + 1];
            round.push({
                team1,
                team2,
                winner:
                    !team2
                    ? team1
                    : null
            });
        }
        rounds.push(round);
        currentTeams =
            new Array(
                Math.ceil(
                    currentTeams.length / 2
                )
            ).fill(null);
    }
    return rounds;
}

function getRoundName(
    roundIndex,
    totalRounds
){
    const remaining =
        totalRounds - roundIndex;
    if(remaining === 1)
        return "Grand Final";
    if(remaining === 2)
        return "Semi Finals";
    if(remaining === 3)
        return "Quarter Finals";
    if(remaining === 4)
        return "Round of 16";
    return `Round ${roundIndex + 1}`;
}

function setWinner(
    roundIndex,
    matchIndex,
    winner
){
    const match =
        bracket[roundIndex][matchIndex];

    match.winner = winner;
    if(bracket[roundIndex + 1]){
        const nextMatchIndex =
            Math.floor(matchIndex / 2);
        const slot =
            matchIndex % 2 === 0
            ? "team1"
            : "team2";
        bracket
        [roundIndex + 1]
        [nextMatchIndex]
        [slot]
            = winner;
    }
    renderBracket();
}

function createTeamElement(
    name,
    isWinner,
    callback
){

    const div =
        document.createElement("div");
    div.className =
        "bracket-team" +
        (isWinner
            ? " bracket-winner"
            : "");
    div.innerHTML =
        `<span>${name || "TBD"}</span>`;
    if(name){

        div.onclick = callback;
    }
    return div;
}

function renderBracket(){
    const container =
        document.getElementById("bracket");

    container.innerHTML = "";
    bracket.forEach(
        (
            round,
            roundIndex
        )=>{
        const roundDiv =
            document.createElement("div");

        roundDiv.className =
            "bracket-round";

        const spacing =
            Math.pow(2, roundIndex)
            * 2.5;
        roundDiv.style.gap =
            `${spacing}vw`;

        const title =
            document.createElement("h3");
        title.className =
            "bracket-round-title";

        title.innerText =
            getRoundName(
                roundIndex,
                bracket.length
            );
        roundDiv.appendChild(title);
        round.forEach(
            (
                match,
                matchIndex
            )=>{
            const matchDiv =
                document.createElement("div");
            matchDiv.className =
                "bracket-match";
            const team1 =
                createTeamElement(
                    match.team1,
                    match.winner === match.team1,
                    ()=>{
                        setWinner(
                            roundIndex,
                            matchIndex,
                            match.team1
                        );
                    }
                );
            const team2 =
                createTeamElement(
                    match.team2,
                    match.winner === match.team2,
                    ()=>{
                        setWinner(
                            roundIndex,
                            matchIndex,
                            match.team2
                        );
                    }
                );
            matchDiv.appendChild(team1);
            matchDiv.appendChild(team2);
            roundDiv.appendChild(matchDiv);
        });
        container.appendChild(roundDiv);
    });
}

renderBracket();