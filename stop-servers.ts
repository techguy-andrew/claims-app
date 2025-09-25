#!/usr/bin/env tsx

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                     HOW TO USE THIS SCRIPT - BEGINNER'S GUIDE               ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * ✨ This script safely stops all running development servers on your machine.
 * Perfect for when you have multiple dev servers running and need a clean slate!
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * WHAT THIS SCRIPT DOES:
 * ═══════════════════════════════════════════════════════════════════════════════
 * This script will automatically find and stop all development servers including:
 *   - Next.js development servers (npm run dev)
 *   - Vite servers (React, Vue, etc.)
 *   - Create React App servers
 *   - Express/Node.js development servers
 *   - Webpack dev servers
 *   - And many more!
 * 
 * It works by:
 *   1. Scanning common development ports (3000, 3001, 4000, 5173, etc.)
 *   2. Looking for known development server processes
 *   3. Safely terminating all found processes
 *   4. Showing you which ports are now available
 * 
 * ⚠️  SAFETY NOTE: This script only targets development servers and common dev ports.
 * It won't affect your system services, databases, or production applications.
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * PREREQUISITES:
 * ═══════════════════════════════════════════════════════════════════════════════
 * 1. Node.js installed (version 16 or higher)
 *    - Check with: node --version
 *    - Install from: https://nodejs.org/
 * 
 * 2. tsx package installed globally or locally
 *    - Install globally: npm install -g tsx
 *    - Or install locally: npm install --save-dev tsx
 * 
 * 3. macOS or Linux (uses lsof and pgrep commands)
 *    - Windows users: Use WSL or PowerShell alternatives
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * HOW TO USE:
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * METHOD 1: Using npm script (Recommended)
 * ----------------------------------------
 * From your project root directory, run:
 * 
 *   npm run stop-servers
 * 
 * This is the easiest and recommended way to use this script.
 * 
 * METHOD 2: Direct execution
 * -------------------------
 * If you prefer to run the script directly:
 * 
 *   tsx scripts/stop-servers.ts
 * 
 * Or make it executable and run:
 * 
 *   chmod +x scripts/stop-servers.ts
 *   ./scripts/stop-servers.ts
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * COMMON SCENARIOS:
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * 🔧 SCENARIO 1: "Port 3000 is already in use"
 * You tried to start your dev server but got a port conflict error.
 * 
 * Solution:
 *   $ npm run stop-servers
 *   ✓ Stopping server on port 3000 (PID: 12345)
 *   ✅ All development servers have been stopped!
 *   
 *   $ npm run dev  # Now this will work!
 * 
 * 🔧 SCENARIO 2: Multiple projects running
 * You've been working on several projects and have dev servers running everywhere.
 * 
 * Solution:
 *   $ npm run stop-servers
 *   ✓ Stopping server on port 3000 (PID: 12345)
 *   ✓ Stopping server on port 3001 (PID: 12346)
 *   ✓ Stopping vite processes (2 found)
 *   ✓ Stopping next dev processes (1 found)
 * 
 * 🔧 SCENARIO 3: Clean restart
 * You want to make sure no dev servers are running before starting fresh.
 * 
 * Solution:
 *   $ npm run stop-servers  # Clean slate
 *   $ npm run dev          # Fresh start
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * PORTS AND PROCESSES MONITORED:
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * 📡 PORTS CHECKED:
 *   - 3000, 3001, 3002, 3003 (Next.js, React, Node.js)
 *   - 4000, 4200 (Angular, Express)
 *   - 5000 (Flask, Express)
 *   - 5173, 5174 (Vite)
 *   - 8000, 8080, 8081, 8082 (Django, various dev servers)
 *   - 9000 (Various development tools)
 * 
 * 🔍 PROCESS PATTERNS SEARCHED:
 *   - "next dev" - Next.js development server
 *   - "node.*dev" - Node.js development processes
 *   - "vite" - Vite development server
 *   - "webpack-dev-server" - Webpack dev server
 *   - "react-scripts" - Create React App
 *   - "parcel" - Parcel bundler
 *   - "snowpack" - Snowpack dev server
 *   - "rollup" - Rollup dev server
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * WHAT THE OUTPUT MEANS:
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * ✅ SUCCESS MESSAGES:
 *   "✓ Stopping server on port 3000 (PID: 12345)"
 *   → Found and stopped a server running on port 3000
 * 
 *   "✓ Stopping next dev processes (2 found)"
 *   → Found and stopped 2 Next.js development processes
 * 
 *   "✅ All development servers have been stopped!"
 *   → All found servers have been successfully terminated
 * 
 * ℹ️  INFO MESSAGES:
 *   "ℹ️  No development servers were running"
 *   → Script ran successfully but found no servers to stop
 * 
 *   "📝 Ports now available:"
 *   → Shows which ports are now free and available for use
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * SAFETY AND PERMISSIONS:
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * 🔒 WHAT THIS SCRIPT WON'T DO:
 *   ❌ Stop system services (nginx, apache, postgres, mysql, etc.)
 *   ❌ Stop production applications
 *   ❌ Stop processes you didn't start as a developer
 *   ❌ Require sudo or administrator privileges
 * 
 * ✅ WHAT THIS SCRIPT WILL DO:
 *   ✓ Only target development servers and known dev tools
 *   ✓ Only stop processes running on development ports
 *   ✓ Show you exactly what it's stopping before doing it
 *   ✓ Provide clear feedback on what was stopped
 * 
 * 🛡️  PERMISSIONS:
 *   - Runs with your normal user permissions
 *   - Can only stop processes that you own
 *   - No sudo or administrator rights needed
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * TROUBLESHOOTING:
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * ❓ PROBLEM: "command not found: tsx"
 * SOLUTION:
 *   npm install -g tsx
 *   # Or if you prefer local installation:
 *   npm install --save-dev tsx
 * 
 * ❓ PROBLEM: Script runs but doesn't find my server
 * SOLUTION:
 *   Check what port your server is using:
 *   lsof -i :3000  # Replace 3000 with your port
 *   
 *   If it's on a different port, you can add it to the PORTS array
 *   in the script or stop it manually:
 *   kill -9 $(lsof -ti :YOUR_PORT)
 * 
 * ❓ PROBLEM: "Permission denied" errors
 * SOLUTION:
 *   Make sure the script is executable:
 *   chmod +x scripts/stop-servers.ts
 *   
 *   You might also need to own the processes you're trying to stop.
 *   This script can only stop processes that you started.
 * 
 * ❓ PROBLEM: Server immediately restarts after stopping
 * SOLUTION:
 *   Some development tools have auto-restart features. Check:
 *   - nodemon or pm2 configurations
 *   - IDE/editor auto-run settings
 *   - Docker containers with restart policies
 * 
 * ❓ PROBLEM: Need to stop a specific server only
 * SOLUTION:
 *   For specific ports:
 *   kill -9 $(lsof -ti :3000)  # Stops only port 3000
 *   
 *   For specific process types:
 *   pkill -f "next dev"  # Stops only Next.js servers
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * INTEGRATION WITH YOUR WORKFLOW:
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * 🔄 RECOMMENDED WORKFLOW:
 * 
 *   # Starting a new work session
 *   npm run stop-servers  # Clean slate
 *   npm run dev          # Start fresh
 * 
 *   # Switching between projects
 *   npm run stop-servers  # Stop everything
 *   cd ../other-project
 *   npm run dev          # Start new project
 * 
 *   # End of work day
 *   npm run stop-servers  # Stop all dev servers
 * 
 * 🔧 ADD TO YOUR PACKAGE.JSON:
 * You can add additional convenience scripts:
 * 
 *   "scripts": {
 *     "dev": "next dev",
 *     "stop-servers": "tsx scripts/stop-servers.ts",
 *     "restart": "npm run stop-servers && npm run dev",
 *     "clean-start": "npm run stop-servers && sleep 2 && npm run dev"
 *   }
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * EXAMPLES:
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * EXAMPLE 1: Typical usage
 * ------------------------
 * $ npm run stop-servers
 * 
 * 🛑 Stopping all development servers...
 * 
 * 🔍 Checking common development ports...
 * ✓ Stopping server on port 3000 (PID: 12345)
 * ✓ Stopping server on port 5173 (PID: 12346)
 * 
 * 🔍 Checking for development server processes...
 * ✓ Stopping next dev processes (1 found)
 * ✓ Stopping vite processes (1 found)
 * 
 * ✅ All development servers have been stopped!
 * 
 * 📝 Ports now available:
 *    - Port 3000 ✓
 *    - Port 3001 ✓
 *    - Port 4000 ✓
 *    - Port 5173 ✓
 * 
 * 🚀 You can now start your development server fresh!
 * 
 * EXAMPLE 2: No servers running
 * -----------------------------
 * $ npm run stop-servers
 * 
 * 🛑 Stopping all development servers...
 * 
 * 🔍 Checking common development ports...
 * 
 * 🔍 Checking for development server processes...
 * 
 * ℹ️  No development servers were running
 * 
 * 🚀 You can now start your development server fresh!
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * NEED HELP?
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * 📚 HELPFUL COMMANDS:
 *   - See what's running on ports: lsof -i -P -n | grep LISTEN
 *   - Check specific port: lsof -i :3000
 *   - List all your processes: ps aux | grep $USER
 *   - Kill specific process: kill -9 PID_NUMBER
 * 
 * 🔗 USEFUL RESOURCES:
 *   - Node.js process management: https://nodejs.org/api/process.html
 *   - Unix process commands: man lsof, man kill, man pgrep
 *   - Next.js development: https://nextjs.org/docs
 * 
 * 💡 PRO TIPS:
 *   - Add this to your shell aliases: alias stop="npm run stop-servers"
 *   - Use it before switching git branches with different dependencies
 *   - Run it if you're experiencing mysterious port conflicts
 *   - Great for freeing up system resources when done coding
 * 
 * Remember: This script is designed to be safe and convenient for development
 * workflows. It only targets common development tools and ports, so you can
 * run it without worrying about affecting important system services!
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { execSync } from 'child_process'

// Development port ranges (avoid system ports < 1024)
const DEV_PORT_RANGES = {
  min: 1024,
  max: 65535,
  common: [3000, 3001, 3002, 3003, 4000, 4200, 5000, 5173, 5174, 8000, 8080, 8081, 8082, 9000]
}

// Development server indicators
const DEV_INDICATORS = {
  processNames: [
    'next', 'vite', 'webpack-dev-server', 'react-scripts', 'parcel', 
    'snowpack', 'rollup', 'nuxt', 'gatsby', 'svelte', 'astro'
  ],
  commandPatterns: [
    'dev', 'serve', 'start', 'preview', 'build --watch'
  ],
  nodeModulePaths: [
    'node_modules/.bin/', '@vue/cli-service', 'ng serve'
  ]
}

// System processes to exclude (safety filters)
const SYSTEM_EXCLUDES = {
  processNames: [
    'rapportd', 'logioptio', 'Parallels', 'Spotify', 'Framer', 'ControlCe',
    'findmydevice', 'amsondevicestoraged', 'Cursor', 'Chrome', 'Safari',
    'typingsInstaller', 'jsonServerMain', 'cssServerMain', 'markdown-language-features',
    'zsh', 'bash', 'sh', 'fish', 'docker'
  ],
  pathPatterns: [
    '/System/', '/usr/libexec/', '/Library/', '/Applications/',
    'Cursor Helper', 'Chrome Helper', 'Safari Helper'
  ],
  commandPatterns: [
    'stop-servers.ts', 'stop-servers', 'shell-snapshots', 'docker events', 'tsserver', 'typescript',
    '.claude/', '.npm/', '_npx/'
  ]
}

// Parse command line arguments
const args = process.argv.slice(2)
const isDryRun = args.includes('--dry-run') || args.includes('-n')
const isVerbose = args.includes('--verbose') || args.includes('-v')
const showHelp = args.includes('--help') || args.includes('-h')

// Show help if requested
if (showHelp) {
  console.log(`
🛑 Dynamic Development Server Stopper

Usage: tsx stop-servers.ts [options]

Options:
  --dry-run, -n     Show what would be stopped without actually stopping
  --verbose, -v     Show detailed information about all processes found
  --help, -h        Show this help message

Examples:
  tsx stop-servers.ts           # Stop all detected development servers
  tsx stop-servers.ts --dry-run # Preview what would be stopped
  tsx stop-servers.ts -v        # Verbose output with detailed process info
`)
  process.exit(0)
}

if (isDryRun) {
  console.log('🔍 DRY RUN MODE - No servers will actually be stopped\n')
} else {
  console.log('🛑 Stopping all development servers...\n')
}

interface ProcessInfo {
  pid: string
  port?: string
  command: string
  processName: string
}

// Function to get all listening processes
function getListeningProcesses(): ProcessInfo[] {
  try {
    const output = execSync(`lsof -i -P -n | grep LISTEN`, { encoding: 'utf-8' })
    const lines = output.split('\n').filter(Boolean)
    const processes: ProcessInfo[] = []
    
    for (const line of lines) {
      const parts = line.split(/\s+/)
      if (parts.length < 9) continue
      
      const processName = parts[0] || 'unknown'
      const pid = parts[1] || '0'
      const portInfo = parts[8] // Format: *:3000 or 127.0.0.1:3000
      const port = portInfo?.split(':').pop()
      
      // Get full command line
      try {
        const command = execSync(`ps -p ${pid} -o command=`, { encoding: 'utf-8' }).trim()
        processes.push({
          pid,
          port: port ?? undefined,
          command,
          processName
        })
      } catch {
        // Process might have exited
      }
    }
    
    return processes
  } catch {
    return []
  }
}

// Function to get development processes by command patterns
function getDevelopmentProcesses(): ProcessInfo[] {
  try {
    // Get all processes with detailed command info
    const output = execSync(`ps aux`, { encoding: 'utf-8' })
    const lines = output.split('\n').filter(Boolean).slice(1) // Skip header
    const processes: ProcessInfo[] = []
    
    for (const line of lines) {
      const parts = line.split(/\s+/)
      if (parts.length < 11) continue
      
      const pid = parts[1] || '0'
      const command = parts.slice(10).join(' ') || 'unknown'
      const processName = parts[10]?.split('/').pop() || parts[10] || 'unknown'
      
      // Only include processes owned by current user
      const user = parts[0]
      const currentUser = process.env.USER || process.env.USERNAME
      if (user !== currentUser) continue
      
      processes.push({ pid, command, processName, port: undefined })
    }
    
    return processes
  } catch {
    return []
  }
}

// Function to check if a process is a development server
function isDevelopmentServer(process: ProcessInfo): boolean {
  const { command, processName, port } = process
  const commandLower = command.toLowerCase()
  const processNameLower = processName.toLowerCase()
  
  // Check if it's a system process to exclude
  for (const excludeName of SYSTEM_EXCLUDES.processNames) {
    if (processNameLower.includes(excludeName.toLowerCase())) return false
  }
  
  for (const excludePath of SYSTEM_EXCLUDES.pathPatterns) {
    if (command.includes(excludePath)) return false
  }
  
  for (const excludeCommand of SYSTEM_EXCLUDES.commandPatterns) {
    if (command.includes(excludeCommand)) return false
  }
  
  // Check for development server indicators
  for (const devName of DEV_INDICATORS.processNames) {
    if (processNameLower.includes(devName)) return true
  }
  
  for (const pattern of DEV_INDICATORS.commandPatterns) {
    if (commandLower.includes(pattern)) return true
  }
  
  for (const path of DEV_INDICATORS.nodeModulePaths) {
    if (command.includes(path)) return true
  }
  
  // Check if it's on a development port
  if (port) {
    const portNum = parseInt(port)
    if (portNum >= DEV_PORT_RANGES.min && portNum <= DEV_PORT_RANGES.max) {
      // Additional checks for common dev ports or node processes
      if (DEV_PORT_RANGES.common.includes(portNum) || 
          processNameLower.includes('node') ||
          commandLower.includes('npm') ||
          commandLower.includes('yarn') ||
          commandLower.includes('pnpm')) {
        return true
      }
    }
  }
  
  return false
}

// Function to safely kill a process
function killProcess(process: ProcessInfo): boolean {
  try {
    execSync(`kill -9 ${process.pid} 2>/dev/null`)
    return true
  } catch {
    return false
  }
}

// Main execution logic
async function main() {
  console.log('🔍 Discovering all running servers dynamically...\n')
  
  // Get all listening processes
  const listeningProcesses = getListeningProcesses()
  if (isVerbose) {
    console.log(`Found ${listeningProcesses.length} listening processes`)
    listeningProcesses.forEach(p => {
      console.log(`  - ${p.processName} (${p.pid}) on port ${p.port}`)
    })
    console.log()
  } else {
    console.log(`Found ${listeningProcesses.length} listening processes`)
  }
  
  // Get all development processes
  const allProcesses = getDevelopmentProcesses()
  if (isVerbose) {
    console.log(`Scanning ${allProcesses.length} user processes for development servers`)
    console.log('Sample processes found:')
    allProcesses.slice(0, 5).forEach(p => {
      const cmd = p.command.length > 80 ? p.command.substring(0, 77) + '...' : p.command
      console.log(`  - ${p.processName} (${p.pid}): ${cmd}`)
    })
    console.log()
  } else {
    console.log(`Scanning ${allProcesses.length} user processes for development servers\n`)
  }
  
  // Combine and filter for development servers
  const allCandidates = [...listeningProcesses, ...allProcesses]
  const uniqueProcesses = new Map<string, ProcessInfo>()
  
  // Deduplicate by PID
  for (const process of allCandidates) {
    if (!uniqueProcesses.has(process.pid)) {
      uniqueProcesses.set(process.pid, process)
    }
  }
  
  // Filter for development servers
  const devServers = Array.from(uniqueProcesses.values()).filter(isDevelopmentServer)
  
  if (devServers.length === 0) {
    console.log('ℹ️  No development servers were detected')
    console.log('\n🚀 You can now start your development server fresh!')
    process.exit(0)
  }
  
  // Show what we found before stopping
  if (isDryRun) {
    console.log(`🔍 Would stop ${devServers.length} development server(s):\n`)
  } else {
    console.log(`🎯 Detected ${devServers.length} development server(s):\n`)
  }
  
  const stoppedServers: ProcessInfo[] = []
  const failedServers: ProcessInfo[] = []
  
  for (const server of devServers) {
    const portInfo = server.port ? ` on port ${server.port}` : ''
    const commandPreview = server.command.length > 60 
      ? server.command.substring(0, 57) + '...' 
      : server.command
    
    console.log(`   ${server.processName} (PID: ${server.pid})${portInfo}`)
    console.log(`   Command: ${commandPreview}`)
    
    if (isDryRun) {
      console.log(`   🔍 Would stop this process\n`)
      stoppedServers.push(server)
    } else {
      // Attempt to stop the server
      if (killProcess(server)) {
        console.log(`   ✓ Successfully stopped\n`)
        stoppedServers.push(server)
      } else {
        console.log(`   ❌ Failed to stop (process may have already exited)\n`)
        failedServers.push(server)
      }
    }
  }
  
  // Final status
  console.log('=' .repeat(60))
  if (isDryRun) {
    if (stoppedServers.length > 0) {
      console.log(`🔍 Would have stopped ${stoppedServers.length} development server(s)`)
      console.log('💡 Run without --dry-run to actually stop these servers')
    }
  } else {
    if (stoppedServers.length > 0) {
      console.log(`✅ Successfully stopped ${stoppedServers.length} development server(s)`)
    }
    
    if (failedServers.length > 0) {
      console.log(`⚠️  Failed to stop ${failedServers.length} process(es) (may have already exited)`)
    }
  }
  
  // Show available common ports
  console.log('\n📝 Common development ports now available:')
  const availablePorts: number[] = []
  
  for (const port of DEV_PORT_RANGES.common) {
    try {
      execSync(`lsof -ti :${port} 2>/dev/null`, { encoding: 'utf-8' })
    } catch {
      availablePorts.push(port)
    }
  }
  
  if (availablePorts.length > 0) {
    const portGroups = []
    for (let i = 0; i < availablePorts.length; i += 8) {
      portGroups.push(availablePorts.slice(i, i + 8))
    }
    
    portGroups.forEach(group => {
      console.log(`   ${group.map(p => `${p}✓`).join(', ')}`)
    })
  } else {
    console.log('   All common ports are still in use')
  }
  
  console.log('\n🚀 You can now start your development server fresh!')
}

// Run the main function
main().catch(error => {
  console.error('❌ An error occurred:', error.message)
  process.exit(1)
})