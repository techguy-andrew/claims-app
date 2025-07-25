Show all recent commits and allow me to choose which commit to revert to, then permanently delete all commits after the chosen one and clean up all other branches.

INTERACTIVE COMMIT SELECTION AND PERMANENT RESET:

1. **Display Commit History**:
   - Run `git log --oneline -20` to show last 20 commits
   - Run `git log --graph --oneline -15` for visual commit history
   - For each commit, display:
     * Commit hash (short)
     * Commit message
     * Author and date
     * Brief summary of changes

2. **Show Detailed View of Key Commits**:
   - Run `git show --stat <commit-hash>` for recent commits
   - Display file changes for each commit
   - Help identify stable checkpoint commits

3. **Present Commit Options**:
Available commits to revert to:
abc1234 - (2 hours ago) Latest changes def5678 - (1 day ago) Dashboard improvements38b3599 - (1 week ago) Enhanced CLAUDE.md with detailed page structure ghi9012 - (1 week ago) Initial setup complete ...
Which commit would you like to revert to? Enter the commit hash:
4. **Wait for User Selection**:
- Prompt user to enter the desired commit hash
- Validate the commit hash exists
- Show details of the selected commit for confirmation

5. **Execute Permanent Reset (After Confirmation)**:

**Hard Reset to Selected Commit**:
```bash
git reset --hard <selected-commit-hash>
Force Push to Update Remote:
git push --force-with-lease origin main
Clean Up All Other Branches:
# Delete local branches (except main)
git branch | grep -v "main" | grep -v "\*" | xargs -n 1 git branch -D

# Delete remote branches (except main)
git branch -r | grep -v "origin/main" | grep -v "origin/HEAD" | sed 's/origin\///' | xargs -n 1 git push --delete origin

# Clean up remote references
git remote prune origin
Final Cleanup:
git reflog expire --expire=now --all
git gc --prune=now --aggressive
Verification Steps:
Run git log --oneline -10 to confirm selected commit is now HEAD
Run git branch -a to verify only main branch exists
Run git status to verify clean working directory
WARNING:
This will PERMANENTLY DELETE all commits after the selected commit
This will PERMANENTLY DELETE all other branches (local and remote)
No backup branches will be created
This cannot be undone once executed
DELIVERABLES:
Complete commit history display with details
Interactive selection of target commit
User confirmation before executing destructive operations
Permanent reset to selected commit
Complete cleanup of branches and git history
Verification of final state
Start by showing the commit history and wait for my selection before proceeding with any destructive operations.
---
