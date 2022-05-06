class Result
{
    constructor(container, fubar)
    {
        this.container = container;
    }

    displayResults(text)
    {
        const ul = document.createElement('ul');
        ul.setAttribute('class', 'results');
        this.container.appendChild(ul);
        text.forEach(element => {
            let li = document.createElement('li');
            li.innerText = element[0] + element[1] + element[2];
            ul.appendChild(li);
        });
    }
    adminWin(data)
    {
        this.container.style.background = "green";
        const text = [
            ['The Players Finished with:',"",""],
            ['Remaining Time: ',data[0]," minutes\n\n"],
            ['Adventurer','',''],
            ['Number of Clicks: ',data[1]," clicks"],
            ['Wrong Answers: ',data[2],' answers\n\n'],
            ['Scholar','',''],
            ['Number of CLicks: ',data[3],' clicks'],
            ['Wrong Answer: ',data[4],' answers']
        ]
        this.displayResults(text);
    }
    adminLoss(data)
    {
        this.container.style.background = 'red';
        const text = [
            ['The Players Ran Out of Time',"",""],
            ['Adventurer','',''],
            ['Number of Clicks: ',data[1]," clicks"],
            ['Wrong Answers: ',data[2],' answers\n\n'],
            ['Scholar','',''],
            ['Number of CLicks: ',data[3],' clicks'],
            ['Wrong Answer: ',data[4],' answers']
        ]
        this.displayResults(text);
    }
    playerWin(data)
    {
        this.container.style.background = 'green';
        const text = [
            ['Congratulations, you Won','',''],
            ['Time Remaining: ',data[0]," minutes"]
        ]
        this.displayResults(text);
    }
    playerLoss()
    {
        const text = [
            ['You Ran Out of Time','','']
        ]
    }
}