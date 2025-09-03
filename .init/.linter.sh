#!/bin/bash
cd /home/kavia/workspace/code-generation/star-wars-character-match-and-portrait-creator-94763-94775/character_generator_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

