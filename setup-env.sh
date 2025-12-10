#!/bin/bash

# Setup script for server environment variables

echo "========================================="
echo "Contact Form Server Setup"
echo "========================================="
echo ""
echo "This script will help you create the .env file."
echo ""

# Check if .env already exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/n): " overwrite
    if [ "$overwrite" != "y" ]; then
        echo "Setup cancelled."
        exit 0
    fi
fi

echo "Please provide the following information:"
echo ""

# Get email user (default to sahilsaykar24@gmail.com)
read -p "Gmail address [sahilsaykar24@gmail.com]: " EMAIL_USER
EMAIL_USER=${EMAIL_USER:-sahilsaykar24@gmail.com}

# Get app password
echo ""
echo "⚠️  IMPORTANT: You need a Gmail App Password (not your regular password)"
echo "Get one here: https://myaccount.google.com/apppasswords"
echo "You must enable 2-Step Verification first!"
echo ""
read -p "Gmail App Password: " EMAIL_PASS

# Get recipient email (default to sahilsaykar24@gmail.com)
read -p "Recipient email [sahilsaykar24@gmail.com]: " RECIPIENT_EMAIL
RECIPIENT_EMAIL=${RECIPIENT_EMAIL:-sahilsaykar24@gmail.com}

# Get port (default to 3001)
read -p "Port [3001]: " PORT
PORT=${PORT:-3001}

# Create .env file
cat > .env << EOF
EMAIL_USER=${EMAIL_USER}
EMAIL_PASS=${EMAIL_PASS}
RECIPIENT_EMAIL=${RECIPIENT_EMAIL}
PORT=${PORT}
EOF

echo ""
echo "✅ .env file created successfully!"
echo ""
echo "To start the server, run:"
echo "  npm start"
echo ""
echo "Or for development with auto-reload:"
echo "  npm run dev"

