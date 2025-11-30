#!/bin/bash
# GitHub Upload Script for Weather App

echo "🚀 Weather App - GitHub Upload"
echo "================================"

# 1. Αρχικοποίηση git repository
echo "✓ Initializing git repository..."
git init
git add .
git commit -m "Initial commit: React Native Weather App with dynamic theming and multilingual support"

# 2. Προσθήκη remote repository
echo "✓ Adding remote repository..."
read -p "Enter your GitHub repository URL (https://github.com/username/weatherApp.git): " REPO_URL
git remote add origin $REPO_URL

# 3. Αλλαγή branch σε main (αν χρειάζεται)
echo "✓ Setting up main branch..."
git branch -M main

# 4. Push στο GitHub
echo "✓ Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Success! Your project is now on GitHub!"
echo "📍 Repository: $REPO_URL"
echo ""
echo "💡 Next steps:"
echo "   1. Add a description to your repository on GitHub"
echo "   2. Add topics: react-native, weather, android, ios"
echo "   3. Enable GitHub Pages if you want (optional)"
echo ""
