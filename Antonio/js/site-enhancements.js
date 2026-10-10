/* Selective image deterrents; these do not prevent screenshots or downloading. */
document.addEventListener('contextmenu', function (event) {
  if (event.target.closest('img[data-photo], .photo-full-frame img')) event.preventDefault();
});
document.addEventListener('dragstart', function (event) {
  if (event.target.closest('img[data-photo], .photo-full-frame img')) event.preventDefault();
});
/* The animation template's visual link covers a separate image. Make it operable by keyboard. */
document.addEventListener('keydown', function (event) {
  if (event.key === 'Enter' && event.target.matches('a.slide-link')) {
    event.preventDefault();
    window.location.assign(event.target.href);
  }
});
