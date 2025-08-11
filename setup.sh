wget https://github.com/scratchfoundation/scratch-www/archive/refs/heads/develop.zip
unzip develop.zip
mv scratch-www-develop scratch-www
rm develop.zip

cd scratch-www
bun i
ROOT_URL=http://localhost:4517 API_HOST=http://localhost:4519 PROJECT_HOST=http://localhost:4513 ASSET_HOST=http://localhost:4518 bun run build
cd -
