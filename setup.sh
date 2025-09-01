wget https://github.com/TNTSuperMan/minuet-www/archive/refs/heads/develop.zip
unzip develop.zip
mv minuet-www-develop minuet-www
rm develop.zip

cd minuet-www
bun i
bun run build
cd -
