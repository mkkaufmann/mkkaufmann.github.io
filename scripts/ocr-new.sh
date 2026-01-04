#!/usr/bin/env bash
set -euo pipefail

cards_dir="content/cards"

if [[ ! -d "$cards_dir" ]]; then
  echo "No cards directory found."
  exit 0
fi

changed=0

for dir in "$cards_dir"/*; do
  [[ -d "$dir" ]] || continue
  if [[ -f "$dir/ocr.txt" ]]; then
    continue
  fi

  image_file=""
  for ext in png jpg jpeg webp; do
    if [[ -f "$dir/image.$ext" ]]; then
      image_file="$dir/image.$ext"
      break
    fi
  done

  if [[ -z "$image_file" ]]; then
    echo "No image found in $dir"
    continue
  fi

  tmp_base="$(mktemp -u)"
  echo "Running OCR for $image_file"
  tesseract "$image_file" "$tmp_base" -l eng
  if [[ -f "${tmp_base}.txt" ]]; then
    mv "${tmp_base}.txt" "$dir/ocr.txt"
    changed=1
  fi
  rm -f "${tmp_base}.txt"
  rm -f "${tmp_base}.log" || true

done

if [[ $changed -eq 0 ]]; then
  echo "No new OCR output generated."
fi
