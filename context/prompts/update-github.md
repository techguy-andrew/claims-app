# Git Repository Synchronization and Documentation Protocol

Execute comprehensive version control operations with automated change analysis and commit-indexed documentation generation.

## IMMEDIATE EXECUTION DIRECTIVE

### Phase 1: Repository State Analysis
Perform differential analysis of the working directory against the current HEAD reference. Enumerate all modified, staged, and untracked files. Parse file modifications to extract semantic change patterns and identify functional alterations across the codebase.

### Phase 2: Commit Message Generation
Synthesize an industry-standard commit message adhering to conventional commit specifications. Structure the message with appropriate type prefix (feat/fix/docs/style/refactor/test/chore), concise scope identifier, and descriptive subject line. Include detailed body paragraphs documenting rationale, implementation details, and breaking changes where applicable.

### Phase 3: Commit-Indexed Documentation Archive
Generate comprehensive changelog entry in Markdown format with **commit hash as the primary identifier**. Create log file using the short 7-character commit SHA as filename prefix following strict nomenclature: `{short-commit-sha}-log.md` (e.g., `f76a841-log.md`) within designated directory path `/context/logs`. This establishes an immutable reference system linking every git commit to its corresponding detailed documentation file. Document modified files, change summaries, technical implementation notes, development context, and rationale for future reference. Each log file serves as a permanent, searchable record directly correlating to its git commit for seamless historical analysis and codebase archaeology.

### Phase 4: Version Control Operations
Execute git staging operations for all modified and untracked files. Apply generated commit message to create new repository snapshot. Capture the resulting commit SHA for immediate use in documentation filename generation. Validate commit integrity and local repository state consistency.

### Phase 5: Remote Repository Synchronization
Initiate push operation to upstream GitHub repository. Ensure all local commits are transmitted to remote origin. Verify successful synchronization and branch state alignment. Confirm commit-indexed log file creation uses the short 7-character hash of the pushed commit for complete traceability.

Execute this automated development checkpoint procedure without delay, ensuring every commit generates its corresponding hash-indexed documentation file for comprehensive version history tracking.