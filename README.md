# AP Wire Terminal

Dense Bloomberg-style **all-news** wire terminal.

- Black background + amber text
- Larger readable type (18px base)
- Real dated wires only (AP, Reuters, Bloomberg, Yahoo, ASCO Post, ASCO Daily News, ESMO Daily Reporter, AFP, BBC, SCMP, Nikkei, STAT, FiercePharma, HK01)
- Source chip appears only when a dated item exists for that wire
- No invented copy, no fake bylines, no X posts
- **DELAYED** U.S. cash tape locked to official AP closes, Monday 31 Aug 2026 4 p.m. EDT:
  - DJIA 53,185.90 (−374.09, −0.7%)
  - SPX 7,686.14 (−25.62, −0.3%)
  - COMP 26,370.89 (−31.53, −0.1%)
  - No Russell 2000 — AP did not print a RUT close in the Monday wrap
  - Tuesday U.S. cash session is open; do not invent a Tuesday 4 p.m. close
- **DELAYED** Asia/Europe prints from AP Elaine Kurtenbach, Tuesday 1 Sep 2026:
  - Hang Seng 25,329.73 (−0.9%)
  - Shanghai 3,979.89 (−0.2%)
  - Nikkei 66,215.34 (−0.2%)
  - Kospi 6,835.80 (+0.2%)
  - ASX 9,066.70 (−0.1%)
  - DAX 25,982.28 (−1.1%)
  - CAC 8,303.65 (−0.4%)
  - FTSE 10,702.25 (−1.1%)
- On-demand **REFRESH** (button or `R`) merges reachable RSS from allowed wires on top of the verified seed. Seeded wires never drop. Filter resets to ALL. Busy state keeps the R hint.
- Seed stamped to the latest real wire time: **Tue 1 Sep 2026 9:27 p.m. HKT** (SCMP/AP Ternus takes Apple CEO). New dated wires merged: Bloomberg official Shein HKEX close HK$48.50 after a 10% dip to HK$43.72; Reuters/Bloomberg two Saudi VLCCs (Sidr, Senegal Prosperity) struck in Hormuz; STAT Paxlovid long-Covid miss (Helen Branswell); STAT MAHA dietitian crunch; Reuters Anthropic–Lambda $35bn cloud. Prior verified seed retained. No invented Tuesday U.S. cash close.

**Live preview:**  
https://htmlpreview.github.io/?https://github.com/h55msbkpbm-sudo/ap-news-terminal/blob/main/index.html

Not affiliated with The Associated Press or any listed source. Research / demo only.
