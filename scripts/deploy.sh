#!/bin/bash
echo "🚀 Deploying RegTrack..."
cd backend && npm install && npm run build
func azure functionapp publish regtrack-functions
echo "✅ Deployment complete!"