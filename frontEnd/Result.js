class Result
{
    constructor(container, fubar)
    {
        this.container = container;
        this.optionButtonsElement = document.createElement("option-buttons");
        this.optionButtonsElement.setAttribute("class","btn-grid");
        this.container.appendChild(this.optionButtonsElement);
    }

    displayResults(data)
    {
        this.container.style.background = "green";
        const text = [
            ['RESULTS',"",""],
            ['Remaining Time: ',data[0]," minutes\n\n"],
            ['Adventurer','',''],
            ['Number of Clicks: ',data[1]," clicks"],
            ['Wrong Answers: ',data[2],' answers\n\n'],
            ['Scholar','',''],
            ['Number of CLicks: ',data[3],' clicks'],
            ['Wrong Answer: ',data[4],' answers']
        ]

        const ul = document.createElement('ul');
        this.container.appendChild(ul);
        text.forEach(element => {
            let li = document.createElement('li');
            li.innerText = element[0] + element[1] + element[2];
            ul.appendChild(li);
        });
    }
}