git clone https://github.com/scratchfoundation/scratch-www src/www/scratch-www
cd src/www/scratch-www
bun i
ROOT_URL=http://localhost:4517 API_HOST=http://localhost:4519 bun run build
cd -
