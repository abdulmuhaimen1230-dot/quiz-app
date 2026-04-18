    // --- Firebase Configuration ---
        const firebaseConfig = {
            apiKey: "AIzaSyCfvWOgzyLsVmmbi-dcTd0vOBLxw7AxI9A",
            authDomain: "quiz-app-a5829.firebaseapp.com",
            databaseURL: "https://quiz-app-a5829-default-rtdb.firebaseio.com", 
            projectId: "quiz-app-a5829",
            storageBucket: "quiz-app-a5829.firebasestorage.app",
            messagingSenderId: "833094102944",
            appId: "1:833094102944:web:e8e08909022d5dfbb6bec5"
        };

        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        const auth = firebase.auth();
        const database = firebase.database();

        // --- Question Bank ---
        const questions = [
            { q: "What does HTML stand for?", a: ["Hyper Text Markup Language", "High Text Machine Language", "Hyper Tabular Multi Language", "None"], correct: 0, cat: "HTML" },
            { q: "Which tag is used for the largest heading?", a: ["<heading>", "<h6>", "<h1>", "<head>"], correct: 2, cat: "HTML" },
            { q: "What is the correct tag for a line break?", a: ["<break>", "<lb>", "<br>", "<hr>"], correct: 2, cat: "HTML" },
            { q: "How do you create a checkbox in HTML?", a: ["<input type='check'>", "<check>", "<checkbox>", "<input type='checkbox'>"], correct: 3, cat: "HTML" },
            { q: "Which character is used to indicate an end tag?", a: ["*", "/", "<", "^"], correct: 1, cat: "HTML" },
            { q: "Which attribute is used to provide an image path?", a: ["link", "src", "href", "url"], correct: 1, cat: "HTML" },
            { q: "Which HTML element is used to define important text?", a: ["<important>", "<strong>", "<i>", "<b>"], correct: 1, cat: "HTML" },
            { q: "What does CSS stand for?", a: ["Color Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Creative Style Sheets"], correct: 1, cat: "CSS" },
            { q: "External style sheet is referred in?", a: ["<body>", "<footer>", "<head>", "<div>"], correct: 2, cat: "CSS" },
            { q: "Which property controls the text size?", a: ["font-style", "text-size", "font-size", "text-style"], correct: 2, cat: "CSS" },
            { q: "How do you make text bold?", a: ["font-weight: bold", "font: bold", "style: bold", "text: bold"], correct: 0, cat: "CSS" },
            { q: "Change background color using?", a: ["color", "bgcolor", "background-color", "surface"], correct: 2, cat: "CSS" },
            { q: "Default value of position?", a: ["relative", "fixed", "absolute", "static"], correct: 3, cat: "CSS" },
            { q: "Select element with id 'demo'?", a: [".demo", "#demo", "demo", "*demo"], correct: 1, cat: "CSS" },
            { q: "Which property changes left margin?", a: ["padding-left", "margin-left", "indent", "spacing"], correct: 1, cat: "CSS" },
            { q: "Where do we put JavaScript?", a: ["<js>", "<scripting>", "<script>", "<javascript>"], correct: 2, cat: "JS" },
            { q: "How to write 'Hello World' alert?", a: ["msg('Hello')", "alert('Hello World')", "console.log('Hello')", "p:hello"], correct: 1, cat: "JS" },
            { q: "Create a function using?", a: ["function:myFunc()", "function = myFunc()", "function myFunc()", "new function()"], correct: 2, cat: "JS" },
            { q: "How to write an IF statement?", a: ["if i = 5", "if (i == 5)", "if i == 5 then", "if i = 5 then"], correct: 1, cat: "JS" },
            { q: "How does a FOR loop start?", a: ["for (i <= 5; i++)", "for i = 1 to 5", "for (let i = 0; i <= 5; i++)", "for (i = 0; i <= 5)"], correct: 2, cat: "JS" },
            { q: "JavaScript array format?", a: ["var colors = 1:('red')", "var colors = ['red', 'blue']", "var colors = 'red', 'blue'", "var colors = (1:'red')"], correct: 1, cat: "JS" },
            { q: "Event when user clicks element?", a: ["onmouseclick", "onchange", "onclick", "onmouseover"], correct: 2, cat: "JS" },
            { q: "Declare a variable using?", a: ["variable car", "v carName", "let carName", "var:carName"], correct: 2, cat: "JS" },
            { q: "Operator to assign value?", a: ["*", "-", "x", "="], correct: 3, cat: "JS" },
            { q: "Is JavaScript case-sensitive?", a: ["No", "Yes", "Only in strings", "Only in variables"], correct: 1, cat: "JS" }
        ];

        let currentIdx = 0;
        let score = 0;
        let userUID = "";

        // --- Auth Logic ---
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = document.getElementById('submit-btn');
            const name = document.getElementById('user-name').value;
            const email = document.getElementById('user-email').value;
            const pass = document.getElementById('user-pass').value;

            btn.innerText = "Connecting...";
            btn.disabled = true;

            // Step 1: Create User
            auth.createUserWithEmailAndPassword(email, pass)
                .then((userCredential) => {
                    userUID = userCredential.user.uid;
                    
                    // Step 2: Save User to Realtime Database
                    return database.ref('users/' + userUID).set({
                        name: name,
                        email: email,
                        createdAt: new Date().toISOString()
                    });
                })
                .then(() => {
                    // Step 3: Start Quiz
                    document.getElementById('auth-container').classList.add('hidden');
                    document.getElementById('quiz-container').classList.remove('hidden');
                    loadQuestion();
                })
                .catch((error) => {
                    alert("Error: " + error.message);
                    btn.innerText = "Start Quiz";
                    btn.disabled = false;
                });
        });

        // --- Quiz Logic ---
        function loadQuestion() {
            const q = questions[currentIdx];
            document.getElementById('category-tag').innerText = q.cat;
            document.getElementById('question-text').innerText = q.q;
            document.getElementById('question-count').innerText = `Question ${currentIdx + 1} of ${questions.length}`;
            
            const optionsDiv = document.getElementById('options-list');
            optionsDiv.innerHTML = "";
            
            q.a.forEach((opt, index) => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.innerText = opt;
                btn.onclick = () => checkAnswer(index, btn);
                optionsDiv.appendChild(btn);
            });

            document.getElementById('progress-fill').style.width = `${((currentIdx + 1) / questions.length) * 100}%`;
        }

        function checkAnswer(selected, btn) {
            const correct = questions[currentIdx].correct;
            const allBtns = document.querySelectorAll('.option-btn');
            allBtns.forEach(b => b.style.pointerEvents = 'none');

            if (selected === correct) {
                btn.classList.add('correct');
                score++;
            } else {
                btn.classList.add('wrong');
                allBtns[correct].classList.add('correct');
            }
            document.getElementById('next-btn').classList.remove('hidden');
        }

        document.getElementById('next-btn').onclick = () => {
            currentIdx++;
            if (currentIdx < questions.length) {
                loadQuestion();
                document.getElementById('next-btn').classList.add('hidden');
            } else {
                showResults();
            }
        };

        function showResults() {
            document.getElementById('quiz-container').classList.add('hidden');
            document.getElementById('result-container').classList.remove('hidden');
            document.getElementById('final-score').innerText = score;
            
            const msg = score > 15 ? "Excellent Work!" : "Keep Practicing!";
            document.getElementById('result-message').innerText = msg;

            // Save final score to Realtime Database
            database.ref('scores/' + userUID).set({
                score: score,
                total: questions.length,
                timestamp: new Date().toISOString()
            }).catch(e => console.error("Database Error:", e));
        }
