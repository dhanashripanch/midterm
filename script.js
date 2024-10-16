document.addEventListener("DOMContentLoaded", function () {
    const petForm = document.getElementById("pet-form");
    const careLogForm = document.getElementById("care-log-form");
    const petSelect = document.getElementById("care-pet");
    const reminderList = document.getElementById("reminder-list");
    const petProfiles = document.getElementById("pet-grid");

    let pets = [];
    let reminders = [];

    // Initialize default pets
    const defaultPets = [
        {
            name: "Buddy",
            breed: "Siberian Husky",
            age: 3,
            imageUrl: "husky.jpeg"
        },
        {
            name: "Mittens",
            breed: "Tabby Cat",
            age: 1,
            imageUrl: "tabby_cat.jpg"
        },
        {
            name: "Coco",
            breed: "Cockatiel",
            age: 1,
            imageUrl: "cockatiel.png"
        }
    ];

    // Display default pets
    function displayDefaultPets() {
        defaultPets.forEach(pet => {
            pets.push(pet); // Add default pets to pets array
            updatePetSelect(pet); // Update pet select dropdown
            displayPetProfile(pet); // Display pet profiles
        });
    }

    function updateDashboard() {
        // Update the dashboard with total pets and reminders counts
        // If you have totalPets and totalReminders elements, you can update them here
    }

    petForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const petName = document.getElementById("pet-name").value;
        const petBreed = document.getElementById("pet-breed").value;
        const petAge = document.getElementById("pet-age").value;
        const petImage = document.getElementById("pet-image").files[0];

        if (petImage) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const pet = {
                    name: petName,
                    breed: petBreed,
                    age: petAge,
                    imageUrl: e.target.result
                };
                pets.push(pet);
                updatePetSelect(pet);
                displayPetProfile(pet);
                updateDashboard();
            };
            reader.readAsDataURL(petImage);
        }

        petForm.reset();
    });

    function updatePetSelect(pet) {
        const option = document.createElement("option");
        option.value = pet.name;
        option.textContent = pet.name;
        petSelect.appendChild(option);
    }

    function displayPetProfile(pet) {
        const profile = document.createElement("div");
        profile.className = "pet-profile";
        
        const img = document.createElement("img");
        img.src = pet.imageUrl;
        img.alt = pet.name;
    
        const petInfo = document.createElement("div");
        petInfo.innerHTML = `<h4>${pet.name}</h4>
                             <p>Breed: ${pet.breed}</p>
                             <p>Age: ${pet.age} years</p>`;
    
        profile.appendChild(img);
        profile.appendChild(petInfo);
        
        // Create a div for reminders
        const reminderSection = document.createElement("div");
        reminderSection.className = "pet-reminders"; // You can style this in your CSS if needed
        reminderSection.id = `reminder-${pet.name}`; // Unique ID for each pet's reminder section
        
        profile.appendChild(reminderSection);
        
        const petGrid = document.getElementById("pet-grid");
        petGrid.appendChild(profile);
    }
    
    // Update the way reminders are stored
    careLogForm.addEventListener("submit", function (event) {
        event.preventDefault();
    
        const petName = petSelect.value;
        const careActivity = document.getElementById("care-activity").value;
        const reminderDatetime = document.getElementById("reminder-datetime").value;
    
        const reminder = {
            petName,
            careActivity,
            reminderDatetime
        };
    
        // Initialize the pet reminders array if it doesn't exist
        if (!reminders[petName]) {
            reminders[petName] = [];
        }
        reminders[petName].push(reminder);
        
        displayReminder(reminder);
        updateDashboard();
    
        careLogForm.reset();
    });
    
    // Update this function to display reminders under respective pets
    function displayReminder(reminder) {
        const petReminderSection = document.getElementById(`reminder-${reminder.petName}`);
        
        const reminderDiv = document.createElement("div");
        reminderDiv.textContent = `${reminder.careActivity} - ${new Date(reminder.reminderDatetime).toLocaleString()}`;
        petReminderSection.appendChild(reminderDiv);
    }

    // Display default pets on page load
    displayDefaultPets();
});
