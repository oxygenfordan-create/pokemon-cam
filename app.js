const videoElement = document.getElementById('cameraVideo');
const statusPanel = document.getElementById('statusPanel');
const filterList = document.getElementById('filterList');
const captureButton = document.getElementById('captureButton');
const photoPreview = document.getElementById('photoPreview');
const cameraWindow = document.getElementById('cameraWindow');

const filters = [
  { id: 'arceus', label: 'Arceus Gold', class: 'filter-arceus' },
  { id: 'lunala', label: 'Lunala Prism', class: 'filter-lunala' },
  { id: 'solgaleo', label: 'Solgaleo Radiance', class: 'filter-solgaleo' },
  { id: 'mew', label: 'Mew Veil', class: 'filter-mew' },
];

let activeFilter = filters[0].class;

function createFilterButtons() {
  filters.forEach((filter, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'filter-chip' + (index === 0 ? ' active' : '');
    button.textContent = filter.label;
    button.dataset.filter = filter.class;
    button.addEventListener('click', handleFilterChange);
    filterList.appendChild(button);
  });
}

function handleFilterChange(event) {
  const selectedClass = event.currentTarget.dataset.filter;
  activeFilter = selectedClass;

  document.querySelectorAll('.filter-chip').forEach((chip) => {
    chip.classList.toggle('active', chip.dataset.filter === selectedClass);
  });

  cameraWindow.className = `camera-window ${selectedClass}`;
}

async function initializeCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
    videoElement.srcObject = stream;
    videoElement.addEventListener('loadedmetadata', () => videoElement.play());
  } catch (error) {
    console.error('Camera initialization error:', error);
    showError('Camera access is blocked or unavailable. Please allow permission and reload on a secure HTTPS site.');
  }
}

function showError(message) {
  statusPanel.hidden = false;
  statusPanel.querySelector('.status-copy').textContent = message;
}

function capturePhoto() {
  if (!videoElement.srcObject) {
    showError('No active camera stream. Confirm your camera permissions and try again.');
    return;
  }

  const canvas = document.createElement('canvas');
  const videoTrack = videoElement.srcObject.getVideoTracks()[0];
  const settings = videoTrack.getSettings();

  canvas.width = settings.width || videoElement.videoWidth || 1280;
  canvas.height = settings.height || videoElement.videoHeight || 1280;

  const context = canvas.getContext('2d');
  context.filter = window.getComputedStyle(cameraWindow).filter || 'none';
  context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

  const imageDataUrl = canvas.toDataURL('image/png');
  photoPreview.src = imageDataUrl;
}

captureButton.addEventListener('click', capturePhoto);

createFilterButtons();
initializeCamera();
