# Portfolio Website

A full-stack web application showcasing my coding projects, 3D modelling work, and activity statistics.

## Overview

This website has evolved over several years to become a dynamic, full-stack platform for displaying my work and tracking activity data. The first version was a simple React single-page application styled with CSS. Over time, the site has been rebuilt and extended with modern technologies to improve performance, maintainability, and interactivity.

Key improvements include:

- Migrating to **Next.js** for server-side rendering and static site generation
- Switching from CSS to **TailwindCSS** for clean, maintainable styling
- Rewriting backend logic in **Python with FastAPI**, enabling easy feature additions and data processing with Python libraries
- Consolidating the client and server into a single, unified repository

The site is continuously updated, with new features and design improvements added regularly.

## Features

- **Project Showcases**: Dynamic project cards with descriptions, tech stack, screenshots, and live README rendering
- **Activity Data**: Fetches activity data from **Strava’s API**, including automatic refresh handling
- **3D Models**: Interactive **Three.js** models embedded in project pages
- **Markdown Rendering**: Displays README and project documentation with headings, lists, code blocks, and images
- **Responsive Design**: Fully responsive across devices with consistent typography and layout

## Architecture

- **Frontend**: Next.js with TypeScript and TailwindCSS
- **Backend**: Python with FastAPI, serving dynamic project and activity data
- **Database**: MongoDB Atlas for storing project info and activity data
- **Deployment**: Hosted on **Vercel** with serverless functions and optional AWS Lambda integration

The backend handles API requests, data preprocessing, and refresh tokens for external services like Strava. Markdown and 3D content are dynamically loaded and rendered in the frontend, providing a seamless user experience.

## Tech Stack

- TypeScript
- Python
- Next.js
- TailwindCSS
- FastAPI
- MongoDB Atlas
- Vercel / AWS Lambda
- Three.js / D3.js
- Jest, React Testing Library, Pytest
- Strava API integration

## Outcome

This project demonstrates my ability to build and maintain a **full-stack, interactive web application** that integrates APIs, dynamic content, and data visualisation. It also highlights ongoing development and iteration as I expand features and improve the user experience.
