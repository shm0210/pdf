const videoLinkInput = document.getElementById('videoLinkInput');
const loadBtn = document.getElementById('loadBtn');
const videoPlayer = document.getElementById('videoPlayer');

// Load video manually
function loadVideo() {
  const url = videoLinkInput.value.trim();
  if (!url) return;
  videoPlayer.src = url;
  videoPlayer.play().catch(() => {
    // autoplay might fail due to browser policy
  });
}

videoLinkInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') loadVideo();
});
loadBtn.addEventListener('click', loadVideo);

// --- Auto-load video from query string (?=videoURL)
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const videoUrl = params.get(''); // because query is like ?=link
  if (videoUrl) {
    videoLinkInput.value = videoUrl;
    loadVideo();
  }
});