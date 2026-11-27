#!/usr/bin/env python3
"""Cache-bust the agentic assets: append ?v=<stamp> to agentic.css, agentic.js, agents3d.js and site-mode.js
in every HTML page. Run it before each push that changes those files:  python3 scripts/stamp-version.py
"""
import os, re, sys, time
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
args = [a for a in sys.argv[1:] if a != '--all']
ALL = '--all' in sys.argv  # --all also re-stamps the standard pages (needed only when js/site-mode.js changes)
stamp = args[0] if args else time.strftime('%Y%m%d%H%M')
pat = re.compile(r'((?:agentic\.css|agentic\.js|agents3d\.js|hww\.css|hww\.js|hww3d\.js|products\.css|products\.js|site-mode\.js))(\?v=[0-9A-Za-z]+)?(")')
n = 0
for d, _, fs in os.walk(ROOT):
    if any(x in d for x in ('/.git', '/node_modules', '/scripts', '/change-requests')): continue
    if not ALL and not (d + '/').startswith(ROOT + '/agentic/'): continue
    for f in fs:
        if not f.endswith('.html'): continue
        p = os.path.join(d, f)
        t = open(p, encoding='utf8').read()
        u = pat.sub(lambda m: f'{m.group(1)}?v={stamp}{m.group(3)}', t)
        if u != t: open(p, 'w', encoding='utf8').write(u); n += 1
print(f'stamped {n} pages with v={stamp}')
