class Result
{
    constructor(container)
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
        const text = [
            ['The Players Finished with:',"",""],
            ['Time Remaining: ',data['timeRemaining']," Seconds\n\n"],
            ['Adventurer','',''],
            ['Number of Clicks: ',data['adventurerClicks']," Clicks"],
            ['Incorrect Answers: ',data['adventurerIncorrect'],' Answers\n\n'],
            ['Scholar','',''],
            ['Number of CLicks: ',data['scholarClicks'],' Clicks'],
            ['Incorrect Answers: ',data['scholarIncorrect'],' Answers']
        ]
        this.displayResults(text);
    }
    adminLoss(data)
    {
        const text = [
            ['The Players Ran Out of Time',"",""],
            ['Adventurer','',''],
            ['Number of Clicks: ',data['adventurerClicks']," Clicks"],
            ['Incorrect Answers: ',data['adventurerIncorrect'],' Answers\n\n'],
            ['Scholar','',''],
            ['Number of CLicks: ',data['scholarClicks'],' Clicks'],
            ['Incorrect Answers: ',data['scholarIncorrect'],' Incorrect Answers']
        ]
        this.displayResults(text);
    }
    playerWin(data)
    {
        const text = [
            ['Congratulations, You Won','',''],
            ['Time Remaining: ',data['timeRemaining']," seconds"]
        ]
        this.displayResults(text);
    }
    playerLoss()
    {
        const text = [
            ['You Ran Out of Time','','']
        ]
        this.displayResults(text);
    }
}