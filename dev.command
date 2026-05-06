#!/usr/bin/env bash
cd "$(dirname "$0")"

PID_FILE=".dev.pid"
LOG_FILE=".dev.log"

if [[ -f "$PID_FILE" ]] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
  echo "Stopping dev server..."
  kill "$(cat "$PID_FILE")"
  rm -f "$PID_FILE" "$LOG_FILE"
  echo "Done — closing window."
  sleep 1
  osascript -e 'tell application "Terminal" to close front window' 2>/dev/null || true
else
  rm -f "$PID_FILE" "$LOG_FILE"
  pnpm dev >"$LOG_FILE" 2>&1 &
  DEV_PID=$!
  echo $DEV_PID >"$PID_FILE"
  echo "Dev server starting — http://localhost:4321"
  echo "Double-click this file again to stop."
  echo "──────────────────────────────────────"
  tail -f "$LOG_FILE" &
  TAIL_PID=$!
  wait $DEV_PID 2>/dev/null || true
  kill $TAIL_PID 2>/dev/null || true
  rm -f "$PID_FILE" "$LOG_FILE"
  echo "Dev server stopped."
fi
