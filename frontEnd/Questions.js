class Questions
{
    constructor(container,data,socket)
    {
        this.container = document.createElement("div");
        this.container.setAttribute('id','question-container');
        this.container.setAttribute("class","game-container");
        container.appendChild(this.container);
        this.container.style.justifyContent = "center";
        this.container.style.alignItems = "center";
        this.container.style.top = '0px';
        this.textElement = document.createElement("text");
        this.textElement.setAttribute("class","text");
        this.textElement.style.top = '40px';
        this.container.appendChild(this.textElement);
        this.optionButtonsElement = document.createElement("option-buttons");
        this.optionButtonsElement.setAttribute("class","btn-grid");
        this.container.appendChild(this.optionButtonsElement);

        this.index = 0;
        this.waiting = false;
        this.wrongAnswer = 0;
        this.textNodes = data;

        this.socket = socket;
        this.socket.on('nextQuestion',this.nextQuestion.bind(this));
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
            this.socket.emit('incorrectQuestion');
            setTimeout(() => { 
                button.style.backgroundColor = 'purple'; 
                this.waiting = false;
                this.showTextNode(nextTextNodeId)
            },500);
        }
        else
        {
            button.style.backgroundColor = 'green';
            this.socket.emit('correctQuestion',nextTextNodeId);
        }
    }
    nextQuestion(nextTextNodeId)
    {
        const HTMLbuttons = document.getElementsByClassName('btn');
        const buttons = Array.prototype.slice.call(HTMLbuttons);
        console.log(this);
        buttons.forEach(button => {
            button.style.backgroundColor = 'purple'; 
        })
        this.waiting = false;
        this.showTextNode(nextTextNodeId)
    }
}