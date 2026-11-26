#!/usr/bin/env bash

echo "==================================================="
echo "Stopping Razorpay Local Microservices..."
echo "==================================================="

if [ -f .pids ]; then
    while read -r pid; do
        if kill -0 "$pid" 2>/dev/null; then
            kill "$pid" 2>/dev/null || true
        fi
    done < .pids
    rm -f .pids
    echo "All background processes stopped."
else
    echo "No .pids file found. Searching for Java/Vite processes..."
    pkill -f "razorpay" 2>/dev/null || true
fi
