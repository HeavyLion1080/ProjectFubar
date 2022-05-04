class Questions
{
    constructor(container,fubar,data)
    {
        this.container = document.createElement("question-container");
        this.container.setAttribute("class","game-container");
        container.appendChild(this.container);
        this.container.style.justifyContent = "center";
        this.container.style.alignItems = "center";
        this.container.style.top = '0px';
        this.textElement = document.createElement("text");
        this.textElement.setAttribute("class","text");
        this.container.appendChild(this.textElement);
        this.optionButtonsElement = document.createElement("option-buttons");
        this.optionButtonsElement.setAttribute("class","btn-grid");
        this.container.appendChild(this.optionButtonsElement);

        this.fubar = fubar;
        this.index = 0;
        this.waiting = false;
        this.wrongAnswer = 0;
        this.textNodes = data;
    }

    startGame() 
    {
        this.showTextNode(1);
    }

    showTextNode(textNodeIndex)
    {
        this.index = textNodeIndex;
        const textNode = this.textNodes.find(textNode => textNode.id == textNodeIndex);
        this.textElement.innerText = textNode.text;

        while (this.optionButtonsElement.firstChild)
        {
            this.optionButtonsElement.removeChild(this.optionButtonsElement.firstChild);
        }
        
        textNode.options.forEach(option => 
        {
            const button = document.createElement('button');
            button.innerText = option.text;
            button.classList.add('btn');
            button.addEventListener('click', () => 
            {
                if(!this.waiting)
                {
                    this.selectOption(button, option);
                }
            });
            this.optionButtonsElement.appendChild(button);
        })
    }

    selectOption(button, option)
    {
        const nextTextNodeId = option.nextText;
        this.waiting = true;

        if(nextTextNodeId == this.index)
        {
            button.style.backgroundColor = 'red';
            this.wrongAnswer ++;
            console.log(this.wrongAnswer);
        }
        else
        {
            button.style.backgroundColor = 'green';
        }
        setTimeout(() => { 
            button.style.backgroundColor = 'purple'; 
            this.waiting = false;
            if(nextTextNodeId == 5)
            {
                this.container.remove();
                this.fubar.init();
            }   
            else
            {
                this.showTextNode(nextTextNodeId)
            }
        },500);
    }
}