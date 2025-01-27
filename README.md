# Cinema Booking System

## Overview

A web application for managing cinema reservations, built with React.js, Inertia.js, and Laravel. The application uses PostgreSQL as the database and supports PayNow payments. Users can browse available showings, select seats, make payments, and receive email notifications. Administrators have access to a management panel.

## Features

-   Movie showings list – Browse available movie showtimes.
-   Seat selection – Choose seats from an interactive hall plan.
-   Payments – Secure payments via PayNow.
-   Ticket generation - Tickets are generated as pdf
-   Email notifications – Receive booking confirmation.
-   User reservations – Logged-in users can view and manage their reservations.
-   Admin panel – Manage movies, showings, users, and reservations.

![Showings](https://i.postimg.cc/N0vWCG1B/showings.png "Showings")
![Seat picker](https://i.postimg.cc/L6wdf35q/seats.png "Seat picker")
![User's reservations](https://i.postimg.cc/K8M65330/reservations.png "User's reservations")
![Admin panel](https://i.postimg.cc/X7pSpzjS/admin.png "Admin panel")

## Tech Stack

-   Frontend: React.js
-   Backend: Laravel
-   Database: PostgreSQL
-   Payments: PayNow

## Installation

1. Clone the repository:

```
git clone https://github.com/Inco18/cinema-bookings.git
cd cinema-bookings
```

2. Install dependencies:

```
composer install
npm install
```

3. Set up the environment:

```
cp .env.example .env
```

Update .env file with database credentials and PayNow API keys.

4. Run migrations:

```
php artisan migrate --seed
```

5. Start the development server:

```
php artisan serve
npm run dev
```

## Usage

1. Open the application in your browser.

2. Browse available showings and select seats.

3. Proceed to checkout and complete the payment via PayNow.

4. Receive an email confirmation.

5. Logged-in users can manage their reservations from their profile.

6. Administrators can manage showings and reservations via the admin panel.
