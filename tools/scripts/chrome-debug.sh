#!/bin/bash
# Opens Chrome with remote debugging enabled on port 9222.
# Uses a separate profile — required by Chrome 136+ (default profile blocks remote debugging).
# Any local process can reach port 9222, so never store passwords in this profile.
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=9222 \
  --user-data-dir="$HOME/.chrome-debug-profile" \
  "$@"
