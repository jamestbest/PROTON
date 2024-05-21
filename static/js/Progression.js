let grades = []
// going to be {percentage, credits}
let data = {
    allPassed: false,
    weightedGrade: 0,
    creditCount: 0,
}

function passed(percentage) {
    return percentage >= 40
}

function setData() {
    data = {
        allPassed: false,
        weightedGrade: 0,
        creditCount: 0
    };

    let currentGrade = 0
    for (const grade of grades) {
        const pass = passed(grade.percentage)

        if (!pass) data.allPassed = false;
        else data.creditCount += grade.credits

        currentGrade += grade.percentage * (grade.credits / 10)
    }

    data.weightedGrade = currentGrade / grades.length
}

function meetsWeighted(percentage) {
    return data.weightedGrade >= percentage
}

function meetsMinCredits(minCredits) {
    return data.creditCount >= minCredits
}

function passedAll() {
    return data.allPassed
}

function atLeastXatY(credits, percentage) {
    let metCredits = 0
    for (const grade of grades) {
        if (grade.percentage >= percentage) metCredits += grade.credits
    }

    return metCredits >= credits
}

const boxes = [
    [
        {check: passedAll(), title: "Pass marks in all modules?"}
    ],
    [
        {check: meetsWeighted(50), title: "Weighted stage average of at least 50%"},
        {check: meetsMinCredits(100), title: "At least 100 credits of pass"}
    ],
    [
        {check: meetsWeighted(45), title: "Weighted stage average of at least 45%"},
        {check: meetsMinCredits(90), title: "At least 90 credits of pass"},
        {check: atLeastXatY(110, 30), title: "At least 110 credits at 30% or above"}
    ],
    [
        {check: meetsWeighted(40), title: "Weighted stage average of at least 40%"},
        {check: meetsMinCredits(80), title: "At least 80 credits of pass"},
        {check: atLeastXatY(120, 30), title: "At least 120 credits at 30% or above"}
    ]
]


function setupBoxes() {
    const boxesDiv = document.getElementById("boxes")

    for (const boxesList of boxes) {
        const boxesRow = document.createElement("div")
        boxesRow.className = "boxRow"

        for (let i = 0; i < boxesList.length; i++) {
            const box = boxesList[i]
            const boxDiv = document.createElement("div")
            boxDiv.className = "box"
            boxDiv.innerText = box.title

            boxesRow.appendChild(boxDiv)
        }

        boxesDiv.appendChild(boxesRow)
    }
}

function create_grade_box(title, percentage, credits) {
    const box = document.createElement("div")
    box.className = "GradeBox"

    const titleDiv = document.createElement("div")
    titleDiv.className = "GradeBoxEntry";

    const titleTitle = document.createElement("p")
    titleTitle.innerText = "Module: "
    titleDiv.appendChild(titleTitle)
    titleDiv.width = "100%"

    const titleText = document.createElement("p")
    titleText.contentEditable = true
    titleText.innerText = title
    titleDiv.appendChild(titleText)

    const percentageDiv = document.createElement("div")
    percentageDiv.className = "GradeBoxEntry";

    const percentageTitle = document.createElement("p")
    percentageTitle.innerText = "%age: "
    percentageDiv.appendChild(percentageTitle)

    const percentageText = document.createElement("p")
    percentageText.contentEditable = true
    percentageText.innerText = percentage
    percentageDiv.appendChild(percentageText)

    const creditsDiv = document.createElement("div")
    creditsDiv.className = "GradeBoxEntry";

    const creditsTitle = document.createElement("p")
    creditsTitle.innerText = "Credits: "
    creditsDiv.appendChild(creditsTitle)

    const creditsText = document.createElement("p")
    creditsText.contentEditable = true
    creditsText.innerText = credits
    creditsDiv.appendChild(creditsText)

    box.append(titleDiv, percentageDiv, creditsDiv)

    return box
}

function addGrade() {
    const moduleName = document.getElementById("gradeTitle")?.value
    const percentage = document.getElementById("gradePercentage")?.value
    const credits = document.getElementById("gradeCredits")?.value

    grades.push({percentage: percentage, credits: credits})

    const gradeEntries = document.getElementById("gradeEntries")

    gradeEntries.appendChild(create_grade_box(moduleName, percentage, credits))
}

window.onload = async function () {
    setupBoxes()

    document.getElementById("GradeEntryFormSubmit").addEventListener("click", function() {
        addGrade()
    })
}

