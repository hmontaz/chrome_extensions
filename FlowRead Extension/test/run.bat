cd ..
IF NOT EXIST "package.json" (
  echo Initializing npm project...
  npm init -y
)
npx jest --watchAll
REM WAIT FOR KEY
echo Press any key to continue...
pause >nul
