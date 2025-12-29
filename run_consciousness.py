"""
Consciousness System Launcher
Start the interactive dialogue interface
"""

import asyncio
import sys
from pathlib import Path

# Add src to path
src_path = Path(__file__).parent / 'src'
sys.path.insert(0, str(src_path))

# Verify src directory exists
if not src_path.exists():
    print(f"Error: src directory not found at {src_path}", file=sys.stderr)
    sys.exit(1)

# Verify dialogue_interface.py exists
dialogue_file = src_path / 'dialogue_interface.py'
if not dialogue_file.exists():
    print(f"Error: dialogue_interface.py not found at {dialogue_file}", file=sys.stderr)
    sys.exit(1)

from src.dialogue_interface import main


if __name__ == "__main__":
    print("\n🧠 Consciousness System Initializing...\n")
    asyncio.run(main())
