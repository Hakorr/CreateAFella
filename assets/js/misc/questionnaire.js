(() => {
    const randomSort = arr => arr.sort(() => 0.5 - Math.random());
    const questionContainer = document.querySelector('#question-container');
    const questionsElem = document.querySelector('#questions');
    const questionnaireDoneBtn = document.querySelector('#questionnaire-done-button');

    const firstTime = !localStorage.getItem('isFella');
    const isFella = localStorage.getItem('isFella') == 'true';

    function enableFailureMode() {
        document.body.classList.add('failure-mode');
        document.body.innerHTML = `
            <div class="failure-mode-center map-pattern-background">
                <div style="font-size: 1vh; color: darkred; margin-bottom: 0.5vh;">
                    Timestamp ${Date.now()}
                </div>
                <div style="font-size: 3.5vh;">
                    <b><i>/ CRITICAL FAILURE /</i></b>
                </div>
                <div style="font-size: 2vh; color: crimson;">
                    &lt;Access Denied&gt;
                </div>
                <div style="font-size: 1vh; margin-top: 1vh;">
                    [Fella not detected]
                </div>
            </div>
        `;
    }

    if (firstTime) {
        questionContainer.removeAttribute('class');
    } else if (isFella) {
        initialize();
        return;
    } else {
        enableFailureMode();
    }

    const questions = [
        {
            "label": "Ukraine is a(n)...",
            "answers": [
                { "label": "Peaceful and an independent country", "valid": true },
                { "label": "Aggressive and a dangerous country", "valid": false },
                { "label": "NATO puppet state, an excuse to attack Russia", "valid": false }
            ]
        },
        {
            "label": "The R*ssian Federation is a(n)...",
            "answers": [
                { "label": "State sponsor of terrorism", "valid": true },
                { "label": "Advocate for world peace", "valid": false },
                { "label": "Democratic country", "valid": false }
            ]
        },
        {
            "label": "The R*ssian Armed Forces' tactics include...",
            "answers": [
                { "label": "Bombing civilians with no regard for human life", "valid": true },
                { "label": "Careful tactical strikes to military targets", "valid": false },
                { "label": "Respecting other countries' territorial integrity", "valid": false }
            ]
        },
        {
            "label": "Russian warship, [...]",
            "answers": [
                { "label": "Go fuck yourself!", "valid": true },
                { "label": "An unsinkable war machine", "valid": false },
                { "label": "Ruler of the Black Sea", "valid": false }
            ]
        },
        {
            "label": "The Kremlim threatens you, how do you answer?",
            "answers": [
                { "label": "Crimea River.", "valid": true },
                { "label": "Sorry, I will comply with your orders for now on.", "valid": false },
                { "label": "Please, don't nuke me, I'll suck your cock!", "valid": false }
            ]
        },
        {
            "label": "Slava Ukraini, Heroyam Slava!",
            "answers": [
                { "label": "Yes", "valid": true },
                { "label": "No", "valid": false }
            ]
        }
    ];

    const encodeID = (id, idx, idx2) => btoa(id).replaceAll('=', '') + idx + idx2;

    function addQuestions() {
        function getAnswerElems(answers, idx) {
            let res = '';

            answers = randomSort(answers);

            answers.forEach((answer, idx2) => {
                const id = encodeID(answer.label, idx, idx2);

                res += `
                    <input type="radio" id="${id}" name="SlavaUkraini">
                    <label for="${id}">${answer.label}</label><br>
                `;
            });

            return res;
        }

        //const randomizedQuestions = randomSort(questions);

        questions.forEach((question, idx) => {
            const questionElem = document.createElement('form');
            questionElem.className = 'question';
            questionElem.innerHTML = `
                <div class="question-title">${'#' + (idx + 1) + ' ' + question.label}</div><br>
                ${getAnswerElems(question.answers, idx)}
            `;

            questionsElem.appendChild(questionElem);
        });
    }

    function checkAnswers() {
        totalScore = 0;

        questions.forEach((question, idx) => {
            question.answers.forEach((answer, idx2) => {
                const id = encodeID(answer.label, idx, idx2);
                
                const input = document.querySelector('#' + id);
                const inputLabel = document.querySelector(`.question label[for=${id}]`);
                const rightAnswer = question.answers.find(x => x.valid == true);

                if (input.checked && inputLabel.innerText == rightAnswer.label) {
                    totalScore = totalScore + 1;
                }
            });
        });

        if (totalScore == questions.length) {
            localStorage.setItem("isFella", true);
            questionContainer.className = 'hidden';
        } else {
            localStorage.setItem("isFella", false);
            enableFailureMode();
        }
    }

    questionnaireDoneBtn.onclick = checkAnswers;

    if (firstTime) {
        addQuestions();
    }
})();