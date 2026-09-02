# 🚉 Railway Platform Management System

A web app that automatically assigns railway platforms to incoming trains based on arrival/departure times, priority, and movement type — helping simulate how a station master decides which train gets which platform, and when a platform frees up for the next one.

Live demo: **[smarterplatform.com](https://smarterplatform.com)**

![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/license-ISC-blue)

---

## ✨ Features

- **Dynamic train input table** — add or remove any number of trains, each with a train number, priority, arrival time, departure time, "last stop" flag, and movement type (Up / Down / Reversal).
- **Smart platform allocation engine** — a greedy scheduling algorithm assigns each train the earliest available platform, respecting turnaround buffers so two trains are never crammed onto the same platform too close together.
- **Terminating train handling** — mark a train as its "last stop" and the app automatically computes its departure time (holding it for a fixed yard-out duration) instead of requiring manual entry.
- **Reversal buffer** — trains reversing direction on a platform get a longer safety buffer than a normal through train.
- **Results dashboard** — a card-based summary of the computed schedule showing assigned platform, arrival/departure, and whether the train is terminating or passing through, plus the total number of platforms required.
- **Click-to-highlight** — click a train number to instantly highlight its row in the input table and its card in the results.
- **CSV export** — download the computed schedule as a `.csv` file.
- **Developer tools** — "Fill Random Values" and "Clear All Inputs" panel for quickly testing the scheduler.
- **Light/dark theme** — toggle persisted via `localStorage`.
- **Animated train-window backdrop** — a purely decorative, CSS-animated scrolling scene (river, bridges, towers, clouds, birds) styled to look like a view from a moving train.

---

## 🧠 How the scheduling algorithm works

The core logic lives in [`logic.js`](./logic.js) and runs as follows:

1. **Validate & normalize** — trains with an unparseable arrival time are discarded. If a train is marked as a terminating ("last stop") service, its departure time is overwritten to `arrival + stay duration`. If a non-terminating train's departure is (accidentally) earlier than its arrival, it's rolled forward by a day as a failsafe.
2. **Sort** — trains are ordered chronologically by arrival time. Ties are broken by priority (High > Medium > Standard), so higher-priority trains get first pick of a platform when they arrive at the same moment.
3. **Assign platforms greedily** — for each train, the algorithm scans existing platforms for the first one that will be free (accounting for a buffer) by the time the train arrives:
   - **Standard/Up/Down movement** → an 8-minute buffer is required between trains.
   - **Reversal movement** → a 25-minute buffer is required, since reversing takes longer.
   - If no platform is free in time, a brand-new platform is created.
4. **Return the schedule** — each train comes back with its assigned platform number and a formatted display string, along with the total number of platforms used.

This is a single-pass **interval/resource scheduling** approach (similar in spirit to the "minimum meeting rooms" problem), adapted for railway platform allocation.

---

## 🏗️ Tech stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML, CSS, and JavaScript (`index.html`) — no framework or build step |
| Backend | Node.js + [Express](https://expressjs.com/) (`server.js`) |
| Scheduling engine | Plain JavaScript module (`logic.js`) |
| Cross-origin support | [`cors`](https://www.npmjs.com/package/cors) |

---

## 📁 Project structure

```
Railway-Platform-Management-System/
├── index.html       # Frontend UI: input table, results dashboard, styling, animations
├── server.js         # Express server exposing the /calculate API
├── logic.js           # Platform-assignment scheduling algorithm
├── package.json       # Project metadata & dependencies
├── CNAME               # Custom domain config for GitHub Pages (smarterplatform.com)
└── README.md
```

---

## 🚀 Getting started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- npm

### Installation

```bash
git clone https://github.com/mritunjaydubey00/Railway-Platform-Management-System.git
cd Railway-Platform-Management-System
npm install
```

### Running the backend

```bash
npm start
```

This starts the Express API on **http://localhost:3000**.

### Running the frontend

Open `index.html` directly in your browser (or serve it with any static file server). The page sends its scheduling requests to `http://localhost:3000/calculate`, so **the backend must be running locally on port 3000** for the "Execute" button to work.

> 💡 The `CNAME` file points the live GitHub Pages deployment at `smarterplatform.com`, but note that GitHub Pages only serves the static frontend — the Express backend needs to be hosted separately (e.g. Render, Railway, Fly.io) and `index.html` updated to point at that deployed API URL for the hosted demo to be fully functional.

---

## 🔌 API reference

### `POST /calculate`

Computes platform assignments for a list of trains.

**Request body:**

```json
{
  "trains": [
    {
      "trainNo": "12675",
      "priority": 10,
      "arrival": "2025-06-01T10:00",
      "departure": "2025-06-01T10:20",
      "isLastStop": false,
      "type": "U"
    }
  ]
}
```

| Field | Type | Description |
|---|---|---|
| `trainNo` | string | Train identifier/number |
| `priority` | number | `10` = High, `5` = Medium, `1` = Standard |
| `arrival` | string (datetime) | Scheduled arrival time |
| `departure` | string (datetime) | Scheduled departure time (ignored if `isLastStop` is `true`) |
| `isLastStop` | boolean | Whether this train terminates at the station |
| `type` | string | `"U"` (Up), `"D"` (Down), or `"R"` (Reversal) |

**Response:**

```json
{
  "success": true,
  "results": {
    "total": 3,
    "schedule": [
      {
        "trainNo": "12675",
        "platform": 1,
        "displayDep": "01/06/2025 · 10:20 AM",
        "isLastStop": false,
        "...": "..."
      }
    ]
  }
}
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to check the [issues page](https://github.com/mritunjaydubey00/Railway-Platform-Management-System/issues) or open a pull request.

## 📄 License

This project is licensed under the **ISC License** (as declared in `package.json`).
