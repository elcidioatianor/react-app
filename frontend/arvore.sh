#!/bin/bash

# Se existir o comando tree, usamos ele (mais completo)
if command -v tree >/dev/null 2>&1; then
    echo "Comando 'tree' encontrado. Gerando árvore..."
    tree -I "node_modules"
    exit 0
fi

echo "Comando 'tree' não encontrado. Usando modo compatível com 'find'."
echo

# Gera árvore ignorando node_modules
find . \
    -path "./node_modules" -prune -o \
    -print | awk '
BEGIN {
    FS="/"
}
{
    indent = ""
    for (i=2; i<NF; i++) {
        indent = indent "│   "
    }

    if (NF > 1) {
        print indent "├── " $NF
    } else {
        print "."
    }
}
'
