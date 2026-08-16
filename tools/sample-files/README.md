# Sample-file generator

Generates synthetic, Bunzl-shaped `.xlsx`/`.pptx`/`.docx` knowledge-worker sample files into
`assets/lab-data/`. Business-segment names are public (Bunzl's own reporting structure);
every number is invented for training — never real Bunzl financials.

## Usage

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python generate.py
.venv/bin/python test_generate.py   # validates the generated files round-trip correctly
```

Extend `SOURCE_DATA`-style dicts at the top of `generate.py` to add track-specific lab
scenarios in later phases — keep the rendering functions (`generate_xlsx`/`generate_pptx`/
`generate_docx`) generic and put new content in data, not new render functions, unless the
shape genuinely differs.
