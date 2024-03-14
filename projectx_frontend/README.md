MagicOps.ai

## Development Setup

- Clone Repository: `git clone HTTPS/SSH Url`
- Move to root directory: `cd projectx_frontend`
- Install dependency: npm install
- Starting Project: npm start
- Open link in browser: http://localhost:3000/

## Folder Structure

projectx_frontend
│
│
src
|
└───assets
| └───images (Directory to store all image files)
|
└───components (Parent directory for app components)
│ └───resource folder (Resource folder for each specific component with CSS properties)
|
└───constants (Parent directory for constant data)
│ └───resource folder (Resource folder to store mock-data, data which can be used in components )
|
└───containers (Parent directory for react pages)
| └───resource folder (Resource folder for each specific page)
|
└───hooks (Directory for reusable pieces of logic that can be shared across different components)
| └───resource file (Resource file to track the screen is in mobile view or desktop, executes provided callback functions based on the view, and returns a boolean indicating the mobile status)
|
└───routes (Route directory for react pages)
| └───resource files (Resource files contain paths to navigate the pages)
|
└───services (Make all API function inside this directory)
└─── apiUrl.js - All the API endpoints.
| └───resource files (Resource files to make API functions to fetch the data)
|
└───styles (Directory to wrap all style dependencies of the application)
| └───global.scss (Parent style sheet where application level common styles are mentioned)
| └───variable.scss (all variables and mixins are mentioned here)
|
└───utils (Directory to common resource files)
└───.prettierrc.json - Configuration file for style formatting
└───.eslintrc.json - Configuration file to improve code quality
└───cspell.json - Configuration file for spell checking
└───jsconfig.json - Configuration file for ES version and absolute path
└───Dockerfile - Configuration file for docker
└───App.js - Includes all the routes

## Design Link

[Design Link] (https://www.figma.com/file/qW9gVGO2fPK9lKfM80CITt/Senzcraft-Product?type=design&node-id=0%3A1&mode=design&t=IxmzI85zQovSl87T-1)

## Testing Link

[Testing Link](http://senzcraft.s3-website-ap-southeast-1.amazonaws.com/)

## Developer Best Practice

- Maintain proper namespacing for folders, files, variable and function declarations.
- Always create feature or bug branches and then merge with stable master branch.
- Provide proper commit messages & split commits meaningfully.

## To build Docker image:

docker build -t senzcraft:latest .

## To Run Docker:

docker run --name nameofyourchoice -d -p 3000:3000 nameofyourapp:latest

## External packages:

axios - To make HTTP requests. - https://axios-http.com/docs/intro
chart.js - To make chart - https://www.chartjs.org/docs/latest/
file-saver - It is the solution to saving files on the client-side. - https://eligrey.com/blog/saving-generated-files-on-the-client-side/
jspdf - For creating PDF - https://parall.ax/products/jspdf
react-date-range - To create date range - https://hypeserver.github.io/react-date-range/
react-google-recaptcha - To create recaptcha - https://developers.google.com/recaptcha/docs/display
xlsx - To create xls - https://sheetjs.com/
react-table - To create table - https://tanstack.com/table/v8/docs/introduction

## Google maps API

1. Login to Google console.
2. Click on Api and services.
3. Create a key.
4. Activate keys(add card details).
5. Search "googleMapsApiKey" globally and replace it
6. Endpoint: https://px-tms.azurewebsites.net/get_trip_route (apiUrls -> "${BASE_URL1}/get_trip_route")
7. We can check the activity in the Google API console. Filter by one day and examine the number of API hits.
