@echo off
cd /d D:\YTC\YTC_Daily_Final\Biz\AndrewTech

concurrently "cd Website && npm start" "cd AndrewTech.Api && dotnet run --urls http://*:5000""

pause