document.addEventListener('DOMContentLoaded', function() {
    // Define an array of strings representing the weekdays
    let WeekDays = ["Time", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    // Get the element with ID "agenda"
    let agenda = document.getElementById("agenda");

    // Loop through the WeekDays array
    for (let index = 0; index < WeekDays.length; index++) {
        // Create a new div element and add it to the agenda
        let element = document.createElement("div");
        agenda.appendChild(element);

        // Set the class of the element to "column"
        element.className = "column";
        element.id = WeekDays[index]

        // Create a new div element and add it to the column element
        let row = document.createElement("div");
        row.className = "row";
        element.appendChild(row);

        // Set the id of the row element to "weekday" and its innerHTML to the weekday name
        row.id = "weekday";
        row.innerHTML = `<h1>${WeekDays[index]}</h1>`;

        // Loop through 18 time slots, creating a new row element for each
        /*for (let j = 0; j < 18; j = j + 0.5) {
            let row = document.createElement("div");
            row.className = "row";
            element.appendChild(row);

            // If the current weekday is "Time", set the row's innerHTML to the time slot value
            if (WeekDays[index] === "Time") {
                row.innerHTML = `<p>${String((j - j % 1)+6).padStart(2, '0')}:${String(60 * (j % 1)).padStart(2, '0')}</p>`;
            } else {
                // If the current weekday is not "Time", create an input element and add it to the row
                let input = document.createElement("input");
                input.setAttribute("type", "text");
                row.appendChild(input);

                // Add an event listener to save the input value to local storage when it changes
                input.addEventListener("change", function() {
                    localStorage.setItem(`${WeekDays[index]}-${j}`, input.value);
                });

                // Load the input value from local storage if it exists
                const savedValue = localStorage.getItem(`${WeekDays[index]}-${j}`);
                if (savedValue) {
                    input.value = savedValue;
                }
            }
        }*/

        // If the current weekday is "Time", create a time selection dropdown menu
        if (WeekDays[index] === "Time"){
            // Set the ID of the element to "Time"
            element.id = "Time";
        }
    }

    // Get the weekday element with ID "weekday" within the "Time" element
    const weekdayTimeRow = document.querySelector('#Time #weekday.row');

    // Create a new div element to hold the time selection dropdowns
    const timeSelectDiv = document.createElement("div");
    timeSelectDiv.classList.add("time-select");
    weekdayTimeRow.appendChild( timeSelectDiv);

    //Create button for executing da time adding
    const timeButton = document.createElement("button");
    timeButton.id = "timeButton";
    timeButton.innerHTML = "Add Row";
    
    weekdayTimeRow.appendChild(timeButton);

    // Create a select element for the hours and add options to it
    const hourSelect = document.createElement("select");
    hourSelect.id = "hour-select";
    for (let i = 0; i <= 23; i++) {
        const option = document.createElement("option");
        option.text = i.toString().padStart(2, "0");
        hourSelect.add(option);
    }
    // Create a select element for the minutes and add options to it
    const minuteSelect = document.createElement("select");
    minuteSelect.id = "minute-select";
    for (let i = 0; i <= 59; i++) {
        const option = document.createElement("option");
        option.text = i.toString().padStart(2, "0");
        minuteSelect.add(option);
    }

    const doubleDot = document.createElement('p');
    doubleDot.innerHTML = ':';

    // Add the select elements to the parent div
    timeSelectDiv.appendChild(hourSelect);
    timeSelectDiv.appendChild(doubleDot);
    timeSelectDiv.appendChild(minuteSelect);

    const updateAgenda = () => {
        let existingItems = JSON.parse(localStorage.getItem("myArray")) || [];
      
        for (let j = 0; j < existingItems.length; j++) {
          for (let index = 1; index < WeekDays.length; index++) {
            const weekday = WeekDays[index];
            let weekdayColumn = document.getElementById(weekday);
      
            // Check how many rows are in the column and add a new row if there should be more
            let rowCount = weekdayColumn.querySelectorAll(".row").length;
      
            if (rowCount < j + 2) {
              let row = document.createElement("div");
              row.className = "row";
              weekdayColumn.appendChild(row);
      
              // create an input element and add it to the row
              let input = document.createElement("input");
              input.setAttribute("type", "text");
              row.appendChild(input);
      
              // Add an event listener to save input to local storage when it changes
              input.addEventListener("change", function () {
                localStorage.setItem(`${weekday}-${j}`, input.value);
              });
      
              // Get the input value from local storage if it exists
              const savedValue = localStorage.getItem(`${weekday}-${j}`);
              if (savedValue) {
                input.value = savedValue;
              }
            }
          }
        }

        let timeColumn = document.getElementById('Time');
        let rowCount = timeColumn.querySelectorAll(".row").length;

        // TODO: Fix, each time you click add row button it creates fouble the amount from earlier and it doesnt even start with the correct number of rows 

        for (let index = 0; index < rowCount; index++) {
            const rowValue = existingItems[index];
            
            let row = document.createElement('div');
            let rowContent = document.createElement('p');
            
            row.className = 'row';
            rowContent.innerHTML = rowValue;

            row.appendChild(rowContent);
            timeColumn.appendChild(row); 
        }
      };
      
      
    updateAgenda();

    

    timeButton.addEventListener('click', function() {
        // Create a new item to store in the array
        const newRow = `${hourSelect.value}:${minuteSelect.value}`;
        // Get the items array from local storage, or create a new array if it doesn't exist
        let existingItems = JSON.parse(localStorage.getItem('myArray')) || [];

        // Add the new item to the array
        existingItems.push(newRow);

        const sortTimeSlots = (arr) => {
            let timeSlotsinMinutes = []
            for (let index = 0; index < arr.length; index++) {
                const timeSlot = arr[index];
                let [hour, minute] = timeSlot.split(':');
                timeSlotsinMinutes.push(parseInt(hour)*60 + parseInt(minute));
            }

            timeSlotsinMinutes.sort()
            
            let timeSlotsOrdered = [];
            for (let index = 0; index < timeSlotsinMinutes.length; index++) {
                const timeSlot = timeSlotsinMinutes[index];
                timeSlotsOrdered.push(`${String(Math.floor(timeSlot/60)).padStart(2, '0')}:${String(timeSlot%60).padStart(2, '0')}`)
            }
            
            return timeSlotsOrdered
        }
        if (existingItems) {
            existingItems = sortTimeSlots(existingItems);
            //Save array into local storage
            localStorage.setItem('myArray', JSON.stringify(existingItems));
        }
        updateAgenda();
    });

});