const add = (a,b) => a + b;
add.toString = () => '+';
const sub = (a,b) => a - b;
sub.toString = () => '-';
const mul = (a,b) => a * b;
mul.toString = () => 'x';
const div = (a,b) => a / b;
div.toString = () => '/';

const activities = {
    add: "Additions",
    sub: "Soustractions",
    mul: "Multiplications",
    div: "Divisions"
}

const activityOp = {
    Additions: add,
    Soustractions: sub,
    Multiplications: mul,
    Divisions: div
}

let currentOp = add;
let currentResult = 0;

const title = document.getElementById('title').firstChild;
const question = document.getElementById('question').firstChild;
const answer = document.getElementById('answer').firstChild;

function randomNumber() {
    return Math.ceil(Math.random() * 99);
}

function refreshQuestion() {
    const a = randomNumber();
    const b = randomNumber();
    currentResult = currentOp(a, b);
    question.nodeValue = `${a} ${currentOp} ${b} ?`;
    answer.nodeValue = '';
}

function changeActivity(e) {
    const ac = e.currentTarget.id;
    if (activities.hasOwnProperty(ac)) {
        title.nodeValue = activities[ac];
    }
}

function changeTitle(mutations) {
    for (const mutation of mutations) {
        if (mutation.type === 'characterData' && activityOp.hasOwnProperty(mutation.target.nodeValue)) {
            currentOp = activityOp[mutation.target.nodeValue];
            refreshQuestion();
        }
    }
}

function changeAnswer(mutations) {
    for (const mutation of mutations) {
        const n = parseInt(mutation.target.nodeValue);
        if (mutation.type === 'characterData' && !isNaN(n)) {
            if (n === currentResult) {
                mutation.target.parentElement.classList.remove('incorrect');
                mutation.target.parentElement.classList.add('correct');
            } else if ((Math.log10(n) | 0) === (Math.log10(currentResult) | 0)) {
                mutation.target.parentElement.classList.add('incorrect');
                mutation.target.parentElement.classList.remove('correct');
            } else if ((Math.log10(n) | 0) < (Math.log10(currentResult) | 0)) {
                mutation.target.parentElement.classList.remove('incorrect');
                mutation.target.parentElement.classList.remove('correct');
            }
        }
    }
}

function clickNum(e) {
    const n = parseInt(e.currentTarget.id.slice(-1));
    if (!isNaN(n)) {
        answer.nodeValue += `${n}`;
    }
}

function clickBackSpace(e) {
    answer.nodeValue = answer.nodeValue.slice(0, -1);
}

const titleObserver = new MutationObserver(changeTitle);
const answerObserver = new MutationObserver(changeAnswer);

titleObserver.observe(title, {characterData: true});
answerObserver.observe(answer, {characterData: true});

document.getElementById('key-action-1').addEventListener('click', clickBackSpace, false);

document.querySelectorAll('.menu-item').forEach(n => n.addEventListener('click', changeActivity, false));

document.querySelectorAll('[id^=key-num-]').forEach(k => k.addEventListener('click', clickNum, false));

refreshQuestion();
