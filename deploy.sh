#!/bin/bash
set -e

echo "🚀 Starting Universal AI Watcher Deployment..."

# Check if .env exists, if not create a template
if [ ! -f .env ]; then
    echo "⚠️ .env file not found! Creating a template."
    echo "POSTGRES_USER=admin" > .env
    echo "POSTGRES_PASSWORD=securepassword123" >> .env
    echo "SECRET_KEY=generate_a_secure_random_key" >> .env
    echo "OPENAI_API_KEY=your_openai_api_key_here" >> .env
    echo "Please edit the .env file with your secure credentials and run ./deploy.sh again."
    exit 1
fi

echo "📦 Pulling latest changes from git..."
git pull origin main || echo "Not a git repository, skipping pull."

echo "🏗️ Building and deploying production Docker containers..."
docker-compose -f docker-compose.prod.yml up -d --build

echo "🧹 Cleaning up dangling images..."
docker image prune -f

echo "✅ Deployment successful! Universal AI Watcher is now live on port 80."
