# Zeotap Assignment

## Overview
This repository contains solutions for Zeotap's technical assignment, which consists of two projects:

1. **Assignment1** – A spreadsheet-like web application replicating key Google Sheets functionalities.
2. **Assignment2** – A chatbot that extracts and provides answers from the documentation of four Customer Data Platforms (CDPs): Segment, mParticle, Lytics, and Zeotap.

## Assignment 1: Web Application Mimicking Google Sheets
### Description
This web application is built to replicate the core functionalities of Google Sheets, including data entry, formula calculations, and formatting. It provides a familiar user experience with features like drag-and-drop, cell dependencies, and basic mathematical operations.

### Tech Stack
- **Frontend:** React.js, TypeScript, Redux
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (or Firebase for real-time sync)
- **Styling:** Tailwind CSS / Material UI
- **Spreadsheet Handling:** Handsontable (for spreadsheet-like UI)

### Key Features
- Supports mathematical operations (SUM, AVERAGE, MAX, MIN, COUNT)
- Provides data quality functions (TRIM, UPPER, LOWER, REMOVE_DUPLICATES, FIND_AND_REPLACE)
- Implements dynamic cell updates and dependencies
- Allows adding, deleting, and resizing rows/columns

## Assignment 2: Support Agent Chatbot for CDP
### Description
This chatbot assists users by extracting relevant information from CDP documentation. It fetches responses from APIs and provides accurate, structured answers to user queries related to Segment, mParticle, Lytics, and Zeotap.

### Tech Stack
- **Frontend:** React.js (Vite), TypeScript, React Router
- **UI Components:** Radix UI, Tailwind CSS, Lucide Icons
- **State Management & API Handling:** TanStack React Query
- **Form Handling:** React Hook Form
- **Data Sources:** CDP APIs, Indexed Documentation

### Key Features
- Fetches real-time answers from CDP documentation
- Handles variations in user queries (e.g., different phrasings)
- Provides structured, user-friendly responses
- Supports potential expansion to other CDPs

## Installation & Setup
### Clone the repository
```bash
  git clone https://github.com/d3vpratap/zeotap.git
  cd zeotap
```

### Run Web Application (Google Sheets Clone)
```bash
  cd assignment1
  npm install
  npm run dev
```

### Run Chatbot
```bash
  cd assignment2
  npm install
  npm run dev
```

## Author
Dev Pratap Singh
