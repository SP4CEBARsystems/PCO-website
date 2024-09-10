window.addEventListener("DOMContentLoaded", init(), false);

function init(){
    setProgressMeter();
}

function setProgressMeter() {
    const courseElements = document.querySelectorAll(".course");
    for(const courseElement of courseElements){
        checkCoursePassed(courseElement);
    }
    const progressMeter = document.getElementById("progressMeter");
    progressMeter.value = 5;
}

function checkCoursePassed(courseElement) {
    const gradeElements = courseElement.querySelectorAll(".grade");
    let averageGrade = new weightedValue(0, 0);
    for (const gradeElement of gradeElements) {
        const newGrade = loadNewGrade(gradeElement);
        averageGrade = addToWeightedAverage(newGrade, averageGrade);
    }
    const isCoursePassed = averageGrade.value >= 5.5;
    return isCoursePassed;
}

function loadNewGrade(gradeElement) {
    const grade  = parseFloat(gradeElement.getElementById("grade").innerHTML);
    const weight = parseFloat(gradeElement.getElementById("weight").innerHTML);
    return new weightedValue(grade, weight);
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