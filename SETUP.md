# EB-S3-UI Setup Guide

## Overview
EB-S3-UI is a cloud storage interface with three user access levels:
- **Guest**: View-only access
- **User**: Full file management (view, download, upload, create folders)
- **Admin**: Complete system control (all user permissions + delete, manage users)

## Environment Setup

1. Copy the environment template:
   ```bash
   cp env.example .env.local
   ```

2. Configure your admin credentials in `.env.local`:
   ```env
   ADMIN_USERNAME=your_admin_username
   ADMIN_PASSWORD=your_admin_password
   ADMIN_ID=admin/admin001
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

## User Access Flows

### Guest Access
- ID: `guest/guest000`
- Permissions: View files only
- No authentication required

### User Access
- Uses Clerk authentication
- Permissions: View, download, upload, create folders
- Requires sign-up/sign-in through Clerk

### Admin Access
- Credentials stored in `.env.local`
- Permissions: All user permissions + delete files/folders + manage users
- Can switch between different role views while maintaining admin privileges

## Features

- **Role-based Access Control**: Three distinct user types with appropriate permissions
- **File Management**: Upload, download, view, delete files and folders
- **Admin Superpowers**: Admins can switch between role views and manage the system
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Theme**: Toggle between themes
- **Secure Authentication**: Admin credentials validated server-side

## Logout
All users can logout at any time, which clears all session data and returns to the welcome screen.

## Admin Role Switching
Admins have a special ability to switch between different role views (Guest, User, Admin) while maintaining their admin privileges. This allows them to test the system from different user perspectives.


