#!/bin/bash
set -e

echo 'Extracting valid commits from reflog...'

echo 'Checking branch: feat/arbitrum'
cat .git/logs/refs/heads/feat/arbitrum | awk '{print $2}' | while read sha; do
  if git cat-file -t "$sha" 2>/dev/null | grep -q 'commit'; then
    echo "$sha" >> ../valid_commits_feat_arbitrum.txt
  fi
done

echo 'Checking branch: feat/chatgpt'
cat .git/logs/refs/heads/feat/chatgpt | awk '{print $2}' | while read sha; do
  if git cat-file -t "$sha" 2>/dev/null | grep -q 'commit'; then
    echo "$sha" >> ../valid_commits_feat_chatgpt.txt
  fi
done

echo 'Checking branch: rors'
cat .git/logs/refs/heads/rors | awk '{print $2}' | while read sha; do
  if git cat-file -t "$sha" 2>/dev/null | grep -q 'commit'; then
    echo "$sha" >> ../valid_commits_rors.txt
  fi
done
