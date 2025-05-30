npm run build-only
perl -pe 's/"\/assets/".\/assets/g' dist/index.html > /tmp/index.html
cp /tmp/index.html dist/
cp -R dist/* ~/workspace/corpus-frontend-config/UD_TEI/static/qbe/
