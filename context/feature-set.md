## Feature Set

This document outlines the key features implemented in the Claims App.

### Core Features

*   **Claim Management:**
    *   Create, view, and manage insurance claims.
    *   Each claim is assigned a unique, sequential claim number.
    *   Detailed claim information including client name, contact, item description, and status.

*   **Inspection Management:**
    *   Create, view, and manage inspections associated with claims.
    *   Each inspection is assigned a unique, sequential inspection number.
    *   Record inspector notes and damage assessment.
    *   Attach photos to inspections.

*   **Photo Upload:**
    *   Integrated photo upload functionality for inspections using Cloudinary.

### User Interface

*   **Responsive Layout:** Application adapts to various screen sizes.
*   **Navigation:** Sidebar for easy navigation between different sections (Dashboard, Claims, Inspections).
*   **Dashboard:** Provides an overview of key metrics and quick actions.

### Technical Features

*   **Sequential Numbering:** Implemented a robust system for generating unique, sequential numbers for claims and inspections, ensuring no duplicates or gaps.
*   **Database Integration:** Utilizes Prisma ORM for efficient database interactions.
*   **API Endpoints:** RESTful API endpoints for managing claims and inspections.
*   **Component-Based UI:** Built with React and Next.js, leveraging reusable UI components from Shadcn UI.