@echo off

echo        ---------- init Node JS environment ---------- & echo.

if not EXIST "%APPDATA%\npm" ( md "%APPDATA%\npm" )
if not EXIST "%cd%\node_global" ( md "%cd%\node_global" )
if not EXIST "%cd%\node_cache" ( md "%cd%\node_cache" )

if not EXIST "%cd%\tmp.txt" ( call npm config set prefix "%cd%\node_global")
if not EXIST "%cd%\tmp.txt" ( call npm config set cache  "%cd%\node_cache")
echo.>tmp.txt

set path=%cd%\node_global;%cd%;%path%
set node_path=%cd%\node_global\node_modules    ::这一步应该可以不需要配置

call npm config get prefix & echo. &echo.
echo ------------------------------------------------------------
call npm config get cache & echo.
echo ============================================================
echo. & echo Node JS system environment is ready & echo. & echo.


cmd /k