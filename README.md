# Employee Permissions & Capture Suite

Welcome! Follow this complete guide to set up, run, and test the React + Node.js Employee Permissions & Capture Suite application locally without any errors.

---

### Prerequisites
Make sure you have **Node.js** (v16 or higher) installed on your computer.

---

### Step 1: Project Setup & File Structure

Create a project folder (e.g., `employee-capture-app`) and place all your generated files into the following structure:

```text
employee-capture-app/
├── server.js
├── package.json
├── index.html
├── src/
│   ├── main.jsx
│   ├── index.css
│   ├── App.jsx
│   ├── DashboardView.jsx
│   ├── FloatingButton.jsx
│   ├── CaptureModal.jsx
│   └── ServerInspectorModal.jsx
└── uploads/          (Auto-created by the server on start)
```

---

### Step 2: Install Dependencies

Open your terminal inside the project root folder and install all required dependencies:

```bash
npm install
```

*(This will install `express`, `multer`, `cors`, `react`, `react-dom`, `html2canvas`, `tailwindcss`, and `concurrently`)*

---

### Step 3: Running the Application

You can run both the Node.js backend server and the Vite React frontend concurrently with a single command:

```bash
npm run dev
```

* **Backend Server:** Runs on `http://localhost:3000` (handles form submissions to `uploads/notes.txt`, permissions snapshots to `uploads/permissions.txt`, and file uploads).
* **Frontend Vite Dev Server:** Runs on `http://localhost:5173` (or the local URL printed in your terminal).

---

### Step 4: Verification & Testing

1. Open your browser and go to your Vite dev server URL (e.g., `http://localhost:5173`).
2. **Employee Permissions Table:** Test toggling Read/Write checkboxes across roles and click **"Save Changes"** to write snapshots to the server.
3. **Capture Modal:** Click the floating camera button in the bottom-right corner (or drag it around freely). Type an issue and description, then click **"Save Issue"** to test saving logs to `notes.txt` with a toast notification.
4. **Server Inspector:** Click **"Server Logs & Files"** in the top header to inspect live backend logs (`notes.txt`) and review saved screenshots or screen recordings.