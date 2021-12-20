const dateRanges = [
    // 2021
    [new Date(2021, 8, 21), new Date(2021, 11, 11)],
    [new Date(2022, 0, 3), new Date(2022, 2, 19)], // Winter break
    [new Date(2022, 2, 28), new Date(2022, 5, 10)] // Spring break
];
var firstDay = dateRanges[0][0];
var lastDay = dateRanges[dateRanges.length - 1][1];

// Converts day into int value, with 1 as the first date in dateRanages array
function daysFromSchoolStart(date, firstDay) {
    return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate())) / 24 / 60 / 60 / 1000; 
}

// Takes list of normal date ranges and an empty list -> turns that empty list into a list of date ranges in int form
function daysFromSchoolStartList(dateRanges, dateRangesInt) {
    for (let i = 0; i < dateRanges.length; i++) {
        const row = [];
        row.push(daysFromSchoolStart(dateRanges[i][0], dateRanges[0][0])); // Start of range
        row.push(daysFromSchoolStart(dateRanges[i][1], dateRanges[0][0])); // End of range
        dateRangesInt.push(row);
    }
}

// Appends int school days to a list of school days
function schoolDaysListFromRangesInt(dateRangesInt, schoolDaysList) {
    for (let i = 0; i < dateRangesInt.length; i++){
        // Iternates through each day in within each range
        for (let j = dateRangesInt[i][0]; j <= dateRangesInt[i][1]; j++) {
            schoolDaysList.push(j);
        }
    }
}

const dateRangesInt = [];
daysFromSchoolStartList(dateRanges, dateRangesInt);
const schoolDaysList = [];
schoolDaysListFromRangesInt(dateRangesInt, schoolDaysList);

// Format date into mm/dd/yyyy format (for display)
function dateFormat(date) {
    return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
}

// Calculate dollars left based on how many days of school are left
function calculateDollars() {
    var dollars = document.getElementById("dollars").value;
    // Round user input to 2 decimal places
    dollars = (Math.round((dollars) * 1e2)/1e2).toFixed(2);
    
    // Check if user inputted a number    
    if (!(!isNaN(dollars) && !isNaN(parseFloat(dollars)))) {
        // document.getElementById("result").innerHTML = "Error: Input must be a number.";
        alert("Error: Input must be a number.");
        return 1;
    }
    
    var today = new Date();
    var currentDay = daysFromSchoolStart(today, firstDay); // "currentDay" is int version of "today"

    // If current day is before first day of school, set currentDay to 1st day of school
    if (currentDay < 0) {
        currentDay = 0;
    }

    // If current day is after last day of school, send message that school is over for the current school year
    else if (currentDay > dateRangesInt[dateRangesInt.length - 1][1]) {
        alert("Error: Current day is after the end of the school year.");
        // document.getElementById("result").innerHTML = "Error: Current day is after the end of the school year.";
        return 1;
    }

    // Because the days before 1st and after last day of school are taken care of, any day that isn't in the list has to be on a break
    var currentDayIndex = schoolDaysList.indexOf(currentDay);

    // If current day is during a break, sets current day to the first day of when school resumes
    if (currentDayIndex === -1) {
        // Find which break the current day is in
        // Iterate through list of date ranges
        for (let i = 0; i < (dateRangesInt.length - 1); i++) {
            // if current day is between end day of a range and start day of next range (aka. during a break)
            if (currentDay > dateRangesInt[i][1] && currentDay < dateRangesInt[i+1][0]) {
                currentDay = dateRangesInt[i+1][0];
                currentDayIndex = schoolDaysList.indexOf(currentDay);
                break;
            }
        }
    }

    // Finds number of school days left, including the current day
    var schoolDaysLeft = schoolDaysList.length - (currentDayIndex);
    var result = "$" + (Math.round((dollars / schoolDaysLeft) * 1e2)/1e2).toFixed(2); //toFixed(2) adds extra 0s if the number has less than 2 decimal places
    
    // DISPLAYS RESULTS
    const resultsList = document.getElementsByClassName("results"); // getElementsByClasssNames returns an array
    for (let i = 0; i < resultsList.length; i++) {
        resultsList[i].style.display = "inline";
    }
    // Today is ___.
    document.getElementById("today").innerHTML = dateFormat(today) + ".";
     
    // There are ___ days left until the end of school, which is ___.
    document.getElementById("school-days-left").innerHTML = schoolDaysLeft;
    document.getElementById("last-day").innerHTML = dateFormat(lastDay);

    // If you have ___ left, you can spend ___ each day to have enough for the rest of the school year.
    document.getElementById("og-dollars").innerHTML = dollars;
    document.getElementById("result-dollars").innerHTML = result;

    return 0;
}