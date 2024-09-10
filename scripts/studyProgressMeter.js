
function setProgressMeter() {
    const progressMeter = document.getElementById("progressMeter");
    progressMeter.value = 5;

    const gradesElements = document.querySelectorAll(".grade")
    gradesElements.map(gradeElement => {
        const passed = gradeElement.innerHTML >= 5.5;
    });
}