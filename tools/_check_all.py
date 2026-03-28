#!/usr/bin/env python3
import subprocess, os, sys

base = '/Users/nishantchaudhary/Desktop/my-turborepo'
tools = sorted([d for d in os.listdir(os.path.join(base, 'tools')) 
                if os.path.isdir(os.path.join(base, 'tools', d)) 
                and os.path.exists(os.path.join(base, 'tools', d, 'tsconfig.json'))])

for tool in tools:
    tool_dir = os.path.join(base, 'tools', tool)
    tsc = os.path.join(tool_dir, 'node_modules', '.bin', 'tsc')
    if not os.path.exists(tsc):
        print(f'MISS {tool} - no tsc')
        continue
    try:
        r = subprocess.run([tsc, '--noEmit'], cwd=tool_dir, capture_output=True, text=True, timeout=60)
        errors = [l for l in (r.stderr + r.stdout).split('\n') if 'error TS' in l]
        if errors:
            print(f'FAIL {tool} ({len(errors)} errors):')
            for e in errors[:3]:
                print(f'  {e[:120]}')
        else:
            print(f'OK   {tool}')
    except subprocess.TimeoutExpired:
        print(f'TIME {tool}')
