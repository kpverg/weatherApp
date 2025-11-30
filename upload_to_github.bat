@echo off
REM GitHub Upload Script for Weather App (Windows)

echo.
echo 🚀 Weather App - GitHub Upload
echo ================================
echo.

REM 1. Αρχικοποίηση git repository
echo Initializing git repository...
call git init
call git add .
call git commit -m "Initial commit: React Native Weather App with dynamic theming and multilingual support"

REM 2. Προσθήκη remote repository
echo.
echo Adding remote repository...
set /p REPO_URL="Enter your GitHub repository URL (https://github.com/username/weatherApp.git): "
call git remote add origin %REPO_URL%

REM 3. Αλλαγή branch σε main
echo.
echo Setting up main branch...
call git branch -M main

REM 4. Push στο GitHub
echo.
echo Pushing to GitHub...
call git push -u origin main

echo.
echo ✅ Success! Your project is now on GitHub!
echo 📍 Repository: %REPO_URL%
echo.
echo 💡 Next steps:
echo    1. Add a description to your repository on GitHub
echo    2. Add topics: react-native, weather, android, ios
echo    3. Enable GitHub Pages if you want (optional)
echo.
pause
