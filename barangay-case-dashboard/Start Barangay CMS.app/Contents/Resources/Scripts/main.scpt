tell application "Terminal"
  do script "cd \"" & (POSIX path of (path to me as text)) & "../../..\" && chmod +x start-app.sh && ./start-app.sh"
end tell

tell application "Safari"
  delay 5
  open location "http://localhost:3000"
end tell 