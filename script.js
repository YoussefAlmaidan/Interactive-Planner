// script.js
const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// This code goes in the script.js file at the beginning or after the calendar functions
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('header').addEventListener('click', function(event) {
        if (event.target.id === 'nextMonth') {
            if (currentMonth === 11) {
                currentMonth = 0;
                currentYear++;
            } else {
                currentMonth++;
            }
            generateCalendar(currentMonth, currentYear);
        } else if (event.target.id === 'prevMonth') {
            if (currentMonth === 0) {
                currentMonth = 11;
                currentYear--;
            } else {
                currentMonth--;
            }
            generateCalendar(currentMonth, currentYear);
        }
    });

    generateCalendar(new Date().getMonth(), new Date().getFullYear()); // Initial calendar generation
});

document.getElementById('monthYear').addEventListener('click', function() {
    var picker = document.getElementById('monthYearPicker');
    picker.classList.toggle('show'); // Toggle visibility of the picker
});

function updateCalendar() {
    var monthSelect = document.getElementById('monthSelect');
    var yearInput = document.getElementById('yearInput');
    currentMonth = parseInt(monthSelect.value);
    currentYear = parseInt(yearInput.value);
    generateCalendar(currentMonth, currentYear);
    document.getElementById('monthYearPicker').classList.remove('show'); // Hide picker after update
}


// Enhanced script.js for generating calendar with past days grayed out
function generateCalendar(month, year) {
    const today = new Date();
    const currentDate = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const firstDay = new Date(year, month).getDay(); // This gets the first day as Sunday (0) to Saturday (6)
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Last day of this month

    const calendar = document.getElementById('calendar');
    calendar.innerHTML = ''; // Clear existing calendar
    document.querySelector('header h1').textContent = `${monthNames[month]} ${year}`;

    // Create headers for each day
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    for (let i = 0; i < dayNames.length; i++) {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'day-header';
        dayHeader.textContent = dayNames[i];
        calendar.appendChild(dayHeader);
    }

    // Adjust to start the calendar on Monday
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1; // Adjust to make Monday (0)

    for (let i = 0; i < adjustedFirstDay; i++) {
        calendar.appendChild(document.createElement('div')); // Padding for first row
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day-cell'; // Add class for styling day cells
        const dayNumber = document.createElement('span');
        dayNumber.classList.add('day-number');
        dayNumber.textContent = day;
        dayDiv.appendChild(dayNumber);

        // Apply classes based on date comparisons
        if (year < currentYear || (year === currentYear && month < currentMonth) || (year === currentYear && month === currentMonth && day < currentDate)) {
            dayDiv.classList.add('past-day'); // Style past days without disabling interactions
        } else if (day === currentDate && month === currentMonth && year === currentYear) {
            dayDiv.classList.add('today'); // Highlight today's date
        }

        const planKey = `${day}-${month}-${year}`;
        const plan = localStorage.getItem(planKey);
        if (plan) {
            const planPreview = document.createElement('div');
            planPreview.classList.add('plan-preview');
            planPreview.textContent = plan;
            planPreview.setAttribute('data-plan', plan); // Tooltip full plan text
            dayDiv.appendChild(planPreview);
        }

        dayDiv.addEventListener('click', () => showAddPlanModal(day, month, year));
        calendar.appendChild(dayDiv);
    }
}


generateCalendar(new Date().getMonth(), new Date().getFullYear());


function showAddPlanModal(day, month, year) {
    const modal = document.getElementById('modal');
    const planKey = `${day}-${month}-${year}`;
    const existingPlan = localStorage.getItem(planKey);
    
    document.getElementById('planInput').value = existingPlan || '';
    document.getElementById('modal').classList.remove('hidden');
    document.getElementById('savePlan').onclick = () => {
        localStorage.setItem(planKey, document.getElementById('planInput').value);
        modal.classList.add('hidden');
        generateCalendar(currentMonth, currentYear); // Refresh the calendar to show the new/updated plan
    };
}

function exportToCSV() {
    const keys = Object.keys(localStorage);
    const csvRows = ['date,plan']; // Header for CSV file
    keys.forEach(key => {
        if(key.includes('-')) { // Check to include only date keys
            const value = localStorage.getItem(key);
            const data = `${key},${value.replace(/,/g, ';')}`; // Convert commas to semicolons in data to maintain CSV integrity
            csvRows.push(data);
        }
    });
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'calendar_data.csv';
    link.click();
    URL.revokeObjectURL(url);
}

document.getElementById('exportCSV').addEventListener('click', exportToCSV);

function importFromCSV(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        const text = e.target.result;
        const rows = text.split('\n');
        rows.forEach((row, index) => {
            if (index === 0) return; // Skip header
            const [date, plan] = row.split(',');
            localStorage.setItem(date, plan.replace(/;/g, ',')); // Convert semicolons back to commas
        });
        // Re-render calendar to reflect imported data
        generateCalendar(new Date().getMonth(), new Date().getFullYear());
    };
    reader.readAsText(file);
}

document.getElementById('importCSV').addEventListener('change', importFromCSV);


document.getElementById('nextMonth').addEventListener('click', () => {
    if (currentMonth === 11) {
        currentMonth = 0;
        currentYear++;
    } else {
        currentMonth++;
    }
    generateCalendar(currentMonth, currentYear);
});

document.getElementById('prevMonth').addEventListener('click', () => {
    if (currentMonth === 0) {
        currentMonth = 11;
        currentYear--;
    } else {
        currentMonth--;
    }
    generateCalendar(currentMonth, currentYear);
});

document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('modal').classList.add('hidden');
});

generateCalendar(currentMonth, currentYear);
