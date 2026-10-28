#!/bin/bash
# usage: sheet.sh dir out cols files...
d=$1; o=$2; c=$3; shift 3
args=(); fl=""; i=0
for f in "$@"; do args+=(-i "$d/$f"); fl+="[$i]scale=640:-1[s$i];"; i=$((i+1)); done
rows=$(( (i + c - 1) / c )); inputs=""
for ((k=0;k<i;k++)); do inputs+="[s$k]"; done
ffmpeg -v error -y "${args[@]}" -filter_complex "${fl}${inputs}xstack=inputs=$i:layout=$(python3 -c "
c=$c;n=$i
print('|'.join(f'{(k%c)*640}_{(k//c)*360}' for k in range(n)))")" "$o"
