# Subiz email template

### Design

https://www.figma.com/file/kYAl7V1rkxZhMxXQqD1kX9/Subiz?type=design&node-id=1201-347&mode=design&t=94h6O4jAJ7yLZctA-0

# Steps of getting screenshot email template

1. Create folder contain source HTML template at project root
2. Open terminal, type 'npm run start-convert' (only 1 time) to run converter inlinecss
3. Open new terminal,

   - if you want to get screenshot of 1 email template, type script 'node index.js FOLDERNAME', in there: FOLDERNAME is name of the folder that contain HTML template, then wait for about 30s
     Until 'SCREENSHOT DONE!!!' displayed in console, this is done.

   - If you want to get screenshot of all email template, type script 'node index.js' and wait until 'SCREENSHOT DONE!!!' displayed in console.

4. 2 screenshots that have just been taken of each template, including the desktop and mobile versions, will be in the folder containing that template.
