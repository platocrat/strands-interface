#!/bin/bash
set -e

echo 'Initializing clean repository...'
mkdir recovered-repo
cd recovered-repo
git init

echo 'Rebuilding branch: feat/arbitrum'
git checkout --orphan feat_arbitrum
git rm -rf . > /dev/null 2>&1 || true
while read sha; do
  git show "$sha" > patch.diff || continue
  git apply patch.diff || continue
  git add .
  git commit -m "Recovered commit $sha from feat/arbitrum" || true
done < ../valid_commits_feat_arbitrum.txt

echo 'Rebuilding branch: feat/chatgpt'
git checkout --orphan feat_chatgpt
git rm -rf . > /dev/null 2>&1 || true
while read sha; do
  git show "$sha" > patch.diff || continue
  git apply patch.diff || continue
  git add .
  git commit -m "Recovered commit $sha from feat/chatgpt" || true
done < ../valid_commits_feat_chatgpt.txt

echo 'Rebuilding branch: rors'
git checkout --orphan rors
git rm -rf . > /dev/null 2>&1 || true
while read sha; do
  git show "$sha" > patch.diff || continue
  git apply patch.diff || continue
  git add .
  git commit -m "Recovered commit $sha from rors" || true
done < ../valid_commits_rors.txt

echo 'Setting up GitHub remote and pushing all branches...'
git remote add origin git@github.com:yourusername/recovered-repo.git
for branch in $(git branch | sed 's/*//'); do
  git checkout $branch
  git push -u origin $branch
done
echo 'Done!'