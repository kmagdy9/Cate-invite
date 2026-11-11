/* =========================================================================================
   cycle.js — "The Running Cycle" (invitation scene 02)
   The GA VSD⁺ + ICD dryer schematic from the Compressor Live Demo (compressor-demo-main:
   index.html artwork, app.js pipe routing / labels / timeline), driven here as a scripted
   start-up: start pressed → intake → compression → oil separation → cooling → drying → to plant.
   No user controls, no simulation: every value is a smooth function of the scene clock.
   ========================================================================================= */
const Cycle = (() => {
'use strict';
const NS = 'http://www.w3.org/2000/svg';
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = k => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
const sm = (t, a, b) => { const k = clamp((t - a) / (b - a), 0, 1); return k * k * (3 - 2 * k); };   // smoothstep of t over [a,b]
const fmt = (v, d = 1) => (Number.isFinite(v) ? v.toFixed(d) : '--');
function svgEl(tag, attrs, parent) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
function mixColor(a, b, k) {
  const pa = a.match(/\w\w/g).map(h => parseInt(h, 16)), pb = b.match(/\w\w/g).map(h => parseInt(h, 16));
  return '#' + pa.map((v, i) => Math.round(lerp(v, pb[i], k)).toString(16).padStart(2, '0')).join('');
}

/* ---------- artwork: the demo's schematic, verbatim (ids #svg/#fx/#gHub renamed to avoid clashes) ---------- */
const SVG = `
      <svg id="cySvg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Oil-injected screw compressor with integrated desiccant dryer">
        <defs>
          <radialGradient id="gBg" cx=".45" cy=".4" r=".8"><stop offset="0" class="bg1"/><stop offset="1" class="bg2"/></radialGradient>
          <pattern id="pGrid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" class="grid-line"/></pattern>

          <linearGradient id="gMetal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f5f8fa"/><stop offset=".45" stop-color="#c6cfd5"/><stop offset=".56" stop-color="#a6b1b9"/><stop offset="1" stop-color="#e0e6ea"/></linearGradient>
          <linearGradient id="gMetalH" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#717e88"/><stop offset=".22" stop-color="#eef2f4"/><stop offset=".5" stop-color="#c3ccd2"/><stop offset=".82" stop-color="#8b97a0"/><stop offset="1" stop-color="#626e77"/></linearGradient>
          <linearGradient id="gCast" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a8892"/><stop offset=".18" stop-color="#5b6871"/><stop offset=".6" stop-color="#434f57"/><stop offset="1" stop-color="#2b3338"/></linearGradient>
          <linearGradient id="gPaint" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5fa6e6"/><stop offset=".35" stop-color="#2f74b8"/><stop offset=".75" stop-color="#1d5590"/><stop offset="1" stop-color="#123c69"/></linearGradient>
          <linearGradient id="gPaintH" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#143c66"/><stop offset=".25" stop-color="#4f93d2"/><stop offset=".55" stop-color="#2f72b5"/><stop offset="1" stop-color="#103457"/></linearGradient>
          <linearGradient id="gVessel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4f5e69"/><stop offset=".22" stop-color="#dfe6ea"/><stop offset=".5" stop-color="#b3bfc7"/><stop offset=".85" stop-color="#6a7984"/><stop offset="1" stop-color="#46545e"/></linearGradient>
          <linearGradient id="gTower" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7a8892"/><stop offset=".26" stop-color="#f5f8fa"/><stop offset=".6" stop-color="#d1d9de"/><stop offset="1" stop-color="#6f7d87"/></linearGradient>
          <linearGradient id="gDark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3d464d"/><stop offset="1" stop-color="#1b2024"/></linearGradient>
          <linearGradient id="gInterior" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#172025"/><stop offset="1" stop-color="#2b353c"/></linearGradient>
          <linearGradient id="gOil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd27a"/><stop offset=".15" stop-color="#f0ac3c"/><stop offset="1" stop-color="#a65f08"/></linearGradient>
          <linearGradient id="gOilOld" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a5524"/><stop offset=".15" stop-color="#4a3012"/><stop offset="1" stop-color="#1c1006"/></linearGradient>
          <linearGradient id="gWater" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd0f2"/><stop offset="1" stop-color="#2b78ad"/></linearGradient>
          <linearGradient id="gRotShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".6"/><stop offset=".28" stop-color="#fff" stop-opacity=".32"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".65"/></linearGradient>
          <linearGradient id="gGlassHi" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".12" stop-color="#fff" stop-opacity=".28"/><stop offset=".24" stop-color="#fff" stop-opacity="0"/></linearGradient>
          <linearGradient id="gOilHdr" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8a5a12"/><stop offset=".35" stop-color="#e8aa4c"/><stop offset="1" stop-color="#7a4d0c"/></linearGradient>
          <linearGradient id="gLcd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9ec6b"/><stop offset="1" stop-color="#8fcf3f"/></linearGradient>
          <radialGradient id="gFace" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#d3dbe1"/></radialGradient>
          <radialGradient id="cyGHub" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#f0f3f5"/><stop offset="1" stop-color="#6b7780"/></radialGradient>
          <radialGradient id="gRed" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#ff7a6e"/><stop offset="1" stop-color="#b3170c"/></radialGradient>
          <radialGradient id="gGreen" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#7cf0a6"/><stop offset="1" stop-color="#138a43"/></radialGradient>

          <pattern id="pRotM" width="24" height="46" patternUnits="userSpaceOnUse" patternTransform="translate(0 297)"><rect width="24" height="46" fill="#4f5c65"/><path d="M0 46 L13 0 H23 L10 46Z" fill="#dfe6eb"/><path d="M10 46 L23 0" stroke="#1d2428" stroke-width="1.6"/><path d="M2 46 L15 0" stroke="#fff" stroke-opacity=".6" stroke-width="1"/></pattern>
          <pattern id="pRotF" width="18" height="46" patternUnits="userSpaceOnUse" patternTransform="translate(0 347)"><rect width="18" height="46" fill="#46525a"/><path d="M0 0 H8 L17 46 H9Z" fill="#cfd8de"/><path d="M8 0 L17 46" stroke="#1d2428" stroke-width="1.4"/></pattern>
          <pattern id="pCooler" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#c4ced5"/><path d="M0 0 L5 10 L10 0" fill="none" stroke="#56636c" stroke-width="1.1"/></pattern>
          <pattern id="pPleat" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#eadfbd"/><path d="M4 0V8" stroke="#a8955d" stroke-width="2"/></pattern>
          <pattern id="pMedia" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#ddd2b2"/><path d="M0 8L8 0M-2 2L2 -2M6 10L10 6" stroke="#8c7f5f" stroke-width="1.1"/></pattern>
          <pattern id="pBeads" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="3" cy="4" r="2.5" fill="#fff" fill-opacity=".9"/><circle cx="10" cy="9" r="2.3" fill="#fff" fill-opacity=".85"/><circle cx="6" cy="12" r="1.6" fill="#fff" fill-opacity=".7"/><circle cx="12" cy="2" r="1.6" fill="#fff" fill-opacity=".75"/></pattern>
          <pattern id="pFins" width="200" height="8" patternUnits="userSpaceOnUse"><path d="M0 7.5H200" stroke="#000" stroke-opacity=".28" stroke-width="1.4"/><path d="M0 1H200" stroke="#fff" stroke-opacity=".12"/></pattern>
          <pattern id="pHeat" width="7" height="10" patternUnits="userSpaceOnUse"><path d="M3.5 0V10" stroke="#000" stroke-opacity=".38" stroke-width="2.4"/></pattern>
          <pattern id="pPerf" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#b9c3ca"/><circle cx="3" cy="3" r="1.3" fill="#2a3237"/></pattern>
          <pattern id="pWear" width="34" height="22" patternUnits="userSpaceOnUse"><path d="M2 4 l14 3 M18 12 l12 4 M6 17 l9 -2 M24 3 l7 5" stroke="#b45309" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="11" r="2" fill="#7c2d12"/></pattern>
          <pattern id="pCoup" width="22" height="10" patternUnits="userSpaceOnUse"><rect width="22" height="10" fill="#c9d1d7"/><rect width="22" height="4" fill="#4c5860"/></pattern>

          <filter id="fGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>

          <clipPath id="cpRot"><rect x="305" y="297" width="240" height="96" rx="8"/></clipPath>
          <clipPath id="cpSep"><rect x="654" y="252" width="132" height="336" rx="44"/></clipPath>
          <clipPath id="cpTA"><rect x="1280" y="292" width="70" height="250" rx="12"/></clipPath>
          <clipPath id="cpTB"><rect x="1460" y="292" width="70" height="250" rx="12"/></clipPath>
          <clipPath id="cpTank"><rect x="1640" y="220" width="60" height="270" rx="10"/></clipPath>
          <clipPath id="cpRS"><path d="M1316 612 H1364 V624 L1349 648 H1331 L1316 624Z"/></clipPath>
          <linearGradient id="gIce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e0f6ff"/><stop offset="1" stop-color="#5fb8e6"/></linearGradient>
          <clipPath id="cpWS"><path d="M1121 400 H1159 V418 L1146 452 H1134 L1121 418Z"/></clipPath>
        </defs>

        <!-- background -->
        <rect x="-3000" y="-3000" width="7600" height="6900" fill="url(#gBg)"/>
        <rect x="-3000" y="-3000" width="7600" height="6900" fill="url(#pGrid)"/>
        <g class="zone-cap"><text x="40" y="866" data-i18n-svg="zoneComp">COMPRESSOR PACKAGE</text><text id="zoneDry" x="1240" y="764" data-i18n-svg="zoneDryer">ICD DRYER</text></g>

        <!-- static signal wiring (controller) -->
        <g class="signals">
          <path class="signal" d="M900 40 H125 V540 H150"/>
          <path class="signal" d="M1190 40 H1549 V50"/>
          <path class="signal" d="M1190 150 H1514 V70"/>
          <path class="signal" d="M900 120 H670 V190"/>
        </g>

        <g id="pipes"></g>
        <g id="flows"></g>

        <!-- ====== PARTS ====== -->
        <!-- Intake filter -->
        <g class="part" data-id="filter">
          <rect x="44" y="430" width="74" height="190" rx="10" fill="url(#gPaintH)" stroke="#0d2a47" stroke-width="2"/>
          <rect x="54" y="456" width="54" height="140" rx="4" fill="#20272c"/>
          <rect x="58" y="460" width="46" height="132" fill="url(#pPleat)"/>
          <rect id="filterDirt" x="58" y="460" width="46" height="132" fill="#4a3a22" opacity="0"/>
          <rect x="58" y="460" width="46" height="132" fill="url(#gGlassHi)"/>
          <rect x="40" y="420" width="82" height="16" rx="5" fill="url(#gMetal)" stroke="#20272c" stroke-width="1.5"/>
          <rect x="40" y="612" width="82" height="14" rx="5" fill="url(#gMetal)" stroke="#20272c" stroke-width="1.5"/>
          <rect x="122" y="470" width="11" height="30" rx="2" fill="#f4f6f8" stroke="#20272c"/>
          <rect id="dpInd" x="124" y="488" width="7" height="10" fill="#22c55e"/>
        </g>

        <!-- Motor -->
        <g class="part" data-id="motor">
          <rect x="150" y="298" width="112" height="96" rx="10" fill="url(#gPaint)" stroke="#0d2a47" stroke-width="2"/>
          <rect x="150" y="298" width="112" height="96" rx="10" fill="url(#pFins)"/>
          <path d="M150 304 Q134 305 132 322 V370 Q134 387 150 388Z" fill="url(#gPaint)" stroke="#0d2a47" stroke-width="2"/>
          <path d="M138 326H148M137 338H148M137 350H148M137 362H148" stroke="#081a2c" stroke-width="2"/>
          <rect x="186" y="281" width="40" height="19" rx="3" fill="url(#gPaint)" stroke="#0d2a47" stroke-width="1.5"/>
          <rect x="160" y="394" width="92" height="10" rx="2" fill="#262d32"/>
          <rect x="190" y="330" width="40" height="22" rx="2" fill="#e5eaee" stroke="#0d2a47"/>
          <text id="mEff" x="210" y="341" class="plate">IE5</text><text id="mType" x="210" y="349" class="plate sm">VSD</text>
          <rect id="coup" x="262" y="333" width="22" height="26" fill="url(#pCoup)" stroke="#20272c" stroke-width="1.5"/>
        </g>

        <!-- VSD drive -->
        <g class="part" data-id="vsd">
          <rect x="150" y="470" width="140" height="150" rx="6" fill="url(#gMetal)" stroke="#20272c" stroke-width="2"/>
          <rect x="160" y="480" width="120" height="44" rx="3" fill="#0c1114" stroke="#000"/>
          <text id="vsdHz" x="220" y="509" class="seg7">-- Hz</text>
          <g id="vsdGrp">
            <rect x="160" y="534" width="104" height="76" rx="2" fill="url(#pHeat)"/>
            <circle id="vsdLed" cx="276" cy="542" r="4.5" fill="#555"/>
            <text x="276" y="562" class="plate sm" style="fill:#33414b">VSD</text>
          </g>
          <g id="ydGrp" style="display:none">
            <rect x="158" y="532" width="124" height="80" rx="2" fill="#d5dce1" stroke="#9aa6ae"/>
            <g class="km"><rect x="164" y="540" width="34" height="56" rx="3" fill="url(#gDark)"/><rect id="km1" x="171" y="548" width="20" height="10" rx="2" fill="#555"/><text x="181" y="590" class="plate sm" style="fill:#e5eaee">K1</text></g>
            <g class="km"><rect x="203" y="540" width="34" height="56" rx="3" fill="url(#gDark)"/><rect id="km2" x="210" y="548" width="20" height="10" rx="2" fill="#555"/><text x="220" y="590" class="plate sm" style="fill:#e5eaee">K2 Y</text></g>
            <g class="km"><rect x="242" y="540" width="34" height="56" rx="3" fill="url(#gDark)"/><rect id="km3" x="249" y="548" width="20" height="10" rx="2" fill="#555"/><text x="259" y="590" class="plate sm" style="fill:#e5eaee">K3 Δ</text></g>
            <path d="M164 604 H276" stroke="#9aa6ae" stroke-width="3"/>
          </g>
        </g>

        <!-- Inlet valve -->
        <g class="part" data-id="inletvalve">
          <path d="M352 196 H418 V252 Q418 262 406 266 L398 282 H372 L364 266 Q352 262 352 252Z" fill="url(#gMetalH)" stroke="#20272c" stroke-width="2"/>
          <rect x="362" y="206" width="46" height="48" rx="4" fill="#161c20"/>
          <rect id="ivPlate" x="364" y="208" width="42" height="8" rx="2" fill="#e6ebef" stroke="#2a3237"/>
          <rect x="381" y="186" width="8" height="14" fill="url(#gMetal)" stroke="#20272c"/>
          <circle id="ivLed" cx="410" cy="200" r="4" fill="#555"/>
        </g>

        <!-- Compressor element -->
        <g class="part" data-id="element">
          <rect x="290" y="280" width="270" height="130" rx="18" fill="url(#gCast)" stroke="#1a2024" stroke-width="2"/>
          <rect x="282" y="300" width="14" height="90" rx="4" fill="url(#gMetal)" stroke="#20272c"/>
          <rect x="554" y="300" width="14" height="90" rx="4" fill="url(#gMetal)" stroke="#20272c"/>
          <rect x="302" y="292" width="246" height="106" rx="10" fill="#12171a" stroke="#0a0d0f" stroke-width="2"/>
          <g clip-path="url(#cpRot)">
            <rect id="rotM" x="305" y="297" width="240" height="46" fill="url(#pRotM)"/>
            <rect x="305" y="297" width="240" height="46" fill="url(#gRotShade)"/>
            <rect id="rotF" x="305" y="347" width="240" height="46" fill="url(#pRotF)"/>
            <rect x="305" y="347" width="240" height="46" fill="url(#gRotShade)"/>
            <g id="oilMistEl"></g>
          </g>
          <rect id="wearOv" x="305" y="297" width="240" height="96" fill="url(#pWear)" opacity="0" clip-path="url(#cpRot)"/>
          <rect id="elHeat" x="302" y="292" width="246" height="106" rx="10" fill="#ff3b1f" opacity="0"/>
          <g id="brgHot" opacity="0" fill="#ff4a1f" filter="url(#fGlow)"><circle cx="289" cy="322" r="8"/><circle cx="289" cy="368" r="8"/><circle cx="561" cy="322" r="8"/><circle cx="561" cy="368" r="8"/></g>
          <text id="elSeize" x="425" y="352" class="seize-txt" opacity="0">SEIZED</text>
          <path d="M302 292 l8 6 l-4 8 l9 5 l-5 9 l8 6" fill="none" stroke="#f5c400" stroke-width="2" opacity=".75"/>
          <g fill="#20272c"><circle cx="300" cy="286" r="2.5"/><circle cx="550" cy="286" r="2.5"/><circle cx="300" cy="404" r="2.5"/><circle cx="550" cy="404" r="2.5"/></g>
        </g>

        <!-- Non-return valve -->
        <g class="part" data-id="nrv">
          <rect x="516" y="416" width="28" height="28" rx="4" fill="url(#gMetalH)" stroke="#20272c" stroke-width="2"/>
          <path id="nrvFlap" d="M522 430 L538 430" stroke="#161c20" stroke-width="3.5" stroke-linecap="round"/>
        </g>

        <!-- Oil separator -->
        <g class="part" data-id="separator">
          <rect x="676" y="604" width="12" height="20" fill="#262d32"/><rect x="752" y="604" width="12" height="20" fill="#262d32"/>
          <rect x="640" y="230" width="160" height="380" rx="56" fill="url(#gVessel)" stroke="#1a2024" stroke-width="2"/>
          <rect x="654" y="252" width="132" height="336" rx="44" fill="url(#gInterior)" stroke="#0a0d0f" stroke-width="2"/>
          <g clip-path="url(#cpSep)">
            <g id="mist"></g>
            <path id="oilSurf" fill="url(#gOil)"/>
          </g>
          <rect x="680" y="256" width="80" height="10" rx="3" fill="url(#gMetal)" stroke="#20272c"/>
          <rect x="688" y="264" width="64" height="150" rx="6" fill="url(#pMedia)" stroke="#5c5236" stroke-width="2"/>
          <rect id="sepDirt" x="688" y="264" width="64" height="150" rx="6" fill="#3a2d18" opacity="0"/>
          <rect x="654" y="252" width="132" height="336" rx="44" fill="url(#gGlassHi)" pointer-events="none"/>
          <text x="720" y="345" class="plate" style="fill:#5c5236;font-size:9px" transform="rotate(-90 720 345)">SEPARATOR ELEMENT</text>
        </g>

        <!-- Sump pressure gauge -->
        <g class="part" data-id="sumpgauge">
          <path d="M640 270 H630" stroke="#9aa6ae" stroke-width="6"/>
          <circle cx="608" cy="270" r="23" fill="url(#gFace)" stroke="#2a3237" stroke-width="3.5"/>
          <g id="ticksSump"></g>
          <path id="ndSump" d="M608 270 L608 252" stroke="#d1291b" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="608" cy="270" r="3" fill="#20272c"/>
        </g>

        <!-- Minimum pressure valve -->
        <g class="part" data-id="mpv">
          <rect x="702" y="196" width="36" height="36" rx="5" fill="url(#gMetalH)" stroke="#20272c" stroke-width="2"/>
          <rect x="708" y="180" width="24" height="18" rx="3" fill="url(#gMetal)" stroke="#20272c" stroke-width="1.5"/>
          <rect id="mpvStem" x="716" y="174" width="8" height="10" rx="1" fill="#d1291b"/>
        </g>

        <!-- Loading solenoid valve Y1: on the oil tank next to the MPV, pilots the inlet valve -->
        <path id="solLine" class="sol-line" d="M650 206 H418"/>
        <circle id="solPulse" cx="650" cy="206" r="5.5" fill="#22c55e" opacity="0"/>
        <g class="part" data-id="solenoid">
          <rect x="664" y="222" width="12" height="16" fill="url(#gMetal)" stroke="#20272c"/>
          <rect x="650" y="190" width="40" height="34" rx="4" fill="#1d2329" stroke="#0a0d0f" stroke-width="2"/>
          <rect id="solCoil" x="655" y="195" width="30" height="20" rx="3" fill="#3a434a"/>
          <text x="670" y="209" class="plate sm" style="fill:#e5eaee">Y1</text>
          <circle id="solLed" cx="684" cy="219" r="3" fill="#555"/>
        </g>

        <!-- Thermostatic valve -->
        <g class="part" data-id="thermostat">
          <rect x="818" y="636" width="28" height="28" rx="5" fill="url(#gMetalH)" stroke="#20272c" stroke-width="2"/>
          <circle id="thInd" cx="832" cy="650" r="7" fill="#3b82f6" stroke="#20272c"/>
        </g>

        <!-- Aftercooler -->
        <g class="part" data-id="aftercooler">
          <rect x="880" y="270" width="200" height="80" rx="4" fill="url(#gMetal)" stroke="#20272c" stroke-width="2"/>
          <rect x="896" y="276" width="168" height="68" fill="url(#pCooler)"/>
          <rect id="acFoul" x="896" y="276" width="168" height="68" fill="#5a4626" opacity="0"/>
          <rect x="880" y="270" width="16" height="80" fill="url(#gMetalH)" stroke="#20272c"/>
          <rect x="1064" y="270" width="16" height="80" fill="url(#gMetalH)" stroke="#20272c"/>
        </g>

        <!-- Oil cooler -->
        <g class="part" data-id="oilcooler">
          <rect x="880" y="380" width="200" height="80" rx="4" fill="url(#gMetal)" stroke="#20272c" stroke-width="2"/>
          <rect x="896" y="386" width="168" height="68" fill="url(#pCooler)"/>
          <rect id="ocFoul" x="896" y="386" width="168" height="68" fill="#5a4626" opacity="0"/>
          <rect x="880" y="380" width="16" height="80" fill="url(#gOilHdr)" stroke="#20272c"/>
          <rect x="1064" y="380" width="16" height="80" fill="url(#gOilHdr)" stroke="#20272c"/>
        </g>

        <!-- Cooling fan -->
        <g class="part" data-id="fan">
          <circle cx="980" cy="562" r="62" fill="url(#gDark)" stroke="#0b0e10" stroke-width="3"/>
          <circle cx="980" cy="562" r="54" fill="#0a0d0f"/>
          <g id="fanBlades">
            <path d="M980 562 C984 540 998 516 1012 510 C1018 520 1006 546 980 562Z" fill="url(#gMetal)"/>
            <path d="M980 562 C984 540 998 516 1012 510 C1018 520 1006 546 980 562Z" fill="url(#gMetal)" transform="rotate(72 980 562)"/>
            <path d="M980 562 C984 540 998 516 1012 510 C1018 520 1006 546 980 562Z" fill="url(#gMetal)" transform="rotate(144 980 562)"/>
            <path d="M980 562 C984 540 998 516 1012 510 C1018 520 1006 546 980 562Z" fill="url(#gMetal)" transform="rotate(216 980 562)"/>
            <path d="M980 562 C984 540 998 516 1012 510 C1018 520 1006 546 980 562Z" fill="url(#gMetal)" transform="rotate(288 980 562)"/>
          </g>
          <circle cx="980" cy="562" r="12" fill="url(#cyGHub)" stroke="#20272c"/>
          <g fill="none" stroke="#fff" stroke-opacity=".14"><circle cx="980" cy="562" r="30"/><circle cx="980" cy="562" r="44"/><path d="M926 562H1034M980 508V616"/></g>
        </g>

        <!-- Oil filter -->
        <g class="part" data-id="oilfilter">
          <rect x="548" y="684" width="66" height="16" rx="4" fill="url(#gMetal)" stroke="#20272c" stroke-width="1.5"/>
          <rect x="554" y="698" width="54" height="86" rx="9" fill="url(#gPaintH)" stroke="#0d2a47" stroke-width="2"/>
          <rect x="554" y="728" width="54" height="18" fill="#fff" fill-opacity=".85"/>
          <text x="581" y="741" class="plate" style="fill:#123c69">OIL</text>
          <rect id="ofDirt" x="554" y="698" width="54" height="86" rx="9" fill="#3a2d18" opacity="0"/>
        </g>

        <!-- Water separator -->
        <g class="part" data-id="watersep">
          <path d="M1115 350 H1165 V420 L1150 460 H1130 L1115 420Z" fill="url(#gMetalH)" stroke="#20272c" stroke-width="2"/>
          <path d="M1121 400 H1159 V418 L1146 452 H1134 L1121 418Z" fill="#161c20"/>
          <rect id="wsWater" x="1115" y="452" width="50" height="0" fill="url(#gWater)" clip-path="url(#cpWS)"/>
          <path d="M1124 362 q16 10 32 0 M1124 376 q16 10 32 0" fill="none" stroke="#33414b" stroke-width="1.5"/>
        </g>
        <!-- Drain -->
        <g class="part" data-id="drain">
          <rect x="1125" y="462" width="30" height="24" rx="4" fill="url(#gPaint)" stroke="#0d2a47" stroke-width="1.5"/>
          <circle id="drainLed" cx="1148" cy="470" r="3.2" fill="#22c55e"/>
        </g>

        <!-- Dryer inlet filter -->
        <g class="part" data-id="prefilter">
          <rect x="1192" y="426" width="36" height="14" rx="3" fill="url(#gMetal)" stroke="#20272c" stroke-width="1.5"/>
          <rect x="1196" y="438" width="28" height="78" rx="7" fill="url(#gTower)" stroke="#20272c" stroke-width="1.5"/>
          <rect x="1196" y="470" width="28" height="10" fill="#2f74b8"/>
        </g>

        <g id="dryICD">
        <!-- Desiccant towers -->
        <g class="part" data-id="towers">
          <rect x="1270" y="250" width="90" height="310" rx="40" fill="url(#gTower)" stroke="#1a2024" stroke-width="2"/>
          <rect x="1280" y="292" width="70" height="250" rx="12" fill="#12171a"/>
          <g clip-path="url(#cpTA)"><rect id="bedA" x="1280" y="304" width="70" height="238" fill="#3f8a78"/><rect x="1280" y="304" width="70" height="238" fill="url(#pBeads)"/></g>
          <rect x="1280" y="292" width="70" height="250" rx="12" fill="url(#gGlassHi)"/>
          <rect x="1450" y="250" width="90" height="310" rx="40" fill="url(#gTower)" stroke="#1a2024" stroke-width="2"/>
          <rect x="1460" y="292" width="70" height="250" rx="12" fill="#12171a"/>
          <g clip-path="url(#cpTB)"><rect id="bedB" x="1460" y="304" width="70" height="238" fill="#3f8a78"/><rect x="1460" y="304" width="70" height="238" fill="url(#pBeads)"/></g>
          <rect x="1460" y="292" width="70" height="250" rx="12" fill="url(#gGlassHi)"/>
          <text x="1258" y="284" class="tower-lbl" text-anchor="end">A</text>
          <text x="1552" y="284" class="tower-lbl">B</text>
          <!-- tower pressure gauges -->
          <rect x="1240" y="330" width="12" height="110" rx="6" fill="#f4f6f8" stroke="#20272c"/>
          <rect id="tgA" x="1242" y="332" width="8" height="106" rx="4" fill="#e23b2e"/>
          <rect x="1558" y="330" width="12" height="110" rx="6" fill="#f4f6f8" stroke="#20272c"/>
          <rect id="tgB" x="1560" y="332" width="8" height="106" rx="4" fill="#e23b2e"/>
          <g class="gauge-txt"><text x="1236" y="336" text-anchor="end">10</text><text x="1236" y="440" text-anchor="end">0</text><text x="1574" y="336">10</text><text x="1574" y="440">0</text></g>
        </g>

        <!-- Check valves -->
        <g class="part" data-id="checkvalves">
          <circle cx="1315" cy="226" r="11" fill="url(#gFace)" stroke="#20272c" stroke-width="2"/><circle id="cvA" cx="1315" cy="230" r="5" fill="#161c20"/>
          <circle cx="1495" cy="226" r="11" fill="url(#gFace)" stroke="#20272c" stroke-width="2"/><circle id="cvB" cx="1495" cy="230" r="5" fill="#161c20"/>
        </g>

        <!-- Purge -->
        <g class="part" data-id="purge">
          <rect x="1386" y="266" width="38" height="24" rx="4" fill="url(#gMetalH)" stroke="#20272c" stroke-width="2"/>
          <rect x="1395" y="251" width="20" height="16" rx="2" fill="url(#gPaint)" stroke="#0d2a47"/>
          <path id="purgeX" d="M1398 271l14 14M1412 271l-14 14" stroke="#e23b2e" stroke-width="2.5" stroke-linecap="round"/>
        </g>

        <!-- Silencer -->
        <g class="part" data-id="silencer">
          <rect x="1391" y="550" width="28" height="54" rx="10" fill="url(#gMetalH)" stroke="#20272c" stroke-width="2"/>
          <rect x="1395" y="558" width="20" height="38" rx="6" fill="url(#pPerf)"/>
        </g>

        <!-- Switching valve -->
        <g class="part" data-id="switchvalve">
          <circle cx="1405" cy="640" r="25" fill="url(#gMetal)" stroke="#20272c" stroke-width="2"/>
          <g id="swBall"><circle cx="1405" cy="640" r="17" fill="#f4f6f8" stroke="#111" stroke-width="2"/><path d="M1405 623 A17 17 0 0 1 1405 657Z" fill="#111"/></g>
        </g>

        </g>

        <!-- Refrigerant dryer (ID) -->
        <g id="dryID" style="display:none">
          <g class="part" data-id="hex">
            <rect x="1290" y="250" width="100" height="140" rx="8" fill="url(#gMetal)" stroke="#1a2024" stroke-width="2"/>
            <rect x="1300" y="262" width="80" height="116" rx="4" fill="url(#pCooler)"/>
            <rect id="hexHot" x="1300" y="262" width="80" height="58" rx="4" fill="#f97316" opacity="0"/>
            <rect id="hexCold" x="1300" y="320" width="80" height="58" rx="4" fill="#38bdf8" opacity="0"/>
            <path d="M1300 320 H1380" stroke="#1a2024" stroke-width="2" opacity=".6"/>
          </g>
          <g class="part" data-id="evap">
            <rect x="1290" y="410" width="100" height="140" rx="8" fill="url(#gMetal)" stroke="#1a2024" stroke-width="2"/>
            <rect x="1300" y="422" width="80" height="116" rx="4" fill="url(#pCooler)"/>
            <rect id="evapCold" x="1300" y="422" width="80" height="116" rx="4" fill="url(#gIce)" opacity="0"/>
            <g id="evapFrost" opacity="0" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round">
              <path d="M1318 446 v14 M1311 453 h14 M1313 448 l10 10 M1323 448 l-10 10"/>
              <path d="M1360 480 v14 M1353 487 h14 M1355 482 l10 10 M1365 482 l-10 10"/>
              <path d="M1326 510 v12 M1320 516 h12"/>
            </g>
            <path d="M1413 440 l7 -9 7 9 -7 9z" fill="#d4a017" stroke="#20272c" stroke-width="1.5"/>
          </g>
          <g class="part" data-id="refsep">
            <path d="M1310 572 H1370 V625 L1352 655 H1328 L1310 625Z" fill="url(#gMetalH)" stroke="#20272c" stroke-width="2"/>
            <path d="M1316 612 H1364 V624 L1349 648 H1331 L1316 624Z" fill="#161c20"/>
            <rect id="rsWater" x="1316" y="648" width="48" height="0" fill="url(#gWater)" clip-path="url(#cpRS)"/>
            <path d="M1318 584 q22 10 44 0 M1318 598 q22 10 44 0" fill="none" stroke="#33414b" stroke-width="1.5"/>
            <rect x="1325" y="682" width="30" height="20" rx="4" fill="url(#gPaint)" stroke="#0d2a47" stroke-width="1.5"/>
            <circle id="rsLed" cx="1348" cy="690" r="3" fill="#22c55e"/>
          </g>
          <g class="part" data-id="condenser">
            <rect x="1440" y="250" width="120" height="150" rx="8" fill="url(#gMetal)" stroke="#1a2024" stroke-width="2"/>
            <rect x="1450" y="260" width="100" height="130" rx="4" fill="url(#pCooler)"/>
            <rect id="condFoul" x="1450" y="260" width="100" height="130" rx="4" fill="#6b5a3a" opacity="0"/>
            <circle cx="1500" cy="325" r="46" fill="url(#gDark)" stroke="#0b0e10" stroke-width="2"/>
            <circle cx="1500" cy="325" r="40" fill="#0a0d0f"/>
            <g id="refFan">
              <path d="M1500 325 C1503 309 1513 292 1523 288 C1527 295 1519 314 1500 325Z" fill="url(#gMetal)"/>
              <path d="M1500 325 C1503 309 1513 292 1523 288 C1527 295 1519 314 1500 325Z" fill="url(#gMetal)" transform="rotate(90 1500 325)"/>
              <path d="M1500 325 C1503 309 1513 292 1523 288 C1527 295 1519 314 1500 325Z" fill="url(#gMetal)" transform="rotate(180 1500 325)"/>
              <path d="M1500 325 C1503 309 1513 292 1523 288 C1527 295 1519 314 1500 325Z" fill="url(#gMetal)" transform="rotate(270 1500 325)"/>
            </g>
            <circle cx="1500" cy="325" r="8" fill="url(#cyGHub)" stroke="#20272c"/>
          </g>
          <g class="part" data-id="refcomp">
            <rect x="1455" y="650" width="90" height="8" rx="3" fill="#262d32"/>
            <rect x="1462" y="560" width="76" height="92" rx="34" fill="url(#gDark)" stroke="#0b0f12" stroke-width="2"/>
            <rect x="1472" y="584" width="56" height="9" rx="3" fill="#3b4750"/>
            <rect x="1472" y="600" width="56" height="9" rx="3" fill="#3b4750"/>
            <circle id="rcLed" cx="1500" cy="630" r="4.5" fill="#555"/>
          </g>
        </g>

        <!-- Outlet filter -->
        <g class="part" data-id="afterfilter">
          <rect x="1448" y="104" width="36" height="14" rx="3" fill="url(#gMetal)" stroke="#20272c" stroke-width="1.5"/>
          <rect x="1452" y="116" width="28" height="64" rx="7" fill="url(#gTower)" stroke="#20272c" stroke-width="1.5"/>
          <rect x="1452" y="140" width="28" height="9" fill="#2f74b8"/>
        </g>

        <!-- Dew point sensor -->
        <g class="part" data-id="dewpoint">
          <rect x="1509" y="86" width="10" height="20" rx="2" fill="url(#gMetalH)" stroke="#20272c"/>
          <rect x="1503" y="68" width="22" height="20" rx="3" fill="url(#gPaint)" stroke="#0d2a47"/>
          <circle id="dpLed" cx="1514" cy="78" r="3" fill="#22c55e"/>
        </g>

        <!-- Net pressure sensor + gauge -->
        <g class="part" data-id="pressure">
          <rect x="1544" y="86" width="10" height="20" fill="url(#gMetalH)" stroke="#20272c"/>
          <circle cx="1549" cy="68" r="21" fill="url(#gFace)" stroke="#2a3237" stroke-width="3.5"/>
          <g id="ticksNet"></g>
          <path id="ndNet" d="M1549 68 L1549 52" stroke="#d1291b" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="1549" cy="68" r="2.8" fill="#20272c"/>
        </g>

        <!-- Controller -->
        <g class="part" data-id="controller">
          <rect x="900" y="22" width="290" height="152" rx="10" fill="url(#gMetal)" stroke="#20272c" stroke-width="2"/>
          <text x="1028" y="42" class="ctl-brand">Elektronikon</text>
          <rect x="928" y="50" width="200" height="82" rx="5" fill="#0d160b" stroke="#000"/>
          <rect id="lcd" x="932" y="54" width="192" height="74" rx="3" fill="url(#gLcd)"/>
          <text id="lcd1" x="942" y="83" class="lcd big">0.0 bar</text>
          <text id="lcd2" x="942" y="102" class="lcd">--</text>
          <text id="lcd3" x="942" y="120" class="lcd">STOPPED</text>
          <g fill="#0b74b8" stroke="#05385a"><circle cx="1150" cy="64" r="7"/><circle cx="1150" cy="91" r="7"/><circle cx="1150" cy="118" r="7"/></g>
          <g class="ctl-led"><circle id="ledPwr" cx="940" cy="152" r="5" fill="#22c55e"/><circle id="ledAuto" cx="962" cy="152" r="5" fill="#2a3237"/><circle id="ledAlarm" cx="984" cy="152" r="5" fill="#2a3237"/></g>
          <g id="ctlStart" class="hw-btn" role="button" aria-label="Start"><circle cx="1040" cy="152" r="14" fill="url(#gGreen)" stroke="#0b5a2b" stroke-width="2"/><text x="1040" y="157" class="hw-txt">I</text></g>
          <g id="ctlStop" class="hw-btn" role="button" aria-label="Stop"><circle cx="1078" cy="152" r="14" fill="url(#gRed)" stroke="#6e0e07" stroke-width="2"/><text x="1078" y="157" class="hw-txt">O</text></g>
          <g id="ctlEstop" class="hw-btn" role="button" aria-label="Emergency stop"><circle cx="1150" cy="152" r="0" fill="none"/></g>
        </g>

        <!-- plant outlet label -->
        <g class="part" data-id="outvalve" id="outValve" transform="translate(1578 110)">
          <rect x="-15" y="-11" width="30" height="22" rx="4" fill="url(#gMetal)" stroke="#20272c" stroke-width="2"/>
          <circle id="ovBall" r="7" fill="#22c55e" stroke="#0b3d1f" stroke-width="1.5"/>
          <rect id="ovHandle" x="-3" y="-30" width="6" height="22" rx="2" fill="#16a34a" stroke="#0b3d1f"/>
        </g>
        <g class="plant"><text x="1596" y="140" text-anchor="end" class="plant-lbl" data-i18n-svg="toPlant">TO PLANT ➜</text><text id="plantFlow" x="1596" y="158" text-anchor="end" class="plant-val">0.0 m³/min</text></g>
        <g class="mains"><text x="28" y="708" class="plant-val" style="text-anchor:start">400 V · 3~ · 50 Hz</text></g>

        <!-- dryer timeline -->
        <!-- Air receiver tank (optional) -->
        <g class="part" data-id="tank" id="tankGrp" style="display:none">
          <rect x="1630" y="528" width="9" height="46" fill="#262d32"/><rect x="1701" y="528" width="9" height="46" fill="#262d32"/>
          <rect x="1618" y="572" width="104" height="6" rx="2" fill="#1b2024"/>
          <rect x="1620" y="168" width="100" height="372" rx="50" fill="url(#gPaintH)" stroke="#0d2a47" stroke-width="2"/>
          <path d="M1622 232 H1718 M1622 476 H1718" stroke="#0d2a47" stroke-opacity=".55" stroke-width="2"/>
          <rect x="1640" y="220" width="60" height="270" rx="10" fill="#12171a" stroke="#0a0d0f"/>
          <rect id="tankFill" x="1640" y="490" width="60" height="0" fill="var(--m-dry)" opacity=".6" clip-path="url(#cpTank)"/>
          <path id="tankMin" d="M1640 355 H1700" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="5 3"/>
          <text id="tankMinT" x="1703" y="358" class="tank-min">min</text>
          <rect x="1640" y="220" width="60" height="270" rx="10" fill="url(#gGlassHi)"/>
          <path id="tankArrow" d="M1664 382 v-22 h-8 l14 -15 14 15 h-8 v22z" fill="#fff" opacity="0"/>
          <text id="tankTxt" x="1670" y="206" class="tank-txt">1000 L</text>
          <text id="tankP" x="1670" y="514" class="tank-p">0.0 bar</text>
          <path d="M1720 300 H1731" stroke="#9aa6ae" stroke-width="4"/>
          <circle cx="1743" cy="300" r="12" fill="url(#gFace)" stroke="#2a3237" stroke-width="2.5"/>
          <path id="ndTank" d="M1743 300 L1743 291" stroke="#d1291b" stroke-width="2" stroke-linecap="round"/>
          <rect x="1690" y="152" width="10" height="16" rx="2" fill="#d4a017" stroke="#20272c"/>
          <rect x="1665" y="540" width="10" height="10" fill="url(#gMetal)" stroke="#20272c"/>
          <rect x="1658" y="550" width="24" height="16" rx="3" fill="url(#gPaint)" stroke="#0d2a47"/>
        </g>

        <g id="oilBlock" opacity="0"><circle cx="450" cy="600" r="12" fill="#7f1d1d" stroke="#ef4444" stroke-width="2.5"/><path d="M444 594l12 12M456 594l-12 12" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></g>
        <g id="pmRings" opacity="0" fill="none" stroke="#f59e0b" stroke-width="3" stroke-dasharray="6 4">
          <circle cx="385" cy="232" r="34"/><circle cx="720" cy="204" r="26"/><circle cx="832" cy="650" r="22"/><circle cx="530" cy="430" r="22"/>
          <circle cx="1315" cy="226" r="18"/><circle cx="1495" cy="226" r="18"/><circle cx="450" cy="600" r="18"/>
        </g>
        <g id="mBrgHot" opacity="0" fill="#ff4a1f" filter="url(#fGlow)"><circle cx="140" cy="346" r="8"/><circle cx="256" cy="346" r="8"/></g>
        <g id="timeline"></g>

        <g id="cyFx"></g>
        <g id="labels"></g>
        <g id="hlLayer"></g>
      </svg>
`;

/* ---------- pipe routing, labels, dryer timeline (from app.js) ---------- */
const MEDIA = { intake: '--m-intake', oil: '--m-oil', mix: '--m-mix', wet: '--m-wet', dry: '--m-dry', water: '--m-water', power: '--m-power', cool: '--m-intake' };
const PIPES = [
  ['intake', 'intake', 'M80 420 V170 H385 V196', 24],
  ['mix', 'mix', 'M530 410 V448 H640', 13],
  ['hot', 'wet', 'M738 214 H870 V310 H880', 13],
  ['ac', 'wet', 'M1080 310 H1140 V350', 13],
  ['ws', 'wet', 'M1165 380 H1210 V426', 13],
  ['pf', 'wet', 'M1210 516 V700 H1405 V665', 13],
  ['tA', 'wet', 'M1315 560 V640 H1380', 13],
  ['tB', 'wet', 'M1495 560 V640 H1430', 13],
  ['exh', 'wet', 'M1405 615 V604', 10],
  ['cA', 'dry', 'M1315 250 V200 H1405', 11],
  ['cB', 'dry', 'M1495 250 V200 H1405', 11],
  ['out', 'dry', 'M1405 200 V110 H1600', 14],
  ['purge', 'dry', 'M1360 278 H1450', 7],
  ['oSep', 'oil', 'M720 610 V650 H818', 10],
  ['oCool', 'oil', 'M846 650 H860 V420 H880', 10],
  ['oByp', 'oil', 'M832 664 V692', 10],
  ['oRet', 'oil', 'M1080 420 H1110 V692 H614', 10],
  ['oInj', 'oil', 'M548 692 H450 V412', 10],
  ['cond', 'water', 'M1140 486 V530 H1196', 6],
  ['pwr', 'power', 'M220 470 V404', 7],
  ['mains', 'power', 'M220 620 V690 H24', 7],
];
const FX_FLOWS = [
  ['inA', 'intake', 'M6 494 H40', 7], ['inB', 'intake', 'M6 560 H40', 7],
  ['fan1', 'cool', 'M930 492 V262', 5], ['fan2', 'cool', 'M980 496 V262', 5], ['fan3', 'cool', 'M1030 492 V262', 5],
  ['bA', 'dry', 'M1315 536 V306', 5], ['bB', 'dry', 'M1495 536 V306', 5],
];
const LABELS = {
  filter: [82, 652, 'middle'], inletvalve: [428, 232, 'start'], motor: [206, 272, 'middle'], vsd: [298, 500, 'start'],
  element: [330, 434, 'middle'], separator: [632, 560, 'end'], mpv: [745, 189, 'start'], solenoid: [644, 182, 'end'], aftercooler: [980, 262, 'middle'],
  oilcooler: [980, 484, 'middle'], fan: [980, 646, 'middle'], thermostat: [790, 682, 'end'], oilfilter: [612, 772, 'start'],
  watersep: [1130, 612, 'middle', 1140, 460], prefilter: [1250, 734, 'middle', 1218, 516], towers: [1405, 236, 'middle'],
  purge: [1405, 312, 'middle'], silencer: [1405, 534, 'middle'], switchvalve: [1460, 692, 'start'], afterfilter: [1504, 196, 'start'],
  dewpoint: [1496, 62, 'end'], pressure: [1596, 26, 'end'], outvalve: [1578, 80, 'middle']
};
const SHORT = { filter: 'Intake filter', inletvalve: 'Inlet valve', motor: 'Motor IE5', vsd: 'VSD drive', element: 'Screw element', separator: 'Oil separator', mpv: 'Min. pressure valve', solenoid: 'Solenoid Y1',
  aftercooler: 'Aftercooler', oilcooler: 'Oil cooler', fan: 'Cooling fan', thermostat: 'Thermostat valve', oilfilter: 'Oil filter', watersep: 'Water separator',
  prefilter: 'Dryer filter', towers: 'Desiccant towers', purge: 'Purge valve', silencer: 'Silencer', switchvalve: 'Switching valve', afterfilter: 'Outlet filter', dewpoint: 'Dew point', pressure: 'Pressure sensor', outvalve: 'Outlet valve' };
const TL = { x: 1150, w: 430, y: 790 };
const PHASES = [['use', 0, 0.5], ['dep', 0.5, 0.54], ['purge', 0.54, 0.81], ['rep', 0.81, 1]];
const PH_TXT = { use: 'use', dep: 'depr.', purge: 'purge', rep: 'pr.' };
const FAD = 13.5, PIN = 75 * 1.08;   // GA 75 VSD⁺: 13.5 m³/min at 7 bar, ~81 kW input

/* ---------- the shot list: camera [cx, cy, width] + caption, in seconds from start() ---------- */
const SHOTS = [
  { t: 0,    ms: 1,    cam: [800, 450, 1500] },                                       // the machine at rest
  { t: 1.0,  ms: 1500, cam: [330, 420, 820],  cap: ['01', 'Air intake · VSD drive'] }, // start pressed → soft start
  { t: 4.6,  ms: 1300, cam: [470, 360, 560],  cap: ['02', 'Screw element · compression'] },
  { t: 7.8,  ms: 1300, cam: [700, 420, 600],  cap: ['03', 'Oil separation'] },
  { t: 11.0, ms: 1300, cam: [980, 470, 680],  cap: ['04', 'Cooling & water separation'] },
  { t: 14.2, ms: 1300, cam: [1400, 450, 700], cap: ['05', 'ICD dryer · −40 °C dew point'] },
  { t: 17.6, ms: 1300, cam: [1380, 150, 760], cap: ['06', 'Dry air to plant'] },
  { t: 20.0, ms: 2200, cam: [800, 450, 1600], cap: null },                            // pull back: the whole cycle running
];
const LENGTH = 22.6;   // seconds until the caller flares to white (Cycle.LENGTH)

/* ---------- state at time t (seconds): a scripted start-up, no feedback loops ---------- */
function state(t) {
  const spd = sm(t, 1.0, 4.2);                                  // VSD ramps the motor over ~3 s
  const sol = t > 2.0, ivOpen = t > 2.35, loaded = ivOpen;      // Y1 energises, control air opens the inlet valve
  const ps = 7.6 * sm(t, 2.4, 9.5);                             // sump builds first …
  const mpvOpen = ps > 4;                                       // … MPV opens at 4 bar …
  const p = 7.0 * sm(t, 5.0, 12.5);                             // … then the net comes up to 7 bar
  const Q = loaded ? FAD * spd * sm(t, 2.4, 5) : 0;
  const purgeQ = 0.15 * Q, Qd = p > 0.3 ? Q - purgeQ : 0;
  const T = 30 + 55 * sm(t, 3, 16);
  const thermo = sm(t, 9, 15);                                  // oil warm → thermostat sends it through the cooler
  const pdp = lerp(20, -40, sm(t, 12, 20));
  const cond = 0.2 + 0.5 * sm(t, 10, 16);
  const drain = t > 15.4 && t < 16.3;
  const fa = ((-0.1 + 0.04 * t) % 1 + 1) % 1, fb = (fa + 0.5) % 1;   // tower A switches to regeneration at t = 15
  const phase = f => PHASES.find(([, a, b]) => f >= a && f < b)[0];
  const phA = phase(fa), phB = phase(fb);
  const moist = (ph, f) => (ph === 'use' ? 0.15 + 0.5 * (f / 0.5) : 0.65 * (1 - (f - 0.5) / 0.5));
  const st = t < 1 ? 'stopped' : t < 4.2 ? 'starting' : 'running';
  const P = st === 'stopped' ? 0 : PIN * (0.05 + 0.95 * spd) * (loaded ? 1 : 0.3);
  return { t, st, spd, sol, ivOpen, loaded, ps, mpvOpen, p, Q, Qd, T, thermo, pdp, cond, drain, fa, fb, phA, phB, mA: moist(phA, fa), mB: moist(phB, fb), P };
}
function towerP(s, phase, f) {
  if (phase === 'use') return s.p;
  if (phase === 'dep') return s.p * (1 - (f - 0.5) / 0.04);
  if (phase === 'purge') return 0.2;
  return lerp(0.2, s.p, (f - 0.81) / 0.19);
}

/* ---------- runtime ---------- */
let svg, capEl, $;
const FLOW = {}, mistDots = [], particles = [];
const R = { rotM: 0, rotF: 0, coup: 0, fan: 0, sw: 0, wave: 0 };
let vb = [0, 0, 1600, 900], camAnim = null;
let raf = 0, t0 = 0, last = 0, shot = -1, prev = null, playing = false;

function setVB(v) { vb = v; svg.setAttribute('viewBox', v.map(x => x.toFixed(1)).join(' ')); }
function camTo([cx, cy, w], ms) {
  // shots are framed for 16:9; on any other viewport keep that whole region visible (letterbox into the drawing's bay)
  const r = svg.getBoundingClientRect(), aspect = r.width && r.height ? r.width / r.height : 16 / 9;
  const w2 = Math.max(w, w * 9 / 16 * aspect), h = w2 / aspect, target = [cx - w2 / 2, cy - h / 2, w2, h];
  if (ms <= 1) { camAnim = null; setVB(target); return; }
  const from = [...vb], c0 = performance.now();
  camAnim = now => {
    const k = clamp((now - c0) / ms, 0, 1);
    setVB(from.map((v, i) => lerp(v, target[i], ease(k))));
    if (k >= 1) camAnim = null;
  };
}

function buildPipes() {
  const gp = $('#pipes'), gf = $('#flows'), fx = $('#cyFx');
  for (const [id, m, d, w] of PIPES) {
    const col = `var(${MEDIA[m]})`;
    if (m === 'power') {
      svgEl('path', { d, class: 'pipe-o', 'stroke-width': w + 3 }, gp);
      svgEl('path', { d, class: 'pipe-c', stroke: '#262d33', 'stroke-width': w }, gp);
    } else {
      svgEl('path', { d, class: 'pipe-o', 'stroke-width': w + 4 }, gp);
      svgEl('path', { d, class: 'pipe-c', style: `stroke:${col}`, 'stroke-width': w }, gp);
      svgEl('path', { d, class: 'pipe-h', 'stroke-width': Math.max(1.5, w * 0.22) }, gp);
    }
    const f = svgEl('path', { d, class: 'flow', stroke: m === 'power' ? 'var(--m-power)' : '#fff', 'stroke-width': Math.max(2.5, w * 0.42), 'stroke-dasharray': m === 'power' ? '6 10' : `0.1 ${Math.max(14, w * 1.6)}`, opacity: 0 }, gf);
    FLOW[id] = { el: f, off: 0, speed: 0, op: 0 };
  }
  for (const [id, m, d, w] of FX_FLOWS) {
    const f = svgEl('path', { d, class: 'flow', stroke: m === 'cool' ? '#e6f6ff' : (m === 'dry' ? '#ffffff' : `var(${MEDIA[m]})`), 'stroke-width': w, 'stroke-dasharray': m === 'cool' ? '10 16' : '0.1 14', opacity: 0 }, fx);
    FLOW[id] = { el: f, off: 0, speed: 0, op: 0 };
  }
}
function setFlow(id, speed, op = 0.85) { const f = FLOW[id]; if (!f) return; f.speed = speed; f.op = Math.abs(speed) > 0.5 ? op : 0; }
function animateFlows(dt) {
  for (const id in FLOW) {
    const f = FLOW[id];
    f.off -= f.speed * dt;
    if (f.off < -1e6 || f.off > 1e6) f.off = 0;
    f.el.setAttribute('stroke-dashoffset', f.off.toFixed(1));
    const cur = +f.el.getAttribute('opacity');
    if (Math.abs(cur - f.op) > 0.01) f.el.setAttribute('opacity', (cur + (f.op - cur) * Math.min(1, dt * 6)).toFixed(2));
  }
}
function buildTicks(gid, cx, cy, r, max) {
  const g = $(gid);
  for (let i = 0; i <= max; i += max > 12 ? 2 : 1) {
    const a = (-135 + 270 * i / max) * Math.PI / 180;
    const r1 = r - (i % (max > 12 ? 4 : 2) === 0 ? 6 : 3.5);
    svgEl('line', { x1: cx + Math.sin(a) * r1, y1: cy - Math.cos(a) * r1, x2: cx + Math.sin(a) * r, y2: cy - Math.cos(a) * r, stroke: '#2a3237', 'stroke-width': 1.2 }, g);
  }
  const red = (-135 + 270 * 0.83) * Math.PI / 180, red2 = 135 * Math.PI / 180;
  const pt = a => `${cx + Math.sin(a) * (r - 1.5)} ${cy - Math.cos(a) * (r - 1.5)}`;
  svgEl('path', { d: `M${pt(red)} A${r - 1.5} ${r - 1.5} 0 0 1 ${pt(red2)}`, stroke: '#d1291b', 'stroke-width': 2.5, fill: 'none' }, g);
}
function needle(id, cx, cy, len, v, max) {
  const a = (-135 + 270 * clamp(v / max, 0, 1.03)) * Math.PI / 180;
  $(id).setAttribute('d', `M${cx} ${cy} L${(cx + Math.sin(a) * len).toFixed(1)} ${(cy - Math.cos(a) * len).toFixed(1)}`);
}
function buildLabels() {
  const g = $('#labels');
  for (const id in LABELS) {
    const [x, y, anchor, lx, ly] = LABELS[id];
    const grp = svgEl('g', { class: 'lab', 'data-for': id }, g);
    if (lx !== undefined) { svgEl('line', { x1: lx, y1: ly, x2: x, y2: y - 14 }, grp); svgEl('circle', { cx: lx, cy: ly, r: 2.5 }, grp); }
    const tx = svgEl('text', { x, y, 'text-anchor': anchor }, grp);
    tx.textContent = SHORT[id];
  }
}
function buildTimeline() {
  const g = $('#timeline');
  [['A', 0], ['B', 0.5]].forEach(([k, shift], r) => {
    const y = TL.y + r * 22;
    const tx = svgEl('text', { x: TL.x - 8, y: y + 13, class: 'tl-name' }, g); tx.textContent = 'Tower ' + k;
    PHASES.forEach(([n, a, b]) => {
      const s = (a + shift) % 1, e = s + (b - a);
      const parts = e > 1 ? [[s, 1], [0, e - 1]] : [[s, e]];
      parts.forEach(([s1, e1], i) => {
        const dark = n === 'dep' || n === 'rep';
        svgEl('rect', { x: TL.x + s1 * TL.w, y, width: (e1 - s1) * TL.w, height: 17, fill: dark ? '#0a6a8f' : '#7ec4e0', class: 'tl-row' }, g);
        if (i === 0 && n !== 'dep' && (e1 - s1) > 0.06) {
          const tt = svgEl('text', { x: TL.x + s1 * TL.w + 5, y: y + 12.5, class: 'tl-txt', fill: dark ? '#fff' : '#06324a' }, g); tt.textContent = PH_TXT[n];
        }
      });
    });
  });
  svgEl('path', { id: 'tlMark', d: 'M-7 0 L7 0 L0 9Z', fill: 'var(--accent)' }, g);
  svgEl('line', { id: 'tlLine', x1: 0, y1: TL.y - 2, x2: 0, y2: TL.y + 41, stroke: 'var(--accent)', 'stroke-width': 2 }, g);
  const cap = svgEl('text', { x: TL.x, y: TL.y - 10, class: 'tl-cap' }, g); cap.textContent = 'Desiccant towers (ICD) — Cycle';
}
function buildMist() {
  const g = $('#mist');
  for (let i = 0; i < 26; i++) {
    const c = svgEl('circle', { cx: 0, cy: 0, r: 1 + Math.random() * 2, fill: '#f1c070', opacity: 0 }, g);
    mistDots.push({ el: c, x: 660 + Math.random() * 120, y: 440 + Math.random() * 120, v: 20 + Math.random() * 40, ph: Math.random() * 6 });
  }
}
function puff(x, y, n, col, vy, spread) {
  const fx = $('#cyFx');
  for (let i = 0; i < n; i++) {
    const c = svgEl('circle', { cx: x, cy: y, r: 3 + Math.random() * 4, fill: col, opacity: 0.7 }, fx);
    particles.push({ el: c, x: x + (Math.random() - 0.5) * 8, y, vx: (Math.random() - 0.5) * spread, vy: vy * (0.6 + Math.random() * 0.6), life: 1.2 + Math.random() * 0.8, age: 0 });
  }
}
function animateParticles(dt) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]; p.age += dt;
    p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.98;
    const k = p.age / p.life;
    p.el.setAttribute('cx', p.x.toFixed(1)); p.el.setAttribute('cy', p.y.toFixed(1));
    p.el.setAttribute('r', (3 + k * 12).toFixed(1)); p.el.setAttribute('opacity', (0.6 * (1 - k)).toFixed(2));
    if (k >= 1) { p.el.remove(); particles.splice(i, 1); }
  }
}

/* ---------- render one frame of state s (the demo's render(), minus faults / tank / refrigerant dryer) ---------- */
function render(s, vis) {
  const sp = s.spd, base = 95, turning = sp > 0.02, loadedFlow = s.Q / FAD, running = s.st !== 'stopped';

  // rotors, coupling, fan
  R.rotM += vis * sp * 150; R.rotF += vis * sp * 100; R.coup += vis * sp * 260;
  $('#pRotM').setAttribute('patternTransform', `translate(${(R.rotM % 24).toFixed(2)} 297)`);
  $('#pRotF').setAttribute('patternTransform', `translate(${(R.rotF % 18).toFixed(2)} 347)`);
  $('#pCoup').setAttribute('patternTransform', `translate(0 ${(R.coup % 10).toFixed(2)})`);
  const fanOn = turning ? Math.max(sp, 0.35) : 0;
  R.fan = (R.fan + vis * fanOn * 900) % 360;
  $('#fanBlades').setAttribute('transform', `rotate(${R.fan.toFixed(1)} 980 562)`);

  // pipes / flows
  const oilSpeed = turning ? base * (0.35 + 0.65 * sp) : 0;
  setFlow('intake', base * loadedFlow * 1.1);
  setFlow('inA', base * loadedFlow * 0.8, 0.9); setFlow('inB', base * loadedFlow * 0.8, 0.9);
  setFlow('mix', turning && s.loaded ? base * sp : 0);
  setFlow('hot', base * loadedFlow); setFlow('ac', base * loadedFlow); setFlow('ws', base * loadedFlow); setFlow('pf', base * loadedFlow);
  setFlow('oSep', oilSpeed); setFlow('oInj', oilSpeed);
  setFlow('oCool', oilSpeed * s.thermo); setFlow('oRet', oilSpeed * s.thermo); setFlow('oByp', oilSpeed * (1 - s.thermo));
  const fanSp = fanOn * 110;
  setFlow('fan1', fanSp, 0.35); setFlow('fan2', fanSp, 0.35); setFlow('fan3', fanSp, 0.35);
  const pw = s.P > 0.2 ? 30 + 90 * (s.P / PIN) : 0;
  setFlow('pwr', pw, 0.95); setFlow('mains', pw, 0.95);
  setFlow('cond', s.drain ? 70 : 0, 0.95);
  const air = base * loadedFlow;
  const dir = ph => (ph === 'use' ? -air : ph === 'dep' ? 160 : (ph === 'purge' && air > 0 ? 45 : 0));
  setFlow('tA', dir(s.phA)); setFlow('tB', dir(s.phB));
  setFlow('exh', (s.phA === 'dep' || s.phB === 'dep' || ((s.phA === 'purge' || s.phB === 'purge') && air > 0)) ? 100 : 0);
  const bed = ph => (ph === 'use' ? air * 0.7 : (ph === 'purge' && air > 0 ? -45 : 0));
  setFlow('bA', bed(s.phA), 0.7); setFlow('bB', bed(s.phB), 0.7);
  setFlow('cA', s.phA === 'use' ? air : 0); setFlow('cB', s.phB === 'use' ? air : 0);
  setFlow('out', base * clamp(s.Qd / FAD, 0, 1.2) * (s.p > 0.3 ? 1 : 0));
  const regen = ph => ph === 'purge' || ph === 'rep';
  const purgeOn = air > 0 && (regen(s.phA) || regen(s.phB));
  setFlow('purge', purgeOn ? (s.phA === 'use' ? 55 : -55) : 0);
  animateFlows(vis);

  // solenoid Y1, inlet valve, NRV, MPV, thermostat
  $('#solCoil').setAttribute('fill', s.sol ? '#16a34a' : '#3a434a'); $('#solLed').setAttribute('fill', s.sol ? '#22c55e' : '#555');
  $('#solLine').classList.toggle('on', s.sol);
  const pulse = clamp((s.t - 2.0) / 0.35, 0, 1);
  $('#solPulse').setAttribute('cx', (650 - pulse * 232).toFixed(1)); $('#solPulse').setAttribute('opacity', pulse > 0 && pulse < 1 ? 1 : 0);
  $('#ivPlate').setAttribute('y', s.ivOpen ? 208 : 240);
  $('#ivLed').setAttribute('fill', s.ivOpen ? '#22c55e' : '#555');
  $('#nrvFlap').setAttribute('transform', s.loaded && turning ? 'rotate(-55 522 430)' : '');
  $('#mpvStem').setAttribute('y', s.mpvOpen ? 166 : 174);
  $('#mpvStem').setAttribute('fill', s.mpvOpen ? '#22c55e' : '#d1291b');
  $('#thInd').setAttribute('fill', mixColor('3b82f6', 'e8a12a', s.thermo));

  // oil separator: level, waves, mist
  R.wave += vis * (turning ? 5 + 6 * sp : 0.6);
  const level = turning ? 505 + 8 * sp : 485, amp = turning ? 2.5 + 3 * sp : 0.6;
  let dpath = `M650 ${level}`;
  for (let x = 650; x <= 790; x += 10) dpath += ` L${x} ${(level + Math.sin(x * 0.07 + R.wave) * amp + Math.sin(x * 0.13 - R.wave * 1.3) * amp * 0.5).toFixed(1)}`;
  $('#oilSurf').setAttribute('d', dpath + ' L790 600 L650 600Z');
  const mistOn = turning && s.loaded ? sp : 0;
  for (const d of mistDots) {
    d.y -= d.v * vis * (0.3 + mistOn); d.ph += vis * 3;
    if (d.y < 280) { d.y = level - 5; d.x = 660 + Math.random() * 120; }
    d.el.setAttribute('cx', (d.x + Math.sin(d.ph) * 4).toFixed(1)); d.el.setAttribute('cy', d.y.toFixed(1));
    d.el.setAttribute('opacity', (mistOn * 0.8 * clamp((d.y - 280) / 80, 0, 1)).toFixed(2));
  }
  $('#elHeat').setAttribute('opacity', clamp((s.T - 60) / 60, 0, 0.3).toFixed(2));   // warm glow as the element heats up

  // gauges
  needle('#ndSump', 608, 270, 17, s.ps, 16);
  needle('#ndNet', 1549, 68, 15, s.p, 16);

  // VSD display + LED
  $('#vsdHz').textContent = s.P > 0.1 || turning ? fmt(sp * 87, 1) + ' Hz' : '-- Hz';
  $('#vsdLed').setAttribute('fill', running ? '#22c55e' : '#555');

  // water separator + drain
  const wl = s.cond * 50;
  $('#wsWater').setAttribute('y', (452 - wl).toFixed(1)); $('#wsWater').setAttribute('height', wl.toFixed(1));
  $('#drainLed').setAttribute('fill', s.drain ? '#3fa9f5' : '#22c55e');
  if (s.drain && Math.random() < vis * 6) puff(1196, 530, 4, '#4aa8e6', 20, 10);

  // dryer: beds, tower gauges, switching valve, check valves, purge, dew point
  $('#bedA').setAttribute('fill', mixColor('d6efe8', '2b7a68', s.mA));
  $('#bedB').setAttribute('fill', mixColor('d6efe8', '2b7a68', s.mB));
  [['#tgA', towerP(s, s.phA, s.fa) / 10], ['#tgB', towerP(s, s.phB, s.fb) / 10]].forEach(([id, g]) => {
    const h = Math.max(2, 106 * clamp(g, 0, 1));
    $(id).setAttribute('y', (438 - h).toFixed(1)); $(id).setAttribute('height', h.toFixed(1));
    $(id).setAttribute('fill', g > 0.35 ? '#e23b2e' : '#6d5bd0');
  });
  R.sw += ((s.phA === 'use' ? 0 : 180) - R.sw) * Math.min(1, vis * 4);
  $('#swBall').setAttribute('transform', `rotate(${R.sw.toFixed(1)} 1405 640)`);
  $('#cvA').setAttribute('cy', s.phA === 'use' && air > 0 ? 222 : 230);
  $('#cvB').setAttribute('cy', s.phB === 'use' && air > 0 ? 222 : 230);
  $('#purgeX').setAttribute('visibility', purgeOn ? 'hidden' : 'visible');
  $('#dpLed').setAttribute('fill', s.pdp > 3 ? '#f5a524' : '#22c55e');
  if (prev && ((prev.phA !== s.phA && s.phA === 'dep') || (prev.phB !== s.phB && s.phB === 'dep'))) puff(1405, 548, 18, '#dff4f7', -38, 50);   // tower blow-down
  const mx = TL.x + s.fa * TL.w;
  $('#tlMark').setAttribute('transform', `translate(${mx.toFixed(1)} ${TL.y - 11})`);
  $('#tlLine').setAttribute('x1', mx); $('#tlLine').setAttribute('x2', mx);

  // Elektronikon LCD + LEDs
  $('#lcd1').textContent = fmt(s.p) + ' bar';
  $('#lcd2').textContent = `${fmt(s.T, 0)}°C  PDP ${s.pdp > 0 ? '+' : ''}${fmt(s.pdp, 0)}°C`;
  $('#lcd3').textContent = s.st === 'stopped' ? 'STOPPED' : s.st === 'starting' ? 'SOFT START' : `LOADED ${Math.round(sp * 4800)} rpm`;
  $('#ledAuto').setAttribute('fill', running ? '#22c55e' : '#2a3237');
  const press = clamp((s.t - 1.0) / 0.35, 0, 1);                                     // the START button is pushed at t = 1 s
  $('#ctlStart').setAttribute('transform', press > 0 && press < 1 ? `translate(1040 152) scale(${(1 - 0.18 * Math.sin(press * Math.PI)).toFixed(3)}) translate(-1040 -152)` : '');

  // plant outlet
  $('#plantFlow').textContent = fmt(s.p > 0.3 ? s.Qd : 0) + ' m³/min';
  $('#ovBall').setAttribute('fill', '#22c55e'); $('#ovHandle').setAttribute('fill', '#16a34a');

  animateParticles(vis);
  prev = s;
}

function caption(c) {
  capEl.classList.remove('on');
  if (!c) return;
  setTimeout(() => { if (!playing) return; capEl.querySelector('.n').textContent = c[0]; capEl.querySelector('.t').textContent = c[1]; capEl.classList.add('on'); }, 260);
}
function frame(now) {
  const dt = clamp((now - last) / 1000, 0, 0.1); last = now;
  const t = (now - t0) / 1000;
  while (shot + 1 < SHOTS.length && SHOTS[shot + 1].t <= t) { shot++; camTo(SHOTS[shot].cam, SHOTS[shot].ms); caption(SHOTS[shot].cap); }
  if (camAnim) camAnim(now);
  render(state(t), dt);
  if (playing) raf = requestAnimationFrame(frame);
}

return {
  LENGTH,
  /* build once: inject the artwork into the scene and prime every dynamic part */
  build(section) {
    capEl = section.querySelector('.in-cap');
    section.insertAdjacentHTML('afterbegin', SVG);
    svg = section.querySelector('#cySvg'); $ = s => svg.querySelector(s);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');   // fill the viewport; the camera frames each part
    buildPipes(); buildMist(); buildLabels(); buildTimeline();
    buildTicks('#ticksSump', 608, 270, 21, 16); buildTicks('#ticksNet', 1549, 68, 19, 16);
    this.reset();
  },
  /* the machine at rest, overview framing, no caption */
  reset() {
    this.stop();
    shot = -1; prev = null; camAnim = null; R.sw = 0;
    particles.splice(0).forEach(p => p.el.remove());
    for (const id in FLOW) { FLOW[id].speed = 0; FLOW[id].op = 0; FLOW[id].el.setAttribute('opacity', 0); }
    camTo(SHOTS[0].cam, 1);
    render(state(0), 0);
    capEl.classList.remove('on');
  },
  start() {
    this.reset();
    playing = true; t0 = last = performance.now();
    raf = requestAnimationFrame(frame);
  },
  stop() { playing = false; if (raf) cancelAnimationFrame(raf); raf = 0; }
};
})();
