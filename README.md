# 🚌 Vaahan – Smart College Bus Tracking, Pass & Management System

## 📌 Project Overview

**Vaahan** is a Smart College Bus Tracking, Pass & Management System designed to make college transportation safer, more transparent, and convenient for students, drivers, and transport administrators.

The system brings important college transportation activities into one centralized platform, including bus tracking, route information, driver and bus details, notifications, emergency reporting, digital bus-pass management, and online payment.

The system is designed around three main user roles:

- 👨‍🎓 Student
- 🚌 Driver
- 👨‍💼 Transport Administrator

---

## 🎯 Problem Statement

Traditional college transportation systems may face problems such as:

- Lack of real-time bus location information
- Difficulty in knowing bus arrival and departure status
- Manual and paper-based bus-pass processes
- Limited monitoring of buses and routes
- Delayed communication during breakdowns or emergencies
- Increased administrative workload

Vaahan aims to provide a centralized digital platform to improve transportation visibility, safety, and management.

---

## 🎯 Objectives

The main objectives of Vaahan are:

- Provide real-time visibility of college buses.
- Allow students to view their relevant bus and route.
- Display driver name, bus number, and route information.
- Provide administrators with an overview of active buses and routes.
- Support emergency, breakdown, and SOS reporting.
- Send transport-related notifications.
- Digitize bus-pass registration and renewal.
- Support digital photo and signature submission.
- Enable online bus-fee payment.
- Reduce manual work for transport administrators.
- Improve student safety and transportation management.

---

# 👥 User Modules

## 👨‍🎓 1. Student Module

The Student Module is designed to provide students with easy access to their college transportation information.

### Features

- Student registration and login
- Student profile
- Assigned bus and route information
- Live bus tracking
- Route and stop information
- Estimated bus arrival information
- Today's driver and bus details
- Bus status information
- Transport notifications
- Online bus-pass application
- Bus-pass renewal
- Student photo and signature upload
- Online payment
- Digital bus pass

---

## 🚌 2. Driver Module

The Driver Module allows drivers to manage their assigned trips and share bus location information.

### Features

- Secure driver login
- View assigned bus
- View assigned route
- Start trip
- End trip
- GPS location sharing
- View important stops
- Report delays
- Report bus breakdown
- Report accidents
- Report emergencies
- SOS functionality
- Trip history and status updates

---

## 👨‍💼 3. Administrator Module

The Administrator Module provides centralized control and monitoring of the college transportation system.

### Features

- Administrator dashboard
- Monitor active buses
- Live fleet map
- Monitor routes
- Manage students
- Manage drivers
- Manage buses
- Manage routes and stops
- Manage bus assignments
- Monitor bus status
- Receive emergency and incident alerts
- Approve or reject bus-pass applications
- Verify student documents
- View payment records
- Manage pass validity
- Send transport announcements
- View historical trips
- View transport reports

---

# 🚀 Core Features

## 🗺️ Real-Time Bus Tracking

The system is designed to allow drivers to share their GPS location while an active trip is running.

Students assigned to the relevant route can view the bus location, while administrators can monitor the complete fleet.

### Basic workflow

```text
Driver Login
     ↓
Select Assigned Bus
     ↓
Start Trip
     ↓
GPS Location Obtained
     ↓
Location Sent to Backend
     ↓
Student & Admin View Bus Location
     ↓
Driver Ends Trip
     ↓
Trip Stored in History.
