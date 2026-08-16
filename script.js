const STORAGE_KEY = "quizHistory";

let currentQuestion = null;

let askedQuestions = [];

let examMode = false;

let examQuestions = [];

let examIndex = 0;

let examCorrect = 0;

let sessionCorrect = 0;

let sessionIncorrect = 0;

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

    const keyword =
        document.getElementById(
            "searchText"
        )
        .value
        .trim()
        .toLowerCase();

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
            keyword &&
            !q.question
                .toLowerCase()
                .includes(keyword)
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
	        "question"
	    ).innerHTML =
	        "学習完了！ お疲れさまでした！";

	    document.getElementById(
	        "choices"
	    ).innerHTML =
	        "";

	    document.getElementById(
	        "result"
	    ).innerHTML =
	        `
	        <h3>今回の結果</h3>

	        正解数：${sessionCorrect}<br>

	        不正解数：${sessionIncorrect}<br>

	        正答率：${score}%
	        `;

	    document.getElementById(
	        "explanation"
	    ).innerHTML =
	        "";

	    document.getElementById(
	        "questionCounter"
	    ).textContent =
	        `${filtered.length} / ${filtered.length}`;

		document.getElementById(
		    "nextBtn"
		).style.display =
		    "none";

		document.getElementById(
		    "favoriteBtn"
		).style.display =
		    "none";

		document.getElementById(
		    "restartBtn"
		).style.display =
		    "block";

	    return;
	}

	renderQuestion(
	    currentQuestion
	);

	updateProgress();

}

function restartQuiz() {

    askedQuestions = [];

    sessionCorrect = 0;

    sessionIncorrect = 0;

    document.getElementById(
        "restartBtn"
    ).style.display =
        "none";

    document.getElementById(
        "nextBtn"
    ).style.display =
        "block";

    document.getElementById(
        "favoriteBtn"
    ).style.display =
        "block";

    loadQuestion();

}

/* ==========================
   問題描画
========================== */

function renderQuestion(
    question
) {

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

    question.choices.forEach(
        choice => {

            const button =
                document.createElement(
                    "button"
                );

            button.className =
                "choice-btn";

            button.textContent =
                choice;

            button.addEventListener(
                "click",
                () =>
                checkAnswer(
                    choice
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
    selectedChoice
) {

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
        selectedChoice ===
        currentQuestion.answer;

    if (isCorrect) {

        history[id].correct++;

        sessionCorrect++;

        resultArea.textContent =
            "〇 正解";

        resultArea.className =
            "result correct";

        if (examMode) {

            examCorrect++;

        }

    } else {

        history[id].incorrect++;

        sessionIncorrect++;

        resultArea.textContent =
            "× 不正解";

        resultArea.className =
            "result incorrect";

    }

    explanationArea.innerHTML =
        `
        <strong>正解：</strong>
        ${currentQuestion.answer}
        <br><br>
        ${currentQuestion.explanation}
        `;

    saveHistory(
        history
    );

    updateStatistics();

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
   統計更新
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
   模擬試験開始
========================== */

function startExam() {

    const filtered =
        getFilteredQuestions();

    if (
        filtered.length === 0
    ) {

        alert(
            "出題対象がありません。"
        );

        return;

    }

    examMode = true;

    examCorrect = 0;

    examIndex = 0;

    examQuestions =
        [...filtered]
        .sort(
            () =>
            Math.random() - 0.5
        )
        .slice(
            0,
            Math.min(
                20,
                filtered.length
            )
        );

    document.getElementById(
        "examResult"
    ).innerHTML = "";

    nextExamQuestion();

}

/* ==========================
   模擬試験問題表示
========================== */

function nextExamQuestion() {

    if (
        examIndex >=
        examQuestions.length
    ) {

        finishExam();

        return;

    }

    currentQuestion =
        examQuestions[
            examIndex
        ];

    document.getElementById(
        "examStatus"
    ).textContent =
        `模擬試験 ${examIndex + 1} / ${examQuestions.length}`;

    renderQuestion(
        currentQuestion
    );

    examIndex++;

}

/* ==========================
   模擬試験終了
========================== */

function finishExam() {

    examMode = false;

    const score =
        (
            examCorrect
            /
            examQuestions.length
            *
            100
        ).toFixed(1);

    document.getElementById(
        "examStatus"
    ).textContent =
        "模擬試験終了";

    document.getElementById(
        "examResult"
    ).innerHTML =
        `
        <h3>試験結果</h3>

        正解数：
        ${examCorrect}
        /
        ${examQuestions.length}

        <br><br>

        得点：
        ${score}%
        `;

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
        () => {

            if (
                examMode
            ) {

                nextExamQuestion();

            } else {

                loadQuestion();

            }

        }
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
        "startExamBtn"
    )
    .addEventListener(
        "click",
        startExam
    );

document
    .getElementById(
        "searchText"
    )
    .addEventListener(
        "input",
        loadQuestion
    );

document
    .getElementById(
        "categoryFilter"
    )
    .addEventListener(
        "change",
        loadQuestion
    );

document
    .getElementById(
        "difficultyFilter"
    )
    .addEventListener(
        "change",
        loadQuestion
    );

document
    .getElementById(
        "tagFilter"
    )
    .addEventListener(
        "change",
        loadQuestion
    );

document
    .getElementById(
        "favoriteOnly"
    )
    .addEventListener(
        "change",
        loadQuestion
    );

document
    .getElementById(
        "incorrectOnly"
    )
    .addEventListener(
        "change",
        loadQuestion
    );

document
    .getElementById(
        "restartBtn"
    )
    .addEventListener(
        "click",
        restartQuiz
    );

/* ==========================
   問題数表示
========================== */
function updateQuestionCount() {

    document.getElementById(
        "totalQuestionCount"
    ).textContent =

        `登録問題数 : ${quizData.length}問`;

}

function updateProgress() {

    document.getElementById(
        "questionCounter"
    ).textContent =

        `現在位置 : ${askedQuestions.length} / ${quizData.length}`;

}

/* ==========================
   初期化
========================== */

initializeCategories();

updateStatistics();

updateQuestionCount();

loadQuestion();


