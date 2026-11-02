@IF "%DEBUG%" == "" @ECHO OFF
@SETLOCAL

WHERE mvn >nul 2>nul
IF %ERRORLEVEL% EQU 0 (
  mvn %*
  GOTO :END
)

IF DEFINED MAVEN_HOME IF EXIST "%MAVEN_HOME%\bin\mvn.cmd" (
  CALL "%MAVEN_HOME%\bin\mvn.cmd" %*
  GOTO :END
)

IF DEFINED M2_HOME IF EXIST "%M2_HOME%\bin\mvn.cmd" (
  CALL "%M2_HOME%\bin\mvn.cmd" %*
  GOTO :END
)

IF DEFINED USERPROFILE (
  IF EXIST "%USERPROFILE%\.gemini\antigravity\scratch\maven\bin\mvn.cmd" (
    CALL "%USERPROFILE%\.gemini\antigravity\scratch\maven\bin\mvn.cmd" %*
    GOTO :END
  )
  IF EXIST "%USERPROFILE%\Downloads\apache-maven-3.10.0-bin\apache-maven-3.10.0\bin\mvn.cmd" (
    CALL "%USERPROFILE%\Downloads\apache-maven-3.10.0-bin\apache-maven-3.10.0\bin\mvn.cmd" %*
    GOTO :END
  )
)

ECHO [ERROR] Maven executable not found on system PATH or MAVEN_HOME.
ECHO Please install Apache Maven or ensure 'mvn' is accessible in your environment.
EXIT /B 1

:END
EXIT /B %ERRORLEVEL%
