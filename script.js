const STORAGE_KEY = "quizHistory";

let currentQuestion = null;

let askedQuestions = [];

let examMode = false;

let examQuestions = [];

let examIndex = 0;

let examCorrect = 0;

let sessionCorrect = 0;

let sessionIncorrect = 0;

let answered = false;

/* ==========================
   LocalStorage
========================== */

function getHistory() {

    const data =
        localStorage.getItem(
            STORAGE_KEY
        );

    return data
        ? JSON.parse(data)
        : {};
}

function saveHistory(history) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(history)
    );

}

/* ==========================
   カテゴリ初期化
========================== */

function initializeCategories() {

    const select =
        document.getElementById(
            "categoryFilter"
        );

    const categories =
        [...new Set(
            quizData.map(
                q => q.category
            )
        )];

    categories.sort();

    categories.forEach(category => {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            category;

        option.textContent =
            category;

        select.appendChild(
            option
        );

    });

}

/* ==========================
   フィルタ取得
========================== */

function getFilteredQuestions() {

    const category =
        document.getElementById(
            "categoryFilter"
        ).value;

    const difficulty =
        document.getElementById(
            "difficultyFilter"
        ).value;

    const tag =
        document.getElementById(
            "tagFilter"
        ).value;

    const favoriteOnly =
        document.getElementById(
            "favoriteOnly"
        ).checked;

    const incorrectOnly =
        document.getElementById(
            "incorrectOnly"
        ).checked;

    const history =
        getHistory();

    return quizData.filter(q => {

        if (
            category &&
            q.category !== category
        ) {
            return false;
        }

        if (
            difficulty &&
            q.difficulty !==
            Number(difficulty)
        ) {
            return false;
        }

        if (
            tag &&
            !q.tags.includes(tag)
        ) {
            return false;
        }

        if (
            favoriteOnly &&
            !history[q.id]?.favorite
        ) {
            return false;
        }

        if (
            incorrectOnly &&
            !history[q.id]?.incorrect
        ) {
            return false;
        }

        return true;

    });

}

/* ==========================
   ランダム重複なし
========================== */

function selectRandomQuestion(
    questions
) {

    const candidates =
        questions.filter(
            q =>
            !askedQuestions.includes(
                q.id
            )
        );

    if (
        candidates.length === 0
    ) {

        return null;

    }

    const question =
        candidates[
            Math.floor(
                Math.random()
                *
                candidates.length
            )
        ];

    askedQuestions.push(
        question.id
    );

    return question;

}

/* ==========================
   学習開始
========================== */

function startQuiz() {

    askedQuestions = [];

    sessionCorrect = 0;

    sessionIncorrect = 0;

    updateQuestionCount();

    document.getElementById(
        "startScreen"
    ).style.display =
        "none";

    document.getElementById(
        "quizScreen"
    ).style.display =
        "block";

    document.getElementById(
        "finishScreen"
    ).style.display =
        "none";

    loadQuestion();

}

/* ==========================
   問題表示
========================== */

function loadQuestion() {

    const filtered =
        getFilteredQuestions();

    if (
        filtered.length === 0
    ) {

        document.getElementById(
            "question"
        ).textContent =
            "該当する問題がありません";

        document.getElementById(
            "choices"
        ).innerHTML = "";

        document.getElementById(
            "result"
        ).innerHTML = "";

        document.getElementById(
            "explanation"
        ).innerHTML = "";

        return;

    }

    currentQuestion =
        selectRandomQuestion(
            filtered
        );

    if (
        currentQuestion === null
    ) {

        const total =
            sessionCorrect +
            sessionIncorrect;

        const score =
            total === 0
            ? 0
            : (
                sessionCorrect /
                total *
                100
            ).toFixed(1);

        document.getElementById(
            "quizScreen"
        ).style.display =
            "none";

        document.getElementById(
            "finishScreen"
        ).style.display =
            "block";

        document.getElementById(
            "finishResult"
        ).innerHTML =
            `
            <h3>今回の結果</h3>

            正解数：${sessionCorrect}<br>

            不正解数：${sessionIncorrect}<br>

            正答率：${score}%
            `;

        return;

    }

    renderQuestion(
        currentQuestion
    );

    updateProgress();

}

/* ==========================
   再チャレンジ
========================== */

function restartQuiz() {

    askedQuestions = [];

    sessionCorrect = 0;

    sessionIncorrect = 0;

    document.getElementById(
        "finishScreen"
    ).style.display =
        "none";

    document.getElementById(
        "quizScreen"
    ).style.display =
        "block";

    loadQuestion();

}

/* ==========================
   ホームへ戻る
========================== */

function returnHome() {

    document.getElementById(
        "startScreen"
    ).style.display =
        "block";

    document.getElementById(
        "quizScreen"
    ).style.display =
        "none";

    document.getElementById(
        "finishScreen"
    ).style.display =
        "none";

}

/* ==========================
   問題描画
========================== */

function renderQuestion(
    question
) {

    answered = false;

    document.getElementById(
        "category"
    ).textContent =
        question.category;

    document.getElementById(
        "difficulty"
    ).textContent =
        "難易度 ★" +
        question.difficulty;

    document.getElementById(
        "question"
    ).textContent =
        question.question;


		const questionArea =
		    document.getElementById(
		        "question"
		    );

		questionArea.textContent =
		    question.question;


		if (
		    question.questionImage
		) {

		    const img =
		        document.createElement(
		            "img"
		        );

		    img.src =
		        question.questionImage;

		    img.className =
		        "question-image";

		    img.alt =
		        "問題画像";

		    questionArea.appendChild(
		        document.createElement(
		            "br"
		        )
		    );

		    questionArea.appendChild(
		        document.createElement(
		            "br"
		        )
		    );

		    questionArea.appendChild(
		        img
		    );

		}



    document.getElementById(
        "result"
    ).innerHTML = "";

    document.getElementById(
        "explanation"
    ).innerHTML = "";

    const choicesArea =
        document.getElementById(
            "choices"
        );

    choicesArea.innerHTML = "";

    const shuffledChoices =
        [...question.choices]
        .sort(
            () => Math.random() - 0.5
        );

	currentQuestion.shuffledChoices =
	    shuffledChoices;

shuffledChoices.forEach(
    (choice, index) => {

        const button =
            document.createElement(
                "button"
            );

        button.className =
            "choice-btn";

        if (
            choice.type === "text"
        ) {

            button.textContent =
                choice.value;

        }
        else if (
            choice.type === "image"
        ) {

            const img =
                document.createElement(
                    "img"
                );

            img.src =
                choice.value;

            img.className =
                "choice-image";

            button.appendChild(
                img
            );

        }

        button.addEventListener(
            "click",
            () =>
            checkAnswer(
                choice,
                index
            )
        );

        choicesArea.appendChild(
            button
        );

    }
);

    updateFavoriteButton();

}

/* ==========================
   回答判定
========================== */

function checkAnswer(
    selectedChoice,
    selectedIndex
) {

    if (
        answered
    ) {

        return;

    }

    answered = true;

    const buttons =
        document.querySelectorAll(
            ".choice-btn"
        );

    buttons.forEach(btn => {

        btn.disabled = true;

    });

	buttons.forEach((btn, index) => {

	    const displayedChoice =
	        currentQuestion.shuffledChoices[
	            index
	        ];

	    const correctChoice =
	        currentQuestion.choices[
	            currentQuestion.answerIndex
	        ];

	    if (
	        displayedChoice.value ===
	        correctChoice.value
	    ) {

	        btn.classList.add(
	            "correct-choice"
	        );

	    }

	    if (
	        displayedChoice.value ===
	        selectedChoice.value &&
	        displayedChoice.value !==
	        correctChoice.value
	    ) {

	        btn.classList.add(
	            "wrong-choice"
	        );

	    }

	});

    const history =
        getHistory();

    const id =
        currentQuestion.id;

    if (
        !history[id]
    ) {

        history[id] = {

            correct: 0,

            incorrect: 0,

            favorite: false

        };

    }

    const resultArea =
        document.getElementById(
            "result"
        );

    const explanationArea =
        document.getElementById(
            "explanation"
        );

	const isCorrect =
	    selectedChoice.value ===
	    currentQuestion.choices[
	        currentQuestion.answerIndex
	    ].value;

	const correctChoice =
	    currentQuestion.choices[
	        currentQuestion.answerIndex
	    ];

	const correctDisplayedIndex =
	    currentQuestion.shuffledChoices
	        .findIndex(
	            c =>
	                c.value ===
	                correctChoice.value
	        );

	const correctNumber =
	    correctDisplayedIndex + 1;


    if (isCorrect) {

        history[id].correct++;

        sessionCorrect++;

        resultArea.textContent =
            "〇 正解";

        resultArea.className =
            "result correct";

    } else {

        history[id].incorrect++;

        sessionIncorrect++;

        resultArea.textContent =
            "× 不正解";

        resultArea.className =
            "result incorrect";

    }

	let html = "";

	html +=
	    "あなたの回答 : " +
	    (selectedIndex + 1) +
	    "番<br><br>";

	html +=
	    "正解 : " +
	    correctNumber +
	    "番<br><br>";

	html +=
	    "<strong>各選択肢の解説</strong><br><br>";



	currentQuestion.shuffledChoices
	.forEach(
	    (choice, index) => {

	        const hasExplanation =
	            choice.explanation &&
	            choice.explanation.trim() !== "";

	        const hasImage =
	            choice.explanationImage &&
	            choice.explanationImage.trim() !== "";

	        if (
	            !hasExplanation &&
	            !hasImage
	        ) {

	            return;

	        }

	        html +=
	            `<div id="choice-exp-${index}">`;

	        html +=
	            "【" +
	            (index + 1) +
	            "番】<br>";

	        if (hasExplanation) {

	            html +=
	                choice.explanation +
	                "<br>";

	        }

	        html +=
	            "</div><br>";

	    }
	);

	explanationArea.innerHTML =
	    html;

	currentQuestion.shuffledChoices
	.forEach(
	    (choice, index) => {

	        if (
	            choice.explanationImage &&
	            choice.explanationImage.trim() !== ""
	        ) {

	            const parent =
	                document.getElementById(
	                    `choice-exp-${index}`
	                );

	            if (!parent) {

	                return;

	            }

	            const img =
	                document.createElement(
	                    "img"
	                );

	            img.src =
	                choice.explanationImage;

	            img.className =
	                "choice-explanation-image";

	            img.alt =
	                "選択肢解説画像";

	            parent.appendChild(
	                img
	            );

	        }

	    }
	);

	if (
	    currentQuestion.explanationImage &&
	    currentQuestion.explanationImage.trim() !== ""
	) {

	    const img =
	        document.createElement(
	            "img"
	        );

	    img.src =
	        currentQuestion.explanationImage;

	    img.className =
	        "explanation-image";

	    img.alt =
	        "解説画像";

	    explanationArea.appendChild(
	        document.createElement(
	            "hr"
	        )
	    );

	    explanationArea.appendChild(
	        img
	    );

	}


    saveHistory(
        history
    );

    updateStatistics();

}

function getDisplayedAnswerNumber() {

    const correctChoice =
        currentQuestion.choices[
            currentQuestion.answerIndex
        ];

    const displayedIndex =
        currentQuestion.shuffledChoices
            .findIndex(
                choice =>
                    choice.value ===
                    correctChoice.value
            );

    return displayedIndex + 1;

}

/* ==========================
   お気に入り
========================== */

function updateFavoriteButton() {

    const history =
        getHistory();

    const favorite =
        history[
            currentQuestion.id
        ]?.favorite;

    document.getElementById(
        "favoriteBtn"
    ).textContent =
        favorite
        ? "★ お気に入り済"
        : "☆ お気に入り";

}

function toggleFavorite() {

    const history =
        getHistory();

    const id =
        currentQuestion.id;

    if (
        !history[id]
    ) {

        history[id] = {

            correct: 0,

            incorrect: 0,

            favorite: false

        };

    }

    history[id].favorite =
        !history[id].favorite;

    saveHistory(
        history
    );

    updateFavoriteButton();

    updateStatistics();

}

/* ==========================
   学習統計
========================== */

function updateStatistics() {

    const history =
        getHistory();

    let totalCorrect = 0;

    let totalIncorrect = 0;

    let favoriteCount = 0;

    let weakCount = 0;

    Object.values(history)
        .forEach(item => {

            totalCorrect +=
                item.correct;

            totalIncorrect +=
                item.incorrect;

            if (
                item.favorite
            ) {

                favoriteCount++;

            }

            if (
                item.incorrect >
                item.correct
            ) {

                weakCount++;

            }

        });

    const totalAnswer =
        totalCorrect +
        totalIncorrect;

    let accuracy = 0;

    if (
        totalAnswer > 0
    ) {

        accuracy =
            (
                totalCorrect
                /
                totalAnswer
                *
                100
            ).toFixed(1);

    }

    document.getElementById(
        "totalAnswer"
    ).textContent =
        totalAnswer;

    document.getElementById(
        "totalCorrect"
    ).textContent =
        totalCorrect;

    document.getElementById(
        "totalIncorrect"
    ).textContent =
        totalIncorrect;

    document.getElementById(
        "accuracy"
    ).textContent =
        accuracy + "%";

    document.getElementById(
        "favoriteCount"
    ).textContent =
        favoriteCount;

    document.getElementById(
        "weakCount"
    ).textContent =
        weakCount;

}

/* ==========================
   問題数表示
========================== */

function updateQuestionCount() {

    const filtered =
        getFilteredQuestions();

    document.getElementById(
        "totalQuestionCount"
    ).textContent =
        `登録問題数 : ${filtered.length}問`;

}

function updateProgress() {

    const filtered =
        getFilteredQuestions();

    document.getElementById(
        "questionCounter"
    ).textContent =
        `現在位置 : ${askedQuestions.length} / ${filtered.length}`;

}

/* ==========================
   イベント登録
========================== */

document
    .getElementById(
        "nextBtn"
    )
    .addEventListener(
        "click",
        loadQuestion
    );

document
    .getElementById(
        "favoriteBtn"
    )
    .addEventListener(
        "click",
        toggleFavorite
    );

document
    .getElementById(
        "restartBtn"
    )
    .addEventListener(
        "click",
        restartQuiz
    );

document
    .getElementById(
        "startBtn"
    )
    .addEventListener(
        "click",
        startQuiz
    );

document
    .getElementById(
        "returnHomeBtn"
    )
    .addEventListener(
        "click",
        returnHome
    );

document
    .getElementById(
        "categoryFilter"
    )
    .addEventListener(
        "change",
        updateStatistics
    );

document
    .getElementById(
        "difficultyFilter"
    )
    .addEventListener(
        "change",
        updateStatistics
    );

document
    .getElementById(
        "tagFilter"
    )
    .addEventListener(
        "change",
        updateStatistics
    );

document
    .getElementById(
        "favoriteOnly"
    )
    .addEventListener(
        "change",
        updateStatistics
    );

document
    .getElementById(
        "incorrectOnly"
    )
    .addEventListener(
        "change",
        updateStatistics
    );

/* ==========================
   初期化
========================== */

initializeCategories();

updateStatistics();

updateQuestionCount();

document.getElementById(
    "startScreen"
).style.display =
    "block";

document.getElementById(
    "quizScreen"
).style.display =
    "none";

document.getElementById(
    "finishScreen"
).style.display =
    "none";