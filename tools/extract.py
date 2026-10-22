"""Regenerates src/faces.js from the Bible's SVGs (zero-design/zero-expresiones.svg and pix-expresiones.svg).
Usage: python3 tools/extract.py <zero-design folder>"""
import json, re, sys

HEAD = '<path d="M 92.2 20.6 A 50 50 0 1 1 72 28.5 L 83.1 33.7 L 86 17.8 Z" fill="#FFFFFF" stroke="#111111" stroke-width="6" stroke-linejoin="round"/>'
PIX_BODY = '<circle cx="50" cy="51" r="21" fill="#FFE38A"/>'


def groups(fn):
    s = re.sub(r'<metadata>.*?</metadata>', '', open(fn).read(), flags=re.S)
    body = s[s.index('>', s.index('<svg')) + 1:s.rindex('</svg>')]
    out, depth, start = [], 0, 0
    for m in re.finditer(r'<g\b[^>]*>|</g>', body):
        if m.group().startswith('</'):
            depth -= 1
            if depth == 0:
                out.append(body[start:m.end()])
        else:
            if depth == 0:
                start = m.start()
            depth += 1
    return out


def main(folder):
    faces = []
    for g in groups(f'{folder}/zero-expresiones.svg'):
        inner = g[re.match(r'<g transform="translate\([-\d.]+ [-\d.]+\)">', g).end():-4]
        assert inner.startswith(HEAD)
        faces.append(inner[len(HEAD):])
    pix = []
    for g in groups(f'{folder}/pix-expresiones.svg'):
        rest = g[g.find(PIX_BODY) + len(PIX_BODY):]
        k = rest.index('</g>')
        pix.append({'face': rest[:k], 'fx': rest[k + 4:-4]})
    js = ('// Generated from zero-design/*.svg by tools/extract.py. Do not edit by hand.\n'
          f'window.ZERO_FACES = {json.dumps(faces)};\nwindow.PIX_FACES = {json.dumps(pix)};\n')
    open('src/faces.js', 'w').write(js)


if __name__ == '__main__':
    main(sys.argv[1])
