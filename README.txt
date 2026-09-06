This fix is based on the known-good viewer version from GitHub commit 355614f.

Upload the phone folder to the repository root.

Only these files are included:
phone/Brett/index.html
phone/viewer.js

It preserves the original landing screen, 3D Viewer/Cross View choices,
fullscreen attempt, slideshow, swipe, Home, bottom filename/count and arrows.

Changes only:
- removes the stereo filename overlay
- Pause changes to Resume when paused
- Resume immediately advances one image and restarts the slideshow
