// Function to check which page we're on
function getCurrentPage() {
  const path = window.location.pathname;
  if (path.includes('add-pet.html')) return 'add-pet';
  if (path.includes('set-reminders.html')) return 'set-reminders';
  return 'index';
}

document.addEventListener("DOMContentLoaded", function () {
  const currentPage = getCurrentPage();

  // Common elements
  const petSelect = document.getElementById("care-pet");

  // Page-specific elements
  const petForm = currentPage === 'add-pet' ? document.getElementById("pet-form") : null;
  const careLogForm = currentPage === 'set-reminders' ? document.getElementById("care-log-form") : null;
  const petProfiles = currentPage === 'index' ? document.getElementById("pet-grid") : null;

  let pets = JSON.parse(localStorage.getItem('pets')) || [];
  let reminders = JSON.parse(localStorage.getItem('reminders')) || {};

  // Initialize default pets if pets array is empty
  if (pets.length === 0) {
    const defaultPets = [
      { name: "Buddy", breed: "Siberian Husky", age: 2, imageUrl: "husky.jpeg" },
      { name: "Mittens", breed: "Tabby Cat", age: 1, imageUrl: "tabby_cat.jpg" },
      { name: "Coco", breed: "Cockatiel", age: 1, imageUrl: "cockatiel.png" },
      { name: "Golden", breed: "Golden Retriever", age: 2, imageUrl: "golden-retriever.avif" }
    ];
    pets = defaultPets;
    savePets();
  }

  function savePets() {
    localStorage.setItem('pets', JSON.stringify(pets));
  }

  function saveReminders() {
    localStorage.setItem('reminders', JSON.stringify(reminders));
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
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-pet";
    deleteButton.setAttribute("data-pet-name", pet.name);
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    profile.appendChild(img);
    profile.appendChild(petInfo);
    profile.appendChild(deleteButton);
    const reminderSection = document.createElement("div");
    reminderSection.className = "pet-reminders";
    reminderSection.id = `reminder-${pet.name}`;
    profile.appendChild(reminderSection);
    petProfiles.appendChild(profile);
  }

  function displayReminder(reminder) {
    const petReminderSection = document.getElementById(`reminder-${reminder.petName}`);
    if (petReminderSection) {
      const reminderDiv = document.createElement("div");
      reminderDiv.textContent = `${reminder.careActivity} - ${new Date(reminder.reminderDatetime).toLocaleString()}`;
      petReminderSection.appendChild(reminderDiv);
    }
  }

  function updatePetSelect(pet) {
    if (petSelect) {
      const option = document.createElement("option");
      option.value = pet.name;
      option.textContent = pet.name;
      petSelect.appendChild(option);
    }
  }

  function clearReminderForm() {
    if (careLogForm) {
      careLogForm.reset();
      document.getElementById("care-activity").selectedIndex = 0;
    }
  }

  function displayAllPets() {
    if (petProfiles) {
      petProfiles.innerHTML = '';
      pets.forEach(pet => {
        displayPetProfile(pet);
        if (reminders[pet.name]) {
          reminders[pet.name].forEach(reminder => displayReminder(reminder));
        }
      });
    }
  }

  function populatePetSelect() {
    if (petSelect) {
      petSelect.innerHTML = '';
      pets.forEach(pet => updatePetSelect(pet));
    }
  }

  function checkAndShowReminders() {
    const currentDate = new Date();
    let updatedReminders = {};
    let reminderShown = false;
    let remindersChanged = false;

    for (let petName in reminders) {
      updatedReminders[petName] = reminders[petName].filter(reminder => {
        const reminderDate = new Date(reminder.reminderDatetime);
        if (reminderDate <= currentDate) {
          if (!reminderShown) {
            alert(`Reminder for ${petName}: ${reminder.careActivity} is due!`);
            reminderShown = true;
          }
          remindersChanged = true;
          return false; // This will remove the reminder
        }
        return true;
      });

      if (updatedReminders[petName].length === 0) {
        delete updatedReminders[petName];
        remindersChanged = true;
      }
    }

    if (remindersChanged) {
      reminders = updatedReminders;
      saveReminders();
      if (currentPage === 'index') {
        updateRemindersDisplay();
      }
    }
  }

  function updateRemindersDisplay() {
    pets.forEach(pet => {
      const reminderSection = document.getElementById(`reminder-${pet.name}`);
      if (reminderSection) {
        reminderSection.innerHTML = ''; // Clear existing reminders
        if (reminders[pet.name]) {
          reminders[pet.name].forEach(reminder => {
            const reminderDiv = document.createElement("div");
            reminderDiv.textContent = `${reminder.careActivity} - ${new Date(reminder.reminderDatetime).toLocaleString()}`;
            reminderSection.appendChild(reminderDiv);
          });
        }
      }
    });
  }

  function deletePet(petName) {
    if (confirm(`Are you sure you want to delete ${petName}?`)) {
      pets = pets.filter(pet => pet.name !== petName);
      delete reminders[petName];
      savePets();
      saveReminders();
      displayAllPets();
      populatePetSelect();
    }
  }

  // Set up a timer to check reminders every 10 seconds
  setInterval(checkAndShowReminders, 10000);

  // Page-specific code
  if (currentPage === 'index') {
    displayAllPets();
    petProfiles.addEventListener('click', function(e) {
      if (e.target.classList.contains('delete-pet') || e.target.closest('.delete-pet')) {
        const petName = e.target.closest('.delete-pet').getAttribute('data-pet-name');
        deletePet(petName);
      }
    });
  } else if (currentPage === 'add-pet') {
    if (petForm) {
      petForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const petName = document.getElementById("pet-name").value;
        const petBreed = document.getElementById("pet-breed").value;
        const petAge = document.getElementById("pet-age").value;
        const petImage = document.getElementById("pet-image").files[0];
        if (petImage) {
          const reader = new FileReader();
          reader.onload = function (e) {
            const pet = { name: petName, breed: petBreed, age: petAge, imageUrl: e.target.result };
            pets.push(pet);
            savePets();
            alert("Pet added successfully!");
            window.location.href = 'index.html'; // Redirect to dashboard
          };
          reader.readAsDataURL(petImage);
        }
      });
    }
  } else if (currentPage === 'set-reminders') {
    populatePetSelect();
    // Set minimum date for reminder
    const reminderDatetimeInput = document.getElementById("reminder-datetime");
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    reminderDatetimeInput.min = now.toISOString().slice(0, 16);

    if (careLogForm) {
      careLogForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const petName = petSelect.value;
        const careActivity = document.getElementById("care-activity").value;
        const reminderDatetime = new Date(document.getElementById("reminder-datetime").value);
        // Check if the selected date is in the future
        if (reminderDatetime <= new Date()) {
          alert("Please select a future date and time for the reminder.");
          return;
        }
        const reminder = { petName, careActivity, reminderDatetime: reminderDatetime.toISOString() };
        if (!reminders[petName]) {
          reminders[petName] = [];
        }
        reminders[petName].push(reminder);
        saveReminders();
        clearReminderForm();
        alert("Reminder set successfully!");
        window.location.href = 'index.html'; // Redirect to dashboard
      });
    }
  }

  // Initial check for due reminders
  checkAndShowReminders();
});