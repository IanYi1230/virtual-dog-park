// The breed information stays in HTML so it works even without JavaScript.
// This small extra feature introduces a randomly selected dog.
const dogCards = document.querySelectorAll('.dog-card');
const surpriseButton = document.querySelector('#surprise-button');
const discoveryMessage = document.querySelector('#discovery-message');
let previousIndex = -1;

document.querySelector('#discovery').hidden = false;

surpriseButton.addEventListener('click', function () {
  // Avoid picking the same dog twice in a row.
  let nextIndex = Math.floor(Math.random() * dogCards.length);
  if (nextIndex === previousIndex) {
    nextIndex = (nextIndex + 1) % dogCards.length;
  }
  previousIndex = nextIndex;

  dogCards.forEach(function (card) {
    card.classList.remove('is-picked');
  });

  const chosenCard = dogCards[nextIndex];
  const dogName = chosenCard.querySelector('h3').textContent;
  chosenCard.classList.add('is-picked');
  discoveryMessage.textContent = 'Meet the ' + dogName + '! Your next park friend is highlighted above.';

  // Move keyboard focus as well as the view to the selected dog.
  chosenCard.focus({ preventScroll: true });
  chosenCard.scrollIntoView({ block: 'start' });
});

// Keep the adopted dog's information together in one simple object.
let virtualDog = null;
const storageKey = 'virtualDogParkPetV1';
const adoptionForm = document.querySelector('#adoption-form');
const nameInput = document.querySelector('#dog-name');
const breedInput = document.querySelector('#dog-breed');
const nameError = document.querySelector('#name-error');
const petMessage = document.querySelector('#pet-message');
const petPanel = document.querySelector('#pet-panel');
const storageMessage = document.querySelector('#storage-message');
const breedImages = {
  'Beagle': 'assets/beagle.svg',
  'Golden Retriever': 'assets/golden-retriever.svg',
  'Poodle': 'assets/poodle.svg'
};

function adoptDog(event) {
  event.preventDefault();
  const name = nameInput.value.trim();

  if (name.length === 0 || name.length > 20) {
    nameError.textContent = name.length === 0
      ? 'Please enter a dog name, not just spaces.'
      : 'Please use a dog name with 20 characters or fewer.';
    nameInput.setAttribute('aria-invalid', 'true');
    nameInput.focus();
    return;
  }

  nameError.textContent = '';
  nameInput.removeAttribute('aria-invalid');
  virtualDog = {
    name: name,
    breed: breedInput.value,
    day: 1,
    happiness: 50
  };

  saveDog();
  updateDogDisplay();
  petMessage.textContent = 'Welcome to the park! Feed or play to add 10 happiness.';
  document.querySelector('#pet-name').focus();
}

function updateDogDisplay() {
  adoptionForm.hidden = virtualDog !== null;
  petPanel.hidden = virtualDog === null;
  if (virtualDog === null) {
    return;
  }

  // textContent displays names literally, even if they contain HTML characters.
  document.querySelector('#pet-name').textContent = virtualDog.name;
  document.querySelector('#pet-breed').textContent = virtualDog.breed;
  document.querySelector('#pet-day').textContent = virtualDog.day;
  document.querySelector('#pet-stage').textContent = getGrowthStage(virtualDog.day);
  document.querySelector('#pet-happiness').textContent = virtualDog.happiness;
  const growthBar = document.querySelector('#pet-growth');
  growthBar.value = Math.min(virtualDog.day, 4);
  growthBar.textContent = growthBar.value + ' / 4';
  const petImage = document.querySelector('#pet-image');
  petImage.src = breedImages[virtualDog.breed];
  petImage.alt = 'Illustration of a ' + virtualDog.breed + '.';
}

function increaseHappiness() {
  if (virtualDog === null) {
    return;
  }

  // Math.min chooses the smaller number, so happiness cannot go above 100.
  virtualDog.happiness = Math.min(100, virtualDog.happiness + 10);
  saveDog();
  updateDogDisplay();
  petMessage.textContent = virtualDog.happiness === 100
    ? 'Happiness is 100 / 100. Your dog is as happy as can be!'
    : 'Your dog enjoyed that! Happiness is now ' + virtualDog.happiness + ' / 100.';
}

function getGrowthStage(day) {
  if (day === 1) {
    return 'Puppy';
  }
  if (day <= 3) {
    return 'Young Dog';
  }
  return 'Adult Dog';
}

function nextDay() {
  if (virtualDog === null) {
    return;
  }

  virtualDog.day += 1;
  virtualDog.happiness = Math.max(0, virtualDog.happiness - 5);
  saveDog();
  updateDogDisplay();
  petMessage.textContent = 'Day ' + virtualDog.day + ': ' + getGrowthStage(virtualDog.day)
    + '. Happiness is ' + virtualDog.happiness + ' / 100.';
}

function saveDog() {
  // One key holds one dog's four values as a JSON string.
  try {
    localStorage.setItem(storageKey, JSON.stringify(virtualDog));
    storageMessage.textContent = 'Progress saved in this browser on this device.';
  } catch (error) {
    storageMessage.textContent = 'Your browser could not save progress. You can still play, but changes may be lost on refresh.';
  }
}

function restoreDog() {
  try {
    const savedText = localStorage.getItem(storageKey);
    if (savedText === null) {
      return;
    }

    const savedDog = JSON.parse(savedText);
    // Check saved data before using it, in case it was damaged or edited.
    if (!savedDog || typeof savedDog.name !== 'string'
      || savedDog.name.trim().length === 0 || savedDog.name.trim().length > 20
      || !Object.keys(breedImages).includes(savedDog.breed)
      || !Number.isSafeInteger(savedDog.day) || savedDog.day < 1
      || !Number.isInteger(savedDog.happiness) || savedDog.happiness < 0 || savedDog.happiness > 100) {
      storageMessage.textContent = 'Saved progress is invalid. Please adopt a new dog to start a fresh save.';
      return;
    }

    virtualDog = {
      name: savedDog.name.trim(),
      breed: savedDog.breed,
      day: savedDog.day,
      happiness: savedDog.happiness
    };
    updateDogDisplay();
    petMessage.textContent = 'Welcome back! Your dog is ready for another day at the park.';
  } catch (error) {
    storageMessage.textContent = 'Saved progress could not be restored. You can still adopt and play with a new dog.';
  }
}

function startOver() {
  if (virtualDog === null || !window.confirm('Start over? This will delete your saved dog and all their progress.')) {
    return;
  }

  try {
    // Remove only our dog's entry, keeping other browser data untouched.
    localStorage.removeItem(storageKey);
  } catch (error) {
    storageMessage.textContent = 'Saved progress could not be deleted. Please allow browser storage and try again.';
    return;
  }

  virtualDog = null;
  adoptionForm.reset();
  nameError.textContent = '';
  nameInput.removeAttribute('aria-invalid');
  petMessage.textContent = '';
  updateDogDisplay();
  storageMessage.textContent = 'Progress cleared. Choose a breed and adopt a new friend.';
  nameInput.focus();
}

adoptionForm.addEventListener('submit', adoptDog);
document.querySelector('#feed-button').addEventListener('click', increaseHappiness);
document.querySelector('#play-button').addEventListener('click', increaseHappiness);
document.querySelector('#next-day-button').addEventListener('click', nextDay);
document.querySelector('#start-over-button').addEventListener('click', startOver);
restoreDog();
