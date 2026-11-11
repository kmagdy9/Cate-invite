/* =========================================================================================
   gates.js — scene 02 "Into the Machine": the fly-through gates.
   Each gate that rushes past the camera is one station of the GA VSD⁺ + ICD cycle, drawn with
   the Compressor Live Demo's own artwork (compressor-demo-main/index.html, verbatim; every id is
   prefixed ig_ so nothing clashes with the invitation) and running: rotors turn, the fan spins,
   oil waves in the separator, dashes run through the pipes and the Elektronikon counts up to 7 bar.
   Order follows the air: intake → motor/VSD → screw element → oil separator → cooling → dryer → controller.
   ========================================================================================= */
const Gates = (() => {
'use strict';
const DEFS_RAW = `
<linearGradient id="gLobeM" gradientUnits="userSpaceOnUse" x1="0" y1="298" x2="0" y2="360"><stop offset="0" stop-color="#8f9aa1"/><stop offset=".22" stop-color="#f6f8f9"/><stop offset=".45" stop-color="#e4e9ec"/><stop offset=".8" stop-color="#9ea8ae"/><stop offset="1" stop-color="#6d777e"/></linearGradient>
<linearGradient id="gLobeF" gradientUnits="userSpaceOnUse" x1="0" y1="330" x2="0" y2="392"><stop offset="0" stop-color="#6d777e"/><stop offset=".45" stop-color="#e2e7ea"/><stop offset=".7" stop-color="#c3cbd0"/><stop offset="1" stop-color="#6a747a"/></linearGradient>
<linearGradient id="gRotShade2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".18"/><stop offset=".3" stop-color="#fff" stop-opacity=".1"/><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient>
<filter id="fRotBlur" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur id="rotBlur" stdDeviation="1.5 0"/></filter>
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
<radialGradient id="gHub" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#f0f3f5"/><stop offset="1" stop-color="#6b7780"/></radialGradient>
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
`;
const RAW = {
  filter: `
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
</g>`,
  motor: `
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
</g>`,
  vsd: `
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
</g>`,
  inletvalve: `
<g class="part" data-id="inletvalve">
<path d="M352 196 H418 V252 Q418 262 406 266 L398 282 H372 L364 266 Q352 262 352 252Z" fill="url(#gMetalH)" stroke="#20272c" stroke-width="2"/>
<rect x="362" y="206" width="46" height="48" rx="4" fill="#161c20"/>
<rect id="ivPlate" x="364" y="208" width="42" height="8" rx="2" fill="#e6ebef" stroke="#2a3237"/>
<rect x="381" y="186" width="8" height="14" fill="url(#gMetal)" stroke="#20272c"/>
<circle id="ivLed" cx="410" cy="200" r="4" fill="#555"/>
</g>`,
  element: `
<g class="part" data-id="element">
<rect x="290" y="280" width="270" height="130" rx="18" fill="url(#gCast)" stroke="#1a2024" stroke-width="2"/>
<rect x="282" y="300" width="14" height="90" rx="4" fill="url(#gMetal)" stroke="#20272c"/>
<rect x="554" y="300" width="14" height="90" rx="4" fill="url(#gMetal)" stroke="#20272c"/>
<rect x="302" y="292" width="246" height="106" rx="10" fill="#12171a" stroke="#0a0d0f" stroke-width="2"/>
<g clip-path="url(#cpRot)">
<rect x="305" y="297" width="240" height="96" fill="#9fb3bf"/>
<g filter="url(#fRotBlur)"><g id="rotF"><path d="M119.0 330.0 L160.3 330.0 C170.0 346.2 177.1 379.7 204.3 384.0 Q183.7 392.0 163.0 384.0 C135.7 379.7 128.7 346.2 119.0 330.0Z" fill="url(#gLobeF)" stroke="#14191c" stroke-width="1.6" stroke-linejoin="round"/><path d="M160.3 330.0 L201.7 330.0 C211.3 346.2 218.4 379.7 245.7 384.0 Q225.0 392.0 204.3 384.0 C177.1 379.7 170.0 346.2 160.3 330.0Z" fill="url(#gLobeF)" stroke="#14191c" stroke-width="1.6" stroke-linejoin="round"/><path d="M201.7 330.0 L243.0 330.0 C252.7 346.2 259.7 379.7 287.0 384.0 Q266.3 392.0 245.7 384.0 C218.4 379.7 211.3 346.2 201.7 330.0Z" fill="url(#gLobeF)" stroke="#14191c" stroke-width="1.6" stroke-linejoin="round"/><path d="M243.0 330.0 L284.3 330.0 C294.0 346.2 301.1 379.7 328.3 384.0 Q307.7 392.0 287.0 384.0 C259.7 379.7 252.7 346.2 243.0 330.0Z" fill="url(#gLobeF)" stroke="#14191c" stroke-width="1.6" stroke-linejoin="round"/><path d="M284.3 330.0 L325.7 330.0 C335.3 346.2 342.4 379.7 369.7 384.0 Q349.0 392.0 328.3 384.0 C301.1 379.7 294.0 346.2 284.3 330.0Z" fill="url(#gLobeF)" stroke="#14191c" stroke-width="1.6" stroke-linejoin="round"/><path d="M325.7 330.0 L367.0 330.0 C376.7 346.2 383.7 379.7 411.0 384.0 Q390.3 392.0 369.7 384.0 C342.4 379.7 335.3 346.2 325.7 330.0Z" fill="url(#gLobeF)" stroke="#14191c" stroke-width="1.6" stroke-linejoin="round"/><path d="M367.0 330.0 L408.3 330.0 C418.0 346.2 425.1 379.7 452.3 384.0 Q431.7 392.0 411.0 384.0 C383.7 379.7 376.7 346.2 367.0 330.0Z" fill="url(#gLobeF)" stroke="#14191c" stroke-width="1.6" stroke-linejoin="round"/><path d="M408.3 330.0 L449.7 330.0 C459.3 346.2 466.4 379.7 493.7 384.0 Q473.0 392.0 452.3 384.0 C425.1 379.7 418.0 346.2 408.3 330.0Z" fill="url(#gLobeF)" stroke="#14191c" stroke-width="1.6" stroke-linejoin="round"/><path d="M449.7 330.0 L491.0 330.0 C500.7 346.2 507.7 379.7 535.0 384.0 Q514.3 392.0 493.7 384.0 C466.4 379.7 459.3 346.2 449.7 330.0Z" fill="url(#gLobeF)" stroke="#14191c" stroke-width="1.6" stroke-linejoin="round"/><path d="M491.0 330.0 L532.3 330.0 C542.0 346.2 549.1 379.7 576.3 384.0 Q555.7 392.0 535.0 384.0 C507.7 379.7 500.7 346.2 491.0 330.0Z" fill="url(#gLobeF)" stroke="#14191c" stroke-width="1.6" stroke-linejoin="round"/><path d="M532.3 330.0 L573.7 330.0 C583.3 346.2 590.4 379.7 617.7 384.0 Q597.0 392.0 576.3 384.0 C549.1 379.7 542.0 346.2 532.3 330.0Z" fill="url(#gLobeF)" stroke="#14191c" stroke-width="1.6" stroke-linejoin="round"/><path d="M573.7 330.0 L615.0 330.0 C624.7 346.2 631.7 379.7 659.0 384.0 Q638.3 392.0 617.7 384.0 C590.4 379.7 583.3 346.2 573.7 330.0Z" fill="url(#gLobeF)" stroke="#14191c" stroke-width="1.6" stroke-linejoin="round"/></g></g>
<g filter="url(#fRotBlur)"><g id="rotM"><path d="M119.0 305.0 Q150.0 295.0 181.0 305.0 C220.7 308.8 230.9 337.9 245.0 352.0 Q214.0 366.0 183.0 352.0 C168.9 337.9 158.7 308.8 119.0 305.0Z" fill="url(#gLobeM)" stroke="#14191c" stroke-width="1.6" stroke-linejoin="round"/><path d="M181.0 305.0 Q212.0 295.0 243.0 305.0 C282.7 308.8 292.9 337.9 307.0 352.0 Q276.0 366.0 245.0 352.0 C230.9 337.9 220.7 308.8 181.0 305.0Z" fill="url(#gLobeM)" stroke="#14191c" stroke-width="1.6" stroke-linejoin="round"/><path d="M243.0 305.0 Q274.0 295.0 305.0 305.0 C344.7 308.8 354.9 337.9 369.0 352.0 Q338.0 366.0 307.0 352.0 C292.9 337.9 282.7 308.8 243.0 305.0Z" fill="url(#gLobeM)" stroke="#14191c" stroke-width="1.6" stroke-linejoin="round"/><path d="M305.0 305.0 Q336.0 295.0 367.0 305.0 C406.7 308.8 416.9 337.9 431.0 352.0 Q400.0 366.0 369.0 352.0 C354.9 337.9 344.7 308.8 305.0 305.0Z" fill="url(#gLobeM)" stroke="#14191c" stroke-width="1.6" stroke-linejoin="round"/><path d="M367.0 305.0 Q398.0 295.0 429.0 305.0 C468.7 308.8 478.9 337.9 493.0 352.0 Q462.0 366.0 431.0 352.0 C416.9 337.9 406.7 308.8 367.0 305.0Z" fill="url(#gLobeM)" stroke="#14191c" stroke-width="1.6" stroke-linejoin="round"/><path d="M429.0 305.0 Q460.0 295.0 491.0 305.0 C530.7 308.8 540.9 337.9 555.0 352.0 Q524.0 366.0 493.0 352.0 C478.9 337.9 468.7 308.8 429.0 305.0Z" fill="url(#gLobeM)" stroke="#14191c" stroke-width="1.6" stroke-linejoin="round"/><path d="M491.0 305.0 Q522.0 295.0 553.0 305.0 C592.7 308.8 602.9 337.9 617.0 352.0 Q586.0 366.0 555.0 352.0 C540.9 337.9 530.7 308.8 491.0 305.0Z" fill="url(#gLobeM)" stroke="#14191c" stroke-width="1.6" stroke-linejoin="round"/><path d="M553.0 305.0 Q584.0 295.0 615.0 305.0 C654.7 308.8 664.9 337.9 679.0 352.0 Q648.0 366.0 617.0 352.0 C602.9 337.9 592.7 308.8 553.0 305.0Z" fill="url(#gLobeM)" stroke="#14191c" stroke-width="1.6" stroke-linejoin="round"/></g></g>
<rect x="305" y="308" width="240" height="6" rx="3" fill="#fff" opacity=".42"/><rect x="305" y="363" width="240" height="4" rx="2" fill="#fff" opacity=".32"/>
<g id="oilMistEl"></g>
</g>
<rect id="wearOv" x="305" y="297" width="240" height="96" fill="url(#pWear)" opacity="0" clip-path="url(#cpRot)"/>
<rect id="elHeat" x="302" y="292" width="246" height="106" rx="10" fill="#ff3b1f" opacity="0"/>
<g id="brgHot" opacity="0" fill="#ff4a1f" filter="url(#fGlow)"><circle cx="289" cy="322" r="8"/><circle cx="289" cy="368" r="8"/><circle cx="561" cy="322" r="8"/><circle cx="561" cy="368" r="8"/></g>
<text id="elSeize" x="425" y="352" class="seize-txt" opacity="0">SEIZED</text>
<path d="M302 292 l8 6 l-4 8 l9 5 l-5 9 l8 6" fill="none" stroke="#f5c400" stroke-width="2" opacity=".75"/>
<g fill="#20272c"><circle cx="300" cy="286" r="2.5"/><circle cx="550" cy="286" r="2.5"/><circle cx="300" cy="404" r="2.5"/><circle cx="550" cy="404" r="2.5"/></g>
</g>`,
  nrv: `
<g class="part" data-id="nrv">
<rect x="516" y="416" width="28" height="28" rx="4" fill="url(#gMetalH)" stroke="#20272c" stroke-width="2"/>
<path id="nrvFlap" d="M522 430 L538 430" stroke="#161c20" stroke-width="3.5" stroke-linecap="round"/>
</g>`,
  separator: `
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
</g>`,
  sumpgauge: `
<g class="part" data-id="sumpgauge">
<path d="M640 270 H630" stroke="#9aa6ae" stroke-width="6"/>
<circle cx="608" cy="270" r="23" fill="url(#gFace)" stroke="#2a3237" stroke-width="3.5"/>
<g id="ticksSump"></g>
<path id="ndSump" d="M608 270 L608 252" stroke="#d1291b" stroke-width="2.5" stroke-linecap="round"/>
<circle cx="608" cy="270" r="3" fill="#20272c"/>
</g>`,
  mpv: `
<g class="part" data-id="mpv">
<rect x="702" y="196" width="36" height="36" rx="5" fill="url(#gMetalH)" stroke="#20272c" stroke-width="2"/>
<rect x="708" y="180" width="24" height="18" rx="3" fill="url(#gMetal)" stroke="#20272c" stroke-width="1.5"/>
<rect id="mpvStem" x="716" y="174" width="8" height="10" rx="1" fill="#d1291b"/>
</g>`,
  solenoid: `
<g class="part" data-id="solenoid">
<rect x="664" y="222" width="12" height="16" fill="url(#gMetal)" stroke="#20272c"/>
<rect x="650" y="190" width="40" height="34" rx="4" fill="#1d2329" stroke="#0a0d0f" stroke-width="2"/>
<rect id="solCoil" x="655" y="195" width="30" height="20" rx="3" fill="#3a434a"/>
<text x="670" y="209" class="plate sm" style="fill:#e5eaee">Y1</text>
<circle id="solLed" cx="684" cy="219" r="3" fill="#555"/>
</g>`,
  aftercooler: `
<g class="part" data-id="aftercooler">
<rect x="880" y="270" width="200" height="80" rx="4" fill="url(#gMetal)" stroke="#20272c" stroke-width="2"/>
<rect x="896" y="276" width="168" height="68" fill="url(#pCooler)"/>
<rect id="acFoul" x="896" y="276" width="168" height="68" fill="#5a4626" opacity="0"/>
<rect x="880" y="270" width="16" height="80" fill="url(#gMetalH)" stroke="#20272c"/>
<rect x="1064" y="270" width="16" height="80" fill="url(#gMetalH)" stroke="#20272c"/>
</g>`,
  oilcooler: `
<g class="part" data-id="oilcooler">
<rect x="880" y="380" width="200" height="80" rx="4" fill="url(#gMetal)" stroke="#20272c" stroke-width="2"/>
<rect x="896" y="386" width="168" height="68" fill="url(#pCooler)"/>
<rect id="ocFoul" x="896" y="386" width="168" height="68" fill="#5a4626" opacity="0"/>
<rect x="880" y="380" width="16" height="80" fill="url(#gOilHdr)" stroke="#20272c"/>
<rect x="1064" y="380" width="16" height="80" fill="url(#gOilHdr)" stroke="#20272c"/>
</g>`,
  fan: `
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
<circle cx="980" cy="562" r="12" fill="url(#gHub)" stroke="#20272c"/>
<g fill="none" stroke="#fff" stroke-opacity=".14"><circle cx="980" cy="562" r="30"/><circle cx="980" cy="562" r="44"/><path d="M926 562H1034M980 508V616"/></g>
</g>`,
  towers: `
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
</g>`,
  checkvalves: `
<g class="part" data-id="checkvalves">
<circle cx="1315" cy="226" r="11" fill="url(#gFace)" stroke="#20272c" stroke-width="2"/><circle id="cvA" cx="1315" cy="230" r="5" fill="#161c20"/>
<circle cx="1495" cy="226" r="11" fill="url(#gFace)" stroke="#20272c" stroke-width="2"/><circle id="cvB" cx="1495" cy="230" r="5" fill="#161c20"/>
</g>`,
  purge: `
<g class="part" data-id="purge">
<rect x="1386" y="266" width="38" height="24" rx="4" fill="url(#gMetalH)" stroke="#20272c" stroke-width="2"/>
<rect x="1395" y="251" width="20" height="16" rx="2" fill="url(#gPaint)" stroke="#0d2a47"/>
<path id="purgeX" d="M1398 271l14 14M1412 271l-14 14" stroke="#e23b2e" stroke-width="2.5" stroke-linecap="round"/>
</g>`,
  silencer: `
<g class="part" data-id="silencer">
<rect x="1391" y="550" width="28" height="54" rx="10" fill="url(#gMetalH)" stroke="#20272c" stroke-width="2"/>
<rect x="1395" y="558" width="20" height="38" rx="6" fill="url(#pPerf)"/>
</g>`,
  switchvalve: `
<g class="part" data-id="switchvalve">
<circle cx="1405" cy="640" r="25" fill="url(#gMetal)" stroke="#20272c" stroke-width="2"/>
<g id="swBall"><circle cx="1405" cy="640" r="17" fill="#f4f6f8" stroke="#111" stroke-width="2"/><path d="M1405 623 A17 17 0 0 1 1405 657Z" fill="#111"/></g>
</g>`,
  controller: `
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
</g>`
};

/* ---------- helpers ---------- */
const f1 = n => +n.toFixed(1);
const px = s => s.replace(/id="([^"]+)"/g, 'id="ig_$1"').replace(/url\(#([^)]+)\)/g, 'url(#ig_$1)');
const MED = { intake: '#a9c6cf', oil: '#e8a12a', mix: '#94ad6e', wet: '#3f9a85', dry: '#7fdde3', water: '#4aa8e6', power: '#ffb020' };
// a demo pipe: dark outline + coloured body + highlight, and (unless flow=false) the running white dashes on top
function pipe(d, m, w, flow = true) {
  let s = '';
  if (m === 'power') s = `<path d="${d}" class="pipe-o" stroke-width="${w + 3}"/><path d="${d}" class="pipe-c" stroke="#262d33" stroke-width="${w}"/>`;
  else s = `<path d="${d}" class="pipe-o" stroke-width="${w + 4}"/><path d="${d}" class="pipe-c" stroke="${MED[m]}" stroke-width="${w}"/><path d="${d}" class="pipe-h" stroke-width="${Math.max(1.5, w * .22)}"/>`;
  if (flow) s += `<path d="${d}" class="ig-flow${m === 'power' ? ' pw' : ''}" stroke="${m === 'power' ? MED.power : '#fff'}" stroke-width="${Math.max(2.5, w * .42)}"/>`;
  return s;
}
const dash = (d, col, w, cls = 'ig-flow') => `<path d="${d}" class="${cls}" stroke="${col}" stroke-width="${w}"/>`;
// place demo-coordinate artwork in the 1000×1000 gate: bbox [x,y,w,h] centred, scaled by s
const fit = (inner, [x, y, w, h], s) => `<g class="art" transform="translate(${f1(500 - s * (x + w / 2))} ${f1(500 - s * (y + h / 2))}) scale(${s})">${inner}</g>`;
const svg = body => `<svg viewBox="0 0 1000 1000" aria-hidden="true">${body}</svg>`;
const gate = (dl, r0, r1, body) => `<div class="gate" style="--dl:${dl}s;--r0:${r0}deg;--r1:${r1}deg">${svg(body)}</div>`;
const SHADE = `<ellipse cx="500" cy="540" rx="440" ry="410" fill="url(#ig_gShade)"/>`;

/* ---------- the parts, set to their "running" state before the ids are prefixed ---------- */
const P = {};
for (const k in RAW) P[k] = RAW[k];
P.vsd = P.vsd.replace('>-- Hz<', '>50 Hz<').replace('id="vsdLed" cx="276" cy="542" r="4.5" fill="#555"', 'id="vsdLed" class="ig-led" cx="276" cy="542" r="4.5" fill="#22c55e"');
P.inletvalve = P.inletvalve.replace('id="ivLed" cx="410" cy="200" r="4" fill="#555"', 'id="ivLed" cx="410" cy="200" r="4" fill="#22c55e"');
P.nrv = P.nrv.replace('id="nrvFlap"', 'id="nrvFlap" transform="rotate(-55 522 430)"');
P.mpv = P.mpv.replace('id="mpvStem" x="716" y="174" width="8" height="10" rx="1" fill="#d1291b"', 'id="mpvStem" x="716" y="166" width="8" height="10" rx="1" fill="#22c55e"');
P.solenoid = P.solenoid.replace('id="solLed" cx="684" cy="219" r="3" fill="#555"', 'id="solLed" class="ig-led" cx="684" cy="219" r="3" fill="#22c55e"').replace('id="solCoil" x="655" y="195" width="30" height="20" rx="3" fill="#3a434a"', 'id="solCoil" x="655" y="195" width="30" height="20" rx="3" fill="#5a6670"');
P.towers = P.towers.replace('id="tgB" x="1560" y="332" width="8" height="106"', 'id="tgB" x="1560" y="418" width="8" height="20"').replace('id="bedB" x="1460" y="304" width="70" height="238" fill="#3f8a78"', 'id="bedB" x="1460" y="304" width="70" height="238" fill="#4a7585"');
P.purge = P.purge.replace('id="purgeX"', 'id="purgeX" visibility="hidden"');
P.controller = P.controller.replace('class="lcd">--<', 'class="lcd">PDP  -40 °C<').replace('>STOPPED<', '>STARTING<')
  .replace('id="ledAuto" cx="962" cy="152" r="5" fill="#2a3237"', 'id="ledAuto" class="ig-led" cx="962" cy="152" r="5" fill="#22c55e"')
  .replace(/<g id="ctlStart"[^>]*>/, '<g id="ctlStart" filter="url(#fGlow)">').replace(/<g id="ctlStop"[^>]*>/, '<g id="ctlStop">').replace(/<g id="ctlEstop"[^>]*>.*?<\/g>/, '');
for (const k in P) P[k] = px(P[k]);

/* ---------- gates (demo coordinates inside fit(); pipes under the parts, air dashes over them) ---------- */
const DL = [.15, 1.25, 2.35, 3.45, 4.55, 5.65, 6.75];   // take-off of each gate, seconds after the scene starts flying
const FLY = 2.4;                                          // one gate's flight (CSS @keyframes fly)
const CAPS = [['01', 'Air intake filter'], ['02', 'Motor IE5 · VSD drive'], ['03', 'Screw element'], ['04', 'Oil separator'],
  ['05', 'Aftercooler · oil cooler · fan'], ['06', 'ICD desiccant dryer'], ['07', 'Elektronikon · 7 bar to plant']];
const G = [
  // 01 · intake filter: air drawn in from the left, up into the machine
  gate(DL[0], 3, -4, SHADE + fit(pipe('M80 420 V250', 'intake', 24) + dash('M-50 494 H40', MED.intake, 7) + dash('M-50 560 H40', MED.intake, 7) + P.filter, [-50, 250, 183, 376], 2.2)),
  // 02 · motor + VSD drive: mains in, VSD feeding the motor, coupling spinning
  gate(DL[1], -6, 5, SHADE + fit(pipe('M220 620 V690 H110', 'power', 7) + pipe('M220 470 V404', 'power', 7) + P.motor + P.vsd, [110, 281, 180, 413], 2.05)),
  // 03 · screw element: inlet valve open, both rotors turning, oil/air mix out through the non-return valve
  gate(DL[2], 4, -3, SHADE + fit(pipe('M385 110 V196', 'intake', 24) + pipe('M530 410 V448 H620', 'mix', 13) + P.inletvalve + P.element + P.nrv, [282, 110, 338, 350], 2.5)),
  // 04 · oil separator: mix in, oil level waving, mist rising, 7 bar on the sump gauge, air out through the MPV
  gate(DL[3], -3, 4, SHADE + fit(pipe('M560 448 H640', 'mix', 13) + pipe('M738 214 H820', 'wet', 13) + pipe('M720 610 V650 H800', 'oil', 10) + `<path class="sol-line on" d="M650 206 H560"/>` + P.separator + P.sumpgauge + P.mpv + P.solenoid, [560, 174, 260, 476], 1.8)),
  // 05 · cooling: hot air through the aftercooler, hot oil through the oil cooler, the fan pulling air up through both
  gate(DL[4], 5, -4, SHADE + fit(pipe('M820 310 H880', 'wet', 13) + pipe('M1080 310 H1140', 'wet', 13) + pipe('M820 420 H880', 'oil', 10) + pipe('M1080 420 H1140', 'oil', 10) + P.aftercooler + P.oilcooler + P.fan + ['M930 492 V262', 'M980 496 V262', 'M1030 492 V262'].map(d => dash(d, '#e6f6ff', 5, 'ig-flow cool')).join(''), [820, 262, 320, 362], 2.35)),
  // 06 · ICD dryer: tower A drying, tower B regenerating on purge air, dry air out at the top
  gate(DL[5], -4, 3, SHADE + fit(pipe('M1250 700 H1405 V665', 'wet', 13) + pipe('M1315 560 V640 H1380', 'wet', 13) + pipe('M1495 560 V640 H1430', 'wet', 13, false) + pipe('M1405 615 V604', 'wet', 10) + pipe('M1315 250 V200 H1405', 'dry', 11) + pipe('M1495 250 V200 H1405', 'dry', 11, false) + pipe('M1405 200 V150 H1560', 'dry', 14) + pipe('M1360 278 H1450', 'dry', 7) + P.towers + P.checkvalves + P.purge + P.silencer + P.switchvalve + dash('M1315 536 V306', '#fff', 5), [1236, 150, 338, 550], 1.56)),
  // 07 · Elektronikon: pressure climbing to 7.0 bar, RUNNING
  gate(DL[6], 2, -2, SHADE + fit(P.controller, [900, 22, 290, 152], 3))
];
const LAST = DL[DL.length - 1] + FLY;   // seconds: the last gate has flown past

// bulkhead: a steel frame we pass through, with a ring of bolts (as in the original fly-through)
const bolts = [];
for (let i = 0; i < 8; i++) { const t = 150 + i * 100; bolts.push([t, 60], [t, 940], [60, t], [940, t]); }
const rr = (a, b, r) => `M${a + r} ${a}H${b - r}A${r} ${r} 0 0 1 ${b} ${a + r}V${b - r}A${r} ${r} 0 0 1 ${b - r} ${b}H${a + r}A${r} ${r} 0 0 1 ${a} ${b - r}V${a + r}A${r} ${r} 0 0 1 ${a + r} ${a}Z`;
const rib = (dl, r0, r1) => gate(dl, r0, r1,
  `<path fill="url(#ig_inRib)" fill-rule="evenodd" d="${rr(20, 980, 50)} ${rr(100, 900, 46)}"/>` +
  `<path fill="none" stroke="#ffffff" stroke-opacity=".35" stroke-width="3" d="${rr(100, 900, 46)}"/>` +
  `<path fill="none" stroke="#00141e" stroke-opacity=".6" stroke-width="3" d="${rr(20, 980, 50)}"/>` +
  bolts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="url(#ig_inBolt)"/>`).join(''));

const DEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${px(DEFS_RAW)}
  <radialGradient id="ig_gShade"><stop offset="0" stop-color="#030810" stop-opacity=".8"/><stop offset=".55" stop-color="#030810" stop-opacity=".45"/><stop offset="1" stop-color="#030810" stop-opacity="0"/></radialGradient>
  <linearGradient id="ig_inRib" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d2d9de"/><stop offset=".3" stop-color="#9aa7b1"/><stop offset=".7" stop-color="#5c6a74"/><stop offset="1" stop-color="#2b3339"/></linearGradient>
  <radialGradient id="ig_inBolt" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#c5ced5"/><stop offset="1" stop-color="#2b3339"/></radialGradient>
</defs></svg>`;

/* ---------- running machinery (JS-driven parts; the dashes and LEDs are CSS) ---------- */
const NS = 'http://www.w3.org/2000/svg';
let E = null, t = 0;
const R = { rot: 0, fan: 0, wave: 0 };
const mist = [];
function svgEl(tag, attrs, parent) { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent.appendChild(e); return e; }
function ticks(g, cx, cy, r, max) {
  for (let i = 0; i <= max; i += 2) {
    const a = (-135 + 270 * i / max) * Math.PI / 180, r1 = r - (i % 4 === 0 ? 6 : 3.5);
    svgEl('line', { x1: cx + Math.sin(a) * r1, y1: cy - Math.cos(a) * r1, x2: cx + Math.sin(a) * r, y2: cy - Math.cos(a) * r, stroke: '#2a3237', 'stroke-width': 1.2 }, g);
  }
  const p = a => `${cx + Math.sin(a) * (r - 1.5)} ${cy - Math.cos(a) * (r - 1.5)}`, red = (-135 + 270 * .83) * Math.PI / 180, red2 = 135 * Math.PI / 180;
  svgEl('path', { d: `M${p(red)} A${r - 1.5} ${r - 1.5} 0 0 1 ${p(red2)}`, stroke: '#d1291b', 'stroke-width': 2.5, fill: 'none' }, g);
}
function needle(el, cx, cy, len, v, max) {
  const a = (-135 + 270 * Math.min(1, v / max)) * Math.PI / 180;
  el.setAttribute('d', `M${cx} ${cy} L${(cx + Math.sin(a) * len).toFixed(1)} ${(cy - Math.cos(a) * len).toFixed(1)}`);
}
function build(host) {
  // paint servers live in a zero-size holder on <body>, so they resolve from every scene (visibility:hidden or not)
  if (!document.getElementById('ig_defs')) { const d = document.createElement('div'); d.id = 'ig_defs'; d.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden'; d.innerHTML = DEFS; document.body.appendChild(d); }
  host.innerHTML = [G[6], rib(DL[6] - .15, 6, -2), G[5], G[4], rib(DL[4] - .15, -4, 3), G[3], G[2], rib(DL[2] - .15, 3, -4), G[1], G[0], rib(0, 2, -5)].join('');
  const q = s => host.querySelector(s);
  const D = id => document.getElementById(id);   // the patterns live in the defs holder on <body>
  E = { rotM: q('#ig_rotM'), rotF: q('#ig_rotF'), coup: D('ig_pCoup'), fan: q('#ig_fanBlades'), oil: q('#ig_oilSurf'), lcd1: q('#ig_lcd1'), lcd3: q('#ig_lcd3'), sw: q('#ig_swBall') };
  ticks(q('#ig_ticksSump'), 608, 270, 21, 16); needle(q('#ig_ndSump'), 608, 270, 17, 7, 16);
  E.sw.setAttribute('transform', 'rotate(-90 1405 640)');   // switching valve on tower A
  const mg = q('#ig_mist'); mist.length = 0;
  for (let i = 0; i < 26; i++) {
    const c = svgEl('circle', { cx: 0, cy: 0, r: (1 + Math.random() * 2).toFixed(1), fill: '#f1c070', opacity: 0 }, mg);
    mist.push({ el: c, x: 662 + Math.random() * 116, y: 300 + Math.random() * 260, v: 22 + Math.random() * 40, ph: Math.random() * 6 });
  }
  reset();
}
function reset() { t = 0; R.rot = R.fan = R.wave = 0; if (E) frame(0); }
function frame(dt) {   // dt in ms, called every animation frame while the scene plays
  if (!E) return;
  const s = dt / 1000; t += s;
  R.rot += s * 330;
  E.rotM.setAttribute('transform', `translate(${(R.rot % 62).toFixed(2)} 0)`);                   // male rotor: 4 lobes
  E.rotF.setAttribute('transform', `translate(${((R.rot * 2 / 3) % (62 * 4 / 6)).toFixed(2)} 0)`);   // female rotor: 6 flutes, 2/3 speed
  E.coup.setAttribute('patternTransform', `translate(0 ${((R.rot * .78) % 10).toFixed(2)})`);
  R.fan = (R.fan + s * 900) % 360;
  E.fan.setAttribute('transform', `rotate(${R.fan.toFixed(1)} 980 562)`);
  // oil level waving in the separator
  R.wave += s * 9;
  let d = 'M650 508';
  for (let x = 650; x <= 790; x += 10) d += ` L${x} ${(508 + Math.sin(x * .07 + R.wave) * 3.5 + Math.sin(x * .13 - R.wave * 1.3) * 1.8).toFixed(1)}`;
  E.oil.setAttribute('d', d + ' L790 600 L650 600Z');
  for (const m of mist) {
    m.y -= m.v * s; m.ph += s * 3;
    if (m.y < 285) { m.y = 500 + Math.random() * 40; m.x = 662 + Math.random() * 116; }
    m.el.setAttribute('cx', (m.x + Math.sin(m.ph) * 4).toFixed(1)); m.el.setAttribute('cy', m.y.toFixed(1));
    m.el.setAttribute('opacity', (0.55 * Math.min(1, (m.y - 285) / 60) * Math.min(1, (500 - m.y) / 40 + .3)).toFixed(2));
  }
  // Elektronikon: pressure climbs to 7.0 bar while its gate flies toward us
  const k = Math.max(0, Math.min(1, (t - DL[6] - .2) / 1.5)), p = 7 * (1 - Math.pow(1 - k, 3));
  E.lcd1.textContent = p.toFixed(1) + ' bar';
  E.lcd3.textContent = p < 6.95 ? 'LOADING' : 'RUNNING';
}
/* ---------- the cabinet interior (scene 01): what you see through the open doors, in the cavity's 200×360 box ----------
   screw element up top, oil separator bottom-left, motor + VSD bottom-right, the glowing core between them;
   same artwork, ids stripped (one copy per id lives in the gates), oil level fixed. */
function cavity() {
  const noId = s => s.replace(/ id="[^"]*"/g, '');
  const sep = (P.separator + P.sumpgauge + P.mpv + P.solenoid).replace('<path id="ig_oilSurf" fill="url(#ig_gOil)"/>', '<path fill="url(#ig_gOil)" d="M650 506 L790 506 L790 600 L650 600Z"/>');
  const at = (x, y, s, bx, by, body) => `<g transform="translate(${f1(x - bx * s)} ${f1(y - by * s)}) scale(${s})">${body}</g>`;
  return `<svg viewBox="0 0 200 360" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><g opacity=".96">${noId(
    pipe('M152 115 V136 H56 V160', 'mix', 5) + pipe('M56 142 V126 H196', 'dry', 5) +
    at(28, 50, .5, 282, 280, P.inletvalve + P.element + P.nrv) +
    at(24, 165, .4, 640, 230, sep) +
    at(120, 150, .42, 132, 281, pipe('M220 470 V404', 'power', 7) + P.motor + P.vsd))}</g></svg>`;
}
return { CAPS, DL, FLY, LAST, build, reset, frame, cavity };
})();
