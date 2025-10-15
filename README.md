# Ecommerce Web Application Automation Framework

## Table of Contents
- [Overview](#overview)
- [Scope of Work](#scope-of-work)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Testing Details](#testing-details)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Overview
This project implements a scalable and maintainable UI test automation framework for a sample e-commerce web application. It performs both functional validation and business logic verification across product listing and cart management modules.

## Scope of Work
The framework automates the following tasks:
- Perform product search and validate expected keywords appear in search results.
- For the first 10 listed products:
  - Retrieve product prices.
  - If a product's price falls between 500 and 1000, add it directly to the cart.
  - If a product's price is below 500, navigate to the product detail page, update quantity to 2, then add it to the cart.
- After adding applicable products:
  - Confirm that each product is correctly listed on the cart page.
  - Validate that prices in the cart match the product listing prices.
  - Verify total cart value equals the sum of individual product prices.

## Features
- Automated product search verification
- Price-based conditional product adding
- Quantity update in product detail pages
- Cart content and price validations
- Total cart price verification
- Modular and reusable test code structure
- Comprehensive logging and reporting

## Technologies Used
- Playwright (for UI automation)
- Node.js and TypeScript (test scripting)
- Git and GitHub (version control)
- Sauce Demo (sample application for testing)

## Installation

### Prerequisites
- Node.js (v14+)
- npm or yarn package manager

### Steps
Clone the repository:

git clone https://github.com/Thiyagu15/Ecommerce_WebApplication.git
cd Ecommerce_WebApplication


