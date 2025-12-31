#!/bin/bash
rm -fr ./dist/*
bun run build
echo Finished PROD!