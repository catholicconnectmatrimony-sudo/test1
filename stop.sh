#!/bin/bash

# Matrimony Portal - Stop Script

echo "🛑 Stopping Matrimony Portal..."
echo ""

docker-compose down

echo ""
echo "✅ All services stopped!"
echo ""
echo "💡 To remove all data (including database):"
echo "   docker-compose down -v"
echo ""
