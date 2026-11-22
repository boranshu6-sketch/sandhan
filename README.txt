SANDHAN: installable app package
================================

Files (keep them together in one folder)
  index.html            The app
  notices.json          The live notice list the app reads (update this file to update every user)
  manifest.webmanifest  Makes the app installable (name, icons, colours)
  sw.js                 Service worker: offline use, fresh notices, new-notice alerts
  icons/                App icons for Android, iPhone and desktop

1. PUT IT ONLINE (needs https)
  Upload the whole folder to any https host, for example:
  - GitHub Pages (recommended: lets Sandhan's daily update publish notices.json automatically)
  - Netlify (app.netlify.com/drop: drag the folder)
  - Your college or personal website (upload to a folder such as /sandhan/)

2. HOW USERS INSTALL IT
  Android (Chrome):  open the link > "Install Sandhan" banner, or menu > Install app
  iPhone/iPad:       open in Safari > Share > Add to Home Screen
  Windows/Mac:       open in Chrome or Edge > install icon in the address bar
  Inside the app:    Settings > Install and notifications

3. HOW NOTICES STAY UP TO DATE
  - Tap the round refresh button at the top right to check instantly.
  - The app downloads notices.json every time it opens, every 15 minutes while
    open, and when the phone comes back online. New notices show a banner.
  - With notifications turned on (Settings > Install and notifications), the app
    alerts users to new notices. On Android Chrome the installed app can also
    check in the background a few times a day; other systems check when opened.
  - To publish new notices, replace notices.json on your host. Every installed
    copy picks it up automatically; users never need to reinstall.
  - Offline, the app shows the last notices it downloaded.

4. PRIVACY
  Each user's name, profile, saved notices and settings stay on their own device.
  Sandhan never deletes saved notices by itself.

Always read the employer's official advertisement before applying.
