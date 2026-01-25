# HMS Frontend (frontend_hmsreal)

React frontend for the Hostel Management System (HMS).

## Overview

This project is the single-page application that interacts with the `backend_hms` API to provide admin and student interfaces for notices, rooms, payments, complaints, food attendance, and more.

## Tech stack

- React
- Tailwind CSS (project includes `tailwind.config.js`)
- Axios for API requests

## Requirements

- Node.js >= 14
- npm or yarn

## Environment variables

Create a `.env` file in the project root (if used) with at least:

- `REACT_APP_API_URL` — base URL for the backend API (e.g., `http://localhost:3000/api`)

Adjust variable names if your code expects different keys.

## Installation

1. Install dependencies

```
npm install
```

2. Start the dev server

```
npm start
```

3. Build for production

```
npm run build
```

## Running against local backend

Ensure the backend is running and `REACT_APP_API_URL` points to the backend base path. The frontend expects endpoints like `/api/auth`, `/api/notices`, etc.

## Folder structure (high level)

- `src/` — React source
  - `api/` — axios instances
  - `components/` — shared components (Header, Navbar, Sidebar, Layout)
  - `context/` — auth context
  - `pages/` — route pages (Dashboard, Login, Notices, Students, Rooms…)
  - `styles/` — component/page styles

## Deployment

Serve the `build/` directory using any static hosting (Netlify, Vercel, GitHub Pages, or a static server). Ensure `REACT_APP_API_URL` is set for the production environment.

## Contributing

Open PRs with clear descriptions. Keep UI and API changes coordinated with `backend_hms`.

## License

MIT (or update as appropriate)
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
