window.addEventListener("DOMContentLoaded", init(), false);

function init() {
    studyProgressMeter();
}

function studyProgressMeter() {
    setProgressMeter();

    function setProgressMeter() {
        const progressMeter = document.getElementById("progressMeter");
        progressMeter.value = getTotalCreditsEarned();
    }

    function getTotalCreditsEarned() {
        let totalCreditsEarned = 0;
        const courseElements = document.querySelectorAll(".course");
        if(courseElements === null) return totalCreditsEarned;
        for (const courseElement of courseElements) {
            totalCreditsEarned += getCourseCreditsEarned(courseElement);
        }
        return totalCreditsEarned;
    }

    function getCourseCreditsEarned(courseElement) {
        const isCoursePassed = checkCoursePassed(courseElement);
        const credits = getFloatFromQuerySelector(courseElement, ".credits");
        const creditsEarned = isCoursePassed ? credits : 0;
        return creditsEarned;
    }

    function checkCoursePassed(courseElement) {
        return getCourseGrade(courseElement) >= 5.5;
    }

    function getCourseGrade(courseElement) {
        const examElements = courseElement.querySelectorAll(".exam");
        let averageGrade = new weightedValue(0, 0);
        if (examElements === null) return averageGrade.value;
        for (const examElement of examElements) {
            const newGrade = loadNewGrade(examElement);
            averageGrade = addToWeightedAverage(newGrade, averageGrade);
        }
        return averageGrade.value;
    }

    function loadNewGrade(examElement) {
        const grade  = getFloatFromQuerySelector(examElement, ".grade");
        const weight = getFloatFromQuerySelector(examElement, ".weight");
        return new weightedValue(grade, weight);
    }

    function getFloatFromQuerySelector(parent, query) {
        if(parent===null || parent===undefined) return null;
        const element = parent.querySelector(query);
        if(element===null) return null;
        const number = parseFloat( element.innerHTML );
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