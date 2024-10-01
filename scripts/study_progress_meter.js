window.addEventListener("DOMContentLoaded", init(), false);

function init() {
    loadGrades();
    studyProgressMeter();
    addEventListenerByquerySelectorAll("change", ".grade", updateGrades);
}

function updateGrades() {
    studyProgressMeter();
    saveGrades();
}

function loadGrades() {
    const loadedGrades = localStorage.getItem("examGrades");
    if (loadedGrades === undefined || loadedGrades === null) return;
    const grades = document.querySelectorAll(".grade");

    for(const gradeIndex in grades){
        const loadedGrade = loadedGrades[gradeIndex];
        grades[gradeIndex].value = loadedGrade !== undefined ? 1 : loadedGrade;
    }
}

function saveGrades() {
    let savedGrades = [];
    const grades = document.querySelectorAll(".grade");
    for(const gradeIndex in grades){
        savedGrades.push(grades[gradeIndex].value);
    }
    localStorage.setItem("examGrades", savedGrades);
}


function addEventListenerByquerySelectorAll(type, query, eventFunction) {
    const inputs = document.querySelectorAll(query);
    console.log("attached event", inputs);
    for(let input of inputs) {
        input.addEventListener(type, eventFunction);
    }
}

function studyProgressMeter() {
    console.log("studyProgressMeter");
    setProgressMeter();

    function setProgressMeter() {
        const creditsEarned = getTotalCreditsEarned();
        const progressMeter = document.getElementById("progressMeter");
        const progressValue = document.getElementById("progressValue");
        progressMeter.value = creditsEarned;
        progressValue.innerHTML = creditsEarned;
    }

    function getTotalCreditsEarned() {
        let totalCreditsEarned = 0;
        const courseElements = document.querySelectorAll(".course");
        if(courseElements === null) return totalCreditsEarned;
        for (const courseElement of courseElements) {
            totalCreditsEarned += getCourseCreditsEarned(courseElement);
        }
        console.log("totalCreditsEarned", totalCreditsEarned);
        return totalCreditsEarned;
    }

    function getCourseCreditsEarned(courseElement) {
        const isCoursePassed = checkCoursePassed(courseElement);
        const credits = getFloatFromQuerySelector(courseElement, ".credits");
        const creditsEarned = isCoursePassed ? credits : 0;
        console.log("creditsEarned", creditsEarned);
        return creditsEarned;
    }

    function checkCoursePassed(courseElement) {
        const isCoursePassed = getCourseGrade(courseElement) >= 5.5;
        applyPassed(isCoursePassed, courseElement);
        return isCoursePassed;
    }

    function getCourseGrade(courseElement) {
        const examElements = courseElement.querySelectorAll(".exam");
        let averageGrade = new weightedValue(0, 0);
        if (examElements === null) return averageGrade.value;
        for (const examElement of examElements) {
            const newGrade = loadNewGrade(examElement);
            console.log("newGrade",newGrade);
            averageGrade = addToWeightedAverage(newGrade, averageGrade);
        }
        console.log("averageGrade.value", averageGrade.value);
        return averageGrade.value;
    }

    function loadNewGrade(examElement) {
        const grade  = getFloatFromQuerySelectorInput(examElement, ".grade");
        const weight = getFloatFromQuerySelector(examElement, ".weight");
        applyPassed(grade >= 5.5, examElement);
        return new weightedValue(grade, weight);
    }

    function applyPassed(isPassed, element) {
        element.classList.remove("passed", "failed", "active");
        element.classList.add(isPassed ? "passed" : "failed");
    }

    function getFloatFromQuerySelector(parent, query) {
        if(parent===null || parent===undefined) return null;
        const element = parent.querySelector(query);
        if(element===null) return null;
        const number = parseFloat( element.innerHTML );
        if(number===NaN) return null;
        return number;
    }

    function getFloatFromQuerySelectorInput(parent, query) {
        if(parent===null || parent===undefined) return null;
        const element = parent.querySelector(query);
        if(element===null) return null;
        const number = parseFloat( element.value );
        if(number===NaN) return null;
        return number;
    }

    function addToWeightedAverage(newValue, averageValue) {
        averageValue.weight += newValue.weight;
        if (averageValue.weight == 0) return averageValue;
        const significance = newValue.weight / averageValue.weight;
        averageValue.value += (newValue.value - averageValue.value) * significance;
        return averageValue;
    }

    function weightedValue(value, weight) {
        this.value = value;
        this.weight = weight;
    }
}