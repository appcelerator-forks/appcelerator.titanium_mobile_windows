call git clean -fdx

mkdir dist
mkdir dist\windows
mkdir dist\windows\doc

echo Generate docs
cd apidoc
call npm install .
echo Exit Code = %ERRORLEVEL%
call node ti_win_yaml.js
echo Exit Code = %ERRORLEVEL%
cd ..
robocopy apidoc\Titanium dist\windows\doc\Titanium /e

IF %ERRORLEVEL% GTR 4 exit /B %ERRORLEVEL%

call Tools\Scripts\win81.bat
IF %ERRORLEVEL% GTR 4 exit /B %ERRORLEVEL%

call Tools\Scripts\win10.bat
IF %ERRORLEVEL% GTR 4 exit /B %ERRORLEVEL%

REM does this combine properly?
