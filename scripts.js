document.addEventListener('DOMContentLoaded', () => {
    initializeModalControls();
    initializePostStatusButton();
    loadFormDataFromCookie();
    addFormChangeListeners();
});

function initializeModalControls() {
    const openModalBtn = document.getElementById('openModalBtn');
    const metabolismModal = document.getElementById('metabolismModal');
    const closeModalElems = document.querySelectorAll('.close-modal');

    openModalBtn.addEventListener('click', () => metabolismModal.classList.remove('hidden'));
    closeModalElems.forEach(elem => elem.addEventListener('click', () => metabolismModal.classList.add('hidden')));
}

function initializePostStatusButton() {
    const postStatusBtn = document.getElementById('postStatusBtn');
    postStatusBtn.addEventListener('click', () => {
        const status = document.querySelector('p[contenteditable="true"]').innerText;
        alert(`Status Posted: ${status}`);
    });
}

function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

function calculatePointsHautsFaits(age, activityLevel) {
    return Math.floor(age * activityLevel);
}

function updateProgressBar() {
    const progressBar = document.getElementById('mainProgressBar');
    let width = 0;
    setInterval(() => {
        width = (width >= 100) ? 0 : width + 1;
        progressBar.style.width = width + '%';
    }, 100);
}

function calculateRemainingLifePercentage(age, lifeExpectancy) {
    const remainingLifePercentage = ((lifeExpectancy - age) / lifeExpectancy) * 100;
    return remainingLifePercentage.toFixed(2);
}

function updateAgeProgressBar(age, chromosome) {
    const lifeExpectancy = (chromosome === 'XY') ? 76 : 81;
    const agePercentage = ((age / lifeExpectancy) * 100).toFixed(2);
    const ageProgressBarContainer = document.getElementById('ageProgressBarContainer');
    ageProgressBarContainer.innerHTML = `
        <p class="text-center text-white">(${agePercentage}%) ${age} / ${lifeExpectancy}</p>
        <div class="rounded bg-green-500 h-2 mt-2">
            <div class="h-full bg-green-700" style="width: ${agePercentage}%;"></div>
        </div>
    `;
}

function saveFormDataToCookie() {
    const formData = {
        prenom: document.getElementById('prenom').value,
        nom: document.getElementById('nom').value,
        contact: document.getElementById('contact').value,
        dob: document.getElementById('dob').value,
        chromosome: document.getElementById('chromosome').value,
        mbti: document.getElementById('mbti-select').value,
        height: document.getElementById('height').value,
        weight: document.getElementById('weight').value,
        activity: parseFloat(document.getElementById('activity-level').value)
    };
    document.cookie = `formData=${JSON.stringify(formData)}; path=/`;
    displayFormData(formData);
}

function addFormChangeListeners() {
    const formElements = document.querySelectorAll('#mb-form input, #mb-form select');
    formElements.forEach(element => element.addEventListener('change', saveFormDataToCookie));
}

function getFormDataFromCookie() {
    const cookies = document.cookie.split('; ');
    const formDataCookie = cookies.find(cookie => cookie.startsWith('formData='));
    return formDataCookie ? JSON.parse(formDataCookie.split('=')[1]) : null;
}

function displayFormData(formData) {
    const age = calculateAge(formData.dob);
    const pointsHautsFaits = calculatePointsHautsFaits(age, formData.activity);
    document.getElementById('prenomResult').innerText = formData.prenom;
    document.getElementById('nomResult').innerText = formData.nom;
    document.getElementById('contactResult').innerText = `📞 ${formData.contact}`;
    document.getElementById('dobResult').innerText = `🎂 ${formData.dob}`;
    document.getElementById('chromosomeResult').innerText = `${formData.chromosome === 'XX' ? '👩' : '👨'}`;
    document.getElementById('mbtiResult').innerText = `🧠 ${formData.mbti}`;
    document.getElementById('heightResult').innerText = `📏 ${formData.height} cm`;
    document.getElementById('weightResult').innerText = `⚖️ ${formData.weight} kg`;
    document.getElementById('activityResult').innerText = `🏃 ${formData.activity}`;
    document.getElementById('points-hauts-faits').innerHTML = `<i class="fa-solid fa-award"></i> ${pointsHautsFaits}`;
    document.getElementById('age').innerText = age;
    updateAgeProgressBar(age, formData.chromosome);
}

function loadFormDataFromCookie() {
    const formData = getFormDataFromCookie();
    if (formData) displayFormData(formData);
}
