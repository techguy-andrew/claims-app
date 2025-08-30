# Git Repository Synchronization and Documentation Protocol

Execute comprehensive version control operations with automated change analysis and commit-indexed documentation generation.

## IMMEDIATE EXECUTION DIRECTIVE

### Phase 1: Repository State Analysis
Perform differential analysis of the working directory against the current HEAD reference. Enumerate all modified, staged, and untracked files. Parse file modifications to extract semantic change patterns and identify functional alterations across the codebase.

### Phase 2: Commit Message Generation
Synthesize an industry-standard commit message adhering to conventional commit specifications. Structure the message with appropriate type prefix (feat/fix/docs/style/refactor/test/chore), concise scope identifier, and descriptive subject line. Include detailed body paragraphs documenting rationale, implementation details, and breaking changes where applicable.

### Phase 3: Version Control Operations
Execute git staging operations for all modified and untracked files. Apply generated commit message to create new repository snapshot. **Capture the resulting commit hash immediately** - extract the 7-character short SHA that will serve as the universal identifier across GitHub, Vercel, and documentation systems.

### Phase 4: Remote Repository Synchronization
Initiate push operation to upstream GitHub repository. Ensure all local commits are transmitted to remote origin. Verify successful synchronization and branch state alignment. Confirm the short commit hash is now visible on GitHub and will propagate to Vercel deployments.

### Phase 5: Commit-Indexed Documentation Archive
Using the **actual 7-character commit hash obtained from Phase 3**, generate comprehensive changelog entry in Markdown format. Create log file with exact commit hash as filename following strict nomenclature: `{commit-hash}-log.md` (e.g., `38bc237-log.md`) within designated directory path `/context/logs`. This ensures the log filename matches exactly the identifier displayed on GitHub commits and Vercel deployment references. Document modified files, change summaries, technical implementation notes, development context, and rationale. Each log file serves as a permanent, searchable record with its filename matching the short SHA displayed across all platforms for seamless cross-reference between GitHub, Vercel, and local documentation.

Execute this automated development checkpoint procedure without delay, committing and pushing first to obtain the actual commit hash, then creating the corresponding documentation file with that exact identifier for unified version history tracking.