// Livskompassen L0-atoms A1+A2+A3+A4 — ES5-safe for Figma Desktop plugin VM
// Plugins → Development → Livskompassen L0-atoms → Run

figma.showUI(__html__, { width: 440, height: 360, title: 'L0-atoms A1+A2+A3+A4' });

figma.ui.onmessage = function (msg) {
  if (msg.type === 'close') figma.closePlugin();
};

function createLayoutFrame(direction, config) {
  config = config || {};
  var frame = figma.createFrame();
  frame.name = config.name || 'Frame';
  frame.layoutMode = direction;
  frame.primaryAxisSizingMode = config.primaryAxisSizingMode || 'AUTO';
  frame.counterAxisSizingMode = config.counterAxisSizingMode || 'AUTO';
  if (config.itemSpacing != null) frame.itemSpacing = config.itemSpacing;
  if (config.paddingTop != null) frame.paddingTop = config.paddingTop;
  if (config.paddingBottom != null) frame.paddingBottom = config.paddingBottom;
  if (config.paddingLeft != null) frame.paddingLeft = config.paddingLeft;
  if (config.paddingRight != null) frame.paddingRight = config.paddingRight;
  if (config.counterAxisAlignItems) frame.counterAxisAlignItems = config.counterAxisAlignItems;
  return frame;
}

function bindPaint(variable, fallback, opacity) {
  var paint = { type: 'SOLID', color: fallback };
  if (opacity != null) {
    paint.opacity = opacity;
  }
  if (variable) {
    paint = figma.variables.setBoundVariableForPaint(paint, 'color', variable);
  }
  return paint;
}

function resolveRgb(variable, modeId, fallback) {
  if (!variable) return fallback;
  var val = variable.valuesByMode[modeId];
  if (val && typeof val === 'object' && val.r != null) return val;
  return fallback;
}

function placeOverlayChild(parent, node, x, y, insertIndex) {
  if (insertIndex != null) {
    parent.insertChild(insertIndex, node);
  } else {
    parent.appendChild(node);
  }
  if (parent.layoutMode !== 'NONE') {
    node.layoutPositioning = 'ABSOLUTE';
  }
  node.x = x;
  node.y = y;
}

function upsertTopHighlight(card) {
  var existing = card.findOne(function (n) {
    return n.name === 'TopHighlight';
  });
  if (existing) existing.remove();

  var hl = figma.createRectangle();
  hl.name = 'TopHighlight';
  hl.resize(card.width, 1);
  hl.fills = [{
    type: 'GRADIENT_LINEAR',
    gradientTransform: [[1, 0, 0], [0, 1, 0]],
    gradientStops: [
      { color: { r: 1, g: 1, b: 1, a: 0 }, position: 0 },
      { color: { r: 1, g: 1, b: 1, a: 0.1 }, position: 0.5 },
      { color: { r: 1, g: 1, b: 1, a: 0 }, position: 1 },
    ],
  }];
  hl.strokes = [];
  placeOverlayChild(card, hl, 0, 0, null);
}

function upsertGlowBottom(card, r, g, b, alpha) {
  var existing = card.findOne(function (n) {
    return n.name === 'GlowBottom';
  });
  if (existing) existing.remove();

  var glowH = 56;
  var glow = figma.createRectangle();
  glow.name = 'GlowBottom';
  glow.resize(card.width, glowH);
  glow.fills = [{
    type: 'GRADIENT_LINEAR',
    gradientTransform: [[0, 1, 0], [0, -1, 1]],
    gradientStops: [
      { color: { r: r, g: g, b: b, a: alpha }, position: 0 },
      { color: { r: r, g: g, b: b, a: 0 }, position: 1 },
    ],
  }];
  glow.strokes = [];
  placeOverlayChild(card, glow, 0, card.height - glowH, 0);
}

function applyGlassCardChrome(card, surface2Var, borderVar) {
  if (card.layoutMode === 'NONE') {
    card.layoutMode = 'VERTICAL';
    card.primaryAxisSizingMode = 'AUTO';
    card.counterAxisSizingMode = 'FIXED';
  }
  card.clipsContent = true;
  card.cornerRadius = 24;
  card.fills = [bindPaint(surface2Var, { r: 0.1, g: 0.1, b: 0.1 })];
  card.strokes = [bindPaint(borderVar, { r: 0.83, g: 0.69, b: 0.22 })];
  card.strokeWeight = 1;
  card.effects = [
    {
      type: 'DROP_SHADOW',
      color: { r: 0, g: 0, b: 0, a: 0.5 },
      offset: { x: 0, y: 10 },
      radius: 30,
      spread: 0,
      visible: true,
      blendMode: 'NORMAL',
    },
    {
      type: 'BACKGROUND_BLUR',
      radius: 24,
      visible: true,
    },
  ];
  upsertTopHighlight(card);
}

function upsertBottomAccentBar(card, accentVar, accentRgb) {
  var existing = card.findOne(function (n) {
    return n.name === 'BottomAccentBar';
  });
  if (existing) existing.remove();

  var bar = figma.createRectangle();
  bar.name = 'BottomAccentBar';
  bar.resize(card.width, 2);
  bar.fills = [bindPaint(accentVar, accentRgb)];
  bar.strokes = [];
  placeOverlayChild(card, bar, 0, card.height - 2, null);
}

function applyPrimaryShadows(btn) {
  var effects = btn.effects ? btn.effects.slice() : [];
  var filtered = [];
  var j;
  for (j = 0; j < effects.length; j++) {
    if (effects[j].type === 'BACKGROUND_BLUR') {
      filtered.push(effects[j]);
    }
  }
  btn.effects = [
    {
      type: 'INNER_SHADOW',
      color: { r: 1, g: 1, b: 1, a: 0.35 },
      offset: { x: 0, y: 1 },
      radius: 0,
      spread: 0,
      visible: true,
      blendMode: 'NORMAL',
    },
    {
      type: 'INNER_SHADOW',
      color: { r: 0, g: 0, b: 0, a: 0.18 },
      offset: { x: 0, y: -2 },
      radius: 4,
      spread: 0,
      visible: true,
      blendMode: 'NORMAL',
    },
    {
      type: 'DROP_SHADOW',
      color: { r: 0.008, g: 0.024, b: 0.09, a: 0.72 },
      offset: { x: 0, y: 3 },
      radius: 0,
      spread: 0,
      visible: true,
      blendMode: 'NORMAL',
    },
    {
      type: 'DROP_SHADOW',
      color: { r: 0.831, g: 0.686, b: 0.216, a: 0.28 },
      offset: { x: 0, y: 6 },
      radius: 20,
      spread: -4,
      visible: true,
      blendMode: 'NORMAL',
    },
    {
      type: 'DROP_SHADOW',
      color: { r: 0, g: 0, b: 0, a: 0.42 },
      offset: { x: 0, y: 10 },
      radius: 28,
      spread: -8,
      visible: true,
      blendMode: 'NORMAL',
    },
  ].concat(filtered);
}

function buildBentoVariant(glowKey, glowDef, accentVar, mutedVar, textVar, surface2Var, borderVar) {
  var comp = figma.createComponent();
  comp.name = 'Glow=' + glowKey;
  comp.resize(280, 168);
  comp.layoutMode = 'VERTICAL';
  comp.primaryAxisSizingMode = 'AUTO';
  comp.counterAxisSizingMode = 'FIXED';
  comp.paddingTop = 20;
  comp.paddingBottom = 20;
  comp.paddingLeft = 20;
  comp.paddingRight = 20;
  comp.itemSpacing = 10;
  applyGlassCardChrome(comp, surface2Var, borderVar);

  var headerRow = figma.createFrame();
  headerRow.name = 'Header';
  headerRow.layoutMode = 'HORIZONTAL';
  headerRow.primaryAxisSizingMode = 'AUTO';
  headerRow.counterAxisSizingMode = 'AUTO';
  headerRow.itemSpacing = 10;
  headerRow.fills = [];
  headerRow.strokes = [];

  var iconBox = figma.createFrame();
  iconBox.name = 'Icon';
  iconBox.resize(32, 32);
  iconBox.cornerRadius = 8;
  iconBox.fills = [bindPaint(accentVar, { r: 0.831, g: 0.686, b: 0.216 }, 0.12)];
  iconBox.strokes = [bindPaint(accentVar, { r: 0.831, g: 0.686, b: 0.216 })];
  iconBox.strokeWeight = 1;
  headerRow.appendChild(iconBox);

  var title = figma.createText();
  title.name = 'Title';
  title.characters = 'Modultitel';
  title.fontName = { family: 'Inter', style: 'Medium' };
  title.fontSize = 14;
  title.fills = [bindPaint(accentVar, { r: 0.831, g: 0.686, b: 0.216 })];
  headerRow.appendChild(title);

  var desc = figma.createText();
  desc.name = 'Description';
  desc.characters = 'Kort beskrivning — calm-card · bento-card';
  desc.fontName = { family: 'Inter', style: 'Regular' };
  desc.fontSize = 13;
  desc.fills = [bindPaint(mutedVar, { r: 0.58, g: 0.64, b: 0.72 })];
  desc.textAutoResize = 'HEIGHT';

  var slot = figma.createFrame();
  slot.name = 'Slot';
  slot.resize(240, 40);
  slot.cornerRadius = 12;
  slot.fills = [bindPaint(surface2Var, { r: 0.133, g: 0.133, b: 0.133 })];
  slot.strokes = [bindPaint(borderVar, { r: 0.83, g: 0.69, b: 0.22 })];
  slot.strokeWeight = 1;

  comp.appendChild(headerRow);
  headerRow.layoutSizingHorizontal = 'FILL';
  comp.appendChild(desc);
  desc.layoutSizingHorizontal = 'FILL';
  desc.resize(240, desc.height);
  comp.appendChild(slot);
  slot.layoutSizingHorizontal = 'FILL';

  if (glowDef) {
    upsertGlowBottom(comp, glowDef.r, glowDef.g, glowDef.b, glowDef.a);
    upsertBottomAccentBar(comp, accentVar, { r: glowDef.br, g: glowDef.bg, b: glowDef.bb });
  }

  return comp;
}

function createHubHeader(accentVar, mutedVar, textVar, borderVar) {
  var comp = figma.createComponent();
  comp.name = 'Hub/Header';
  comp.layoutMode = 'VERTICAL';
  comp.primaryAxisSizingMode = 'AUTO';
  comp.counterAxisSizingMode = 'FIXED';
  comp.resize(360, 110);
  comp.paddingTop = 14;
  comp.paddingBottom = 14;
  comp.paddingLeft = 16;
  comp.paddingRight = 16;
  comp.itemSpacing = 6;
  comp.cornerRadius = 20;
  comp.fills = [{
    type: 'GRADIENT_LINEAR',
    gradientTransform: [[0.707, 0.707, 0], [-0.707, 0.707, 0.5]],
    gradientStops: [
      { color: { r: 0.078, g: 0.11, b: 0.169, a: 0.72 }, position: 0 },
      { color: { r: 0.02, g: 0.043, b: 0.078, a: 0.58 }, position: 0.55 },
      { color: { r: 0.008, g: 0.024, b: 0.09, a: 0.82 }, position: 1 },
    ],
  }];
  comp.strokes = [bindPaint(borderVar, { r: 0.83, g: 0.69, b: 0.22 })];
  comp.strokeWeight = 1;
  comp.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.65 },
    offset: { x: 0, y: 8 },
    radius: 24,
    spread: -8,
    visible: true,
    blendMode: 'NORMAL',
  }];

  var eyebrow = figma.createText();
  eyebrow.name = 'Eyebrow';
  eyebrow.characters = 'VARDAGEN';
  eyebrow.fontName = { family: 'Inter', style: 'Medium' };
  eyebrow.fontSize = 10;
  eyebrow.letterSpacing = { unit: 'PERCENT', value: 20 };
  eyebrow.textCase = 'UPPER';
  eyebrow.fills = [bindPaint(mutedVar, { r: 0.58, g: 0.64, b: 0.72 })];

  var title = figma.createText();
  title.name = 'Title';
  title.characters = 'Planering';
  title.fontName = { family: 'Inter', style: 'Medium' };
  title.fontSize = 22;
  title.fills = [bindPaint(textVar, { r: 0.973, g: 0.98, b: 0.988 })];

  var lead = figma.createText();
  lead.name = 'Lead';
  lead.characters = 'Ett steg i taget. Lågaffektiv hub.';
  lead.fontName = { family: 'Inter', style: 'Regular' };
  lead.fontSize = 13;
  lead.fills = [bindPaint(mutedVar, { r: 0.58, g: 0.64, b: 0.72 })];
  lead.textAutoResize = 'HEIGHT';

  comp.appendChild(eyebrow);
  comp.appendChild(title);
  comp.appendChild(lead);
  lead.layoutSizingHorizontal = 'FILL';
  lead.resize(328, lead.height);
  return comp;
}

function createEmptyState(mutedVar) {
  var comp = figma.createComponent();
  comp.name = 'EmptyState';
  comp.layoutMode = 'VERTICAL';
  comp.primaryAxisSizingMode = 'AUTO';
  comp.counterAxisSizingMode = 'AUTO';
  comp.paddingTop = 8;
  comp.paddingBottom = 8;
  comp.itemSpacing = 12;
  comp.fills = [];

  var msg = figma.createText();
  msg.name = 'Message';
  msg.characters = 'Inga poster ännu.';
  msg.fontName = { family: 'Inter', style: 'Regular' };
  msg.fontSize = 14;
  msg.fills = [{ type: 'SOLID', color: { r: 0.392, g: 0.455, b: 0.533 } }];
  msg.textAutoResize = 'HEIGHT';

  comp.appendChild(msg);
  msg.layoutSizingHorizontal = 'FILL';
  msg.resize(280, msg.height);
  return comp;
}

function createHubPanelSkeleton(mutedVar, borderVar, surface2Var) {
  var comp = figma.createComponent();
  comp.name = 'HubPanelSkeleton';
  comp.layoutMode = 'VERTICAL';
  comp.primaryAxisSizingMode = 'AUTO';
  comp.counterAxisSizingMode = 'FIXED';
  comp.resize(320, 140);
  comp.paddingTop = 16;
  comp.paddingBottom = 16;
  comp.itemSpacing = 12;
  comp.fills = [];

  var label = figma.createText();
  label.name = 'Label';
  label.characters = 'Laddar…';
  label.fontName = { family: 'Inter', style: 'Regular' };
  label.fontSize = 12;
  label.fills = [{ type: 'SOLID', color: { r: 0.392, g: 0.455, b: 0.533 } }];
  comp.appendChild(label);

  var li;
  for (li = 0; li < 3; li++) {
    var line = figma.createFrame();
    line.name = 'Line' + (li + 1);
    line.resize(288, 40);
    line.cornerRadius = 12;
    line.fills = [bindPaint(surface2Var, { r: 0.133, g: 0.133, b: 0.133 }, 0.4)];
    line.strokes = [bindPaint(borderVar, { r: 0.83, g: 0.69, b: 0.22 })];
    line.strokeWeight = 1;
    comp.appendChild(line);
    line.layoutSizingHorizontal = 'FILL';
  }

  return comp;
}

function findSetVariant(set, prefix, value) {
  var target = prefix + '=' + value;
  var ch = set.children;
  var ci;
  for (ci = 0; ci < ch.length; ci++) {
    if (ch[ci].name === target) return ch[ci];
  }
  return null;
}

function createWandIconPlaceholder(accentVar, mutedVar, useAccent) {
  var icon = figma.createFrame();
  icon.name = 'Icon';
  icon.resize(16, 16);
  icon.fills = [];
  icon.strokes = [];
  var stick = figma.createRectangle();
  stick.name = 'WandStick';
  stick.resize(2, 12);
  stick.rotation = -45;
  stick.cornerRadius = 1;
  stick.fills = [bindPaint(useAccent ? accentVar : mutedVar, useAccent ? { r: 0.831, g: 0.686, b: 0.216 } : { r: 0.58, g: 0.64, b: 0.72 })];
  stick.strokes = [];
  icon.appendChild(stick);
  stick.x = 7;
  stick.y = 2;
  var star = figma.createStar();
  star.name = 'WandStar';
  star.pointCount = 4;
  star.innerRadius = 0.35;
  star.resize(6, 6);
  star.fills = [bindPaint(useAccent ? accentVar : mutedVar, useAccent ? { r: 0.831, g: 0.686, b: 0.216 } : { r: 0.58, g: 0.64, b: 0.72 })];
  star.strokes = [];
  icon.appendChild(star);
  star.x = 1;
  star.y = 1;
  return icon;
}

function createLoaderIconPlaceholder(accentVar) {
  var icon = figma.createEllipse();
  icon.name = 'Icon';
  icon.resize(16, 16);
  icon.fills = [];
  icon.strokes = [bindPaint(accentVar, { r: 0.831, g: 0.686, b: 0.216 })];
  icon.strokeWeight = 2;
  icon.arcData = { startingAngle: 0.5, endingAngle: 5.5, innerRadius: 0.6 };
  return icon;
}

function createDockNavButton(state, labelText, accentVar, mutedVar, textVar, borderVar, surface2Var) {
  var isActive = state === 'Active';
  var comp = figma.createComponent();
  comp.name = 'State=' + state;
  comp.layoutMode = 'VERTICAL';
  comp.primaryAxisSizingMode = 'AUTO';
  comp.counterAxisSizingMode = 'AUTO';
  comp.itemSpacing = 3;
  comp.paddingTop = 0;
  comp.paddingBottom = 2;
  comp.counterAxisAlignItems = 'CENTER';
  comp.fills = [];
  comp.strokes = [];

  var iconShell = figma.createFrame();
  iconShell.name = 'IconShell';
  iconShell.resize(50, 50);
  iconShell.cornerRadius = 999;
  iconShell.layoutMode = 'HORIZONTAL';
  iconShell.primaryAxisSizingMode = 'FIXED';
  iconShell.counterAxisSizingMode = 'FIXED';
  iconShell.counterAxisAlignItems = 'CENTER';
  iconShell.primaryAxisAlignItems = 'CENTER';
  if (isActive) {
    iconShell.fills = [bindPaint(accentVar, { r: 0.831, g: 0.686, b: 0.216 }, 0.11)];
    iconShell.strokes = [bindPaint(accentVar, { r: 0.831, g: 0.686, b: 0.216 }, 0.58)];
    iconShell.effects = [{
      type: 'DROP_SHADOW',
      color: { r: 0.831, g: 0.686, b: 0.216, a: 0.2 },
      offset: { x: 0, y: 0 },
      radius: 16,
      spread: 0,
      visible: true,
      blendMode: 'NORMAL',
    }];
  } else {
    iconShell.fills = [{
      type: 'GRADIENT_LINEAR',
      gradientTransform: [[0.966, 0.259, 0], [-0.259, 0.966, 0.5]],
      gradientStops: [
        { color: { r: 0.078, g: 0.11, b: 0.169, a: 1 }, position: 0 },
        { color: { r: 0.035, g: 0.067, b: 0.118, a: 1 }, position: 0.48 },
        { color: { r: 0.02, g: 0.043, b: 0.078, a: 1 }, position: 1 },
      ],
    }];
    iconShell.strokes = [bindPaint(accentVar, { r: 0.831, g: 0.686, b: 0.216 }, 0.4)];
  }
  iconShell.strokeWeight = 1.5;

  var icon = figma.createFrame();
  icon.name = 'Icon';
  icon.resize(26, 26);
  icon.cornerRadius = 6;
  icon.fills = [bindPaint(isActive ? accentVar : mutedVar, isActive ? { r: 0.831, g: 0.686, b: 0.216 } : { r: 0.58, g: 0.64, b: 0.72 }, isActive ? 0.25 : 0.35)];
  icon.strokes = [];
  iconShell.appendChild(icon);

  var label = figma.createText();
  label.name = 'Label';
  label.characters = labelText;
  label.fontName = { family: 'Inter', style: 'Medium' };
  label.fontSize = 9;
  label.letterSpacing = { unit: 'PERCENT', value: 8 };
  label.textCase = 'UPPER';
  label.fills = [bindPaint(isActive ? accentVar : mutedVar, isActive ? { r: 0.831, g: 0.686, b: 0.216 } : { r: 0.58, g: 0.64, b: 0.72 })];

  comp.appendChild(iconShell);
  comp.appendChild(label);
  return comp;
}

function createFyrenCenter(accentVar, borderVar, surface2Var) {
  var center = figma.createFrame();
  center.name = 'Center/Fyren';
  center.resize(88, 88);
  center.fills = [];
  center.strokes = [];
  center.clipsContent = false;

  var glow = figma.createEllipse();
  glow.name = 'CenterGlow';
  glow.resize(96, 96);
  glow.fills = [{
    type: 'GRADIENT_RADIAL',
    gradientTransform: [[1, 0, 0.5], [0, 1, 0.5]],
    gradientStops: [
      { color: { r: 0.831, g: 0.686, b: 0.216, a: 0.32 }, position: 0 },
      { color: { r: 0.831, g: 0.686, b: 0.216, a: 0.12 }, position: 0.42 },
      { color: { r: 0.831, g: 0.686, b: 0.216, a: 0 }, position: 0.72 },
    ],
  }];
  glow.strokes = [];
  placeOverlayChild(center, glow, -4, -4, null);

  var plate = figma.createFrame();
  plate.name = 'Plate';
  plate.resize(88, 88);
  plate.cornerRadius = 999;
  plate.layoutMode = 'HORIZONTAL';
  plate.primaryAxisSizingMode = 'FIXED';
  plate.counterAxisSizingMode = 'FIXED';
  plate.counterAxisAlignItems = 'CENTER';
  plate.primaryAxisAlignItems = 'CENTER';
  plate.fills = [{
    type: 'GRADIENT_LINEAR',
    gradientTransform: [[0, 1, 0], [-1, 0, 1]],
    gradientStops: [
      { color: { r: 0.078, g: 0.11, b: 0.169, a: 1 }, position: 0 },
      { color: { r: 0.035, g: 0.067, b: 0.118, a: 1 }, position: 0.55 },
      { color: { r: 0.02, g: 0.043, b: 0.078, a: 1 }, position: 1 },
    ],
  }];
  plate.strokes = [bindPaint(accentVar, { r: 0.831, g: 0.686, b: 0.216 }, 0.68)];
  plate.strokeWeight = 2.5;
  plate.effects = [
    {
      type: 'INNER_SHADOW',
      color: { r: 1, g: 0.953, b: 0.824, a: 0.16 },
      offset: { x: 0, y: 1 },
      radius: 0,
      spread: 0,
      visible: true,
      blendMode: 'NORMAL',
    },
    {
      type: 'DROP_SHADOW',
      color: { r: 0, g: 0, b: 0, a: 0.5 },
      offset: { x: 0, y: 8 },
      radius: 22,
      spread: 0,
      visible: true,
      blendMode: 'NORMAL',
    },
    {
      type: 'DROP_SHADOW',
      color: { r: 0.831, g: 0.686, b: 0.216, a: 0.2 },
      offset: { x: 0, y: 0 },
      radius: 20,
      spread: 0,
      visible: true,
      blendMode: 'NORMAL',
    },
  ];

  var progressRing = figma.createEllipse();
  progressRing.name = 'ProgressRing';
  progressRing.resize(82, 82);
  progressRing.fills = [];
  progressRing.strokes = [bindPaint(accentVar, { r: 0.831, g: 0.686, b: 0.216 }, 0.75)];
  progressRing.strokeWeight = 2.5;
  progressRing.arcData = { startingAngle: 0.3, endingAngle: 4.8, innerRadius: 0.88 };
  placeOverlayChild(plate, progressRing, 3, 3, null);

  var mark = figma.createPolygon();
  mark.name = 'MarkPlaceholder';
  mark.pointCount = 4;
  mark.resize(38, 38);
  mark.rotation = 45;
  mark.fills = [bindPaint(accentVar, { r: 0.831, g: 0.686, b: 0.216 }, 0.85)];
  mark.strokes = [bindPaint(accentVar, { r: 0.831, g: 0.686, b: 0.216 })];
  mark.strokeWeight = 1;
  mark.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0.831, g: 0.686, b: 0.216, a: 0.32 },
    offset: { x: 0, y: 0 },
    radius: 10,
    spread: 0,
    visible: true,
    blendMode: 'NORMAL',
  }];
  plate.appendChild(mark);

  placeOverlayChild(center, plate, 0, 0, null);
  return center;
}

function createDockShell(dockNavSet, accentVar, mutedVar, textVar, borderVar, surface2Var, bgVar) {
  var comp = figma.createComponent();
  comp.name = 'Dock/Shell';
  comp.resize(416, 100);
  comp.layoutMode = 'VERTICAL';
  comp.primaryAxisSizingMode = 'AUTO';
  comp.counterAxisSizingMode = 'FIXED';
  comp.counterAxisAlignItems = 'CENTER';
  comp.paddingTop = 0;
  comp.paddingBottom = 0;
  comp.fills = [];
  comp.strokes = [];

  var rail = figma.createFrame();
  rail.name = 'Rail';
  rail.resize(416, 78);
  rail.layoutMode = 'HORIZONTAL';
  rail.primaryAxisSizingMode = 'FIXED';
  rail.counterAxisSizingMode = 'FIXED';
  rail.counterAxisAlignItems = 'MAX';
  rail.primaryAxisAlignItems = 'CENTER';
  rail.paddingTop = 7;
  rail.paddingBottom = 5;
  rail.paddingLeft = 8;
  rail.paddingRight = 8;
  rail.itemSpacing = 4;
  rail.cornerRadius = 22;
  rail.clipsContent = false;
  rail.fills = [{
    type: 'GRADIENT_LINEAR',
    gradientTransform: [[0.966, 0.259, 0], [-0.259, 0.966, 0.5]],
    gradientStops: [
      { color: { r: 0.078, g: 0.11, b: 0.169, a: 0.95 }, position: 0 },
      { color: { r: 0.035, g: 0.067, b: 0.118, a: 0.92 }, position: 0.42 },
      { color: { r: 0.02, g: 0.043, b: 0.078, a: 0.95 }, position: 1 },
    ],
  }];
  rail.strokes = [bindPaint(borderVar, { r: 0.831, g: 0.686, b: 0.216 }, 0.42)];
  rail.strokeWeight = 2;
  rail.effects = [
    {
      type: 'DROP_SHADOW',
      color: { r: 0, g: 0, b: 0, a: 0.58 },
      offset: { x: 0, y: 14 },
      radius: 42,
      spread: 0,
      visible: true,
      blendMode: 'NORMAL',
    },
    {
      type: 'INNER_SHADOW',
      color: { r: 1, g: 0.953, b: 0.824, a: 0.12 },
      offset: { x: 0, y: 2 },
      radius: 0,
      spread: 0,
      visible: true,
      blendMode: 'NORMAL',
    },
    {
      type: 'BACKGROUND_BLUR',
      radius: 24,
      visible: true,
    },
  ];
  upsertTopHighlight(rail);

  var sideLeft = createLayoutFrame('HORIZONTAL', {
    name: 'SideLeft',
    itemSpacing: 4,
    counterAxisAlignItems: 'MAX',
  });
  sideLeft.fills = [];
  sideLeft.strokes = [];
  sideLeft.layoutGrow = 1;

  var sideRight = createLayoutFrame('HORIZONTAL', {
    name: 'SideRight',
    itemSpacing: 4,
    counterAxisAlignItems: 'MAX',
  });
  sideRight.fills = [];
  sideRight.strokes = [];
  sideRight.layoutGrow = 1;
  sideRight.primaryAxisAlignItems = 'MAX';

  var centerSpacer = figma.createFrame();
  centerSpacer.name = 'CenterSpacer';
  centerSpacer.resize(88, 62);
  centerSpacer.fills = [];
  centerSpacer.strokes = [];

  var idleVar = findSetVariant(dockNavSet, 'State', 'Idle');
  var activeVar = findSetVariant(dockNavSet, 'State', 'Active');
  var labels = ['Vardag', 'Familj', 'Hjärtat', 'Handling'];
  var states = ['Idle', 'Idle', 'Active', 'Idle'];
  var groups = [sideLeft, sideLeft, sideRight, sideRight];
  var li;
  for (li = 0; li < 4; li++) {
    var src = states[li] === 'Active' ? activeVar : idleVar;
    if (!src) continue;
    var inst = src.createInstance();
    inst.name = 'Nav' + (li + 1);
    groups[li].appendChild(inst);
  }

  rail.appendChild(sideLeft);
  sideLeft.layoutSizingHorizontal = 'FILL';
  rail.appendChild(centerSpacer);
  rail.appendChild(sideRight);
  sideRight.layoutSizingHorizontal = 'FILL';

  var fyren = createFyrenCenter(accentVar, borderVar, surface2Var);
  placeOverlayChild(rail, fyren, 164, -14, null);

  comp.appendChild(rail);
  rail.layoutSizingHorizontal = 'FILL';
  return comp;
}

function createBiffVariant(state, accentVar, mutedVar, surface2Var, borderVar) {
  var isLoading = state === 'Loading';
  var isDisabled = state === 'Disabled';
  var comp = figma.createComponent();
  comp.name = 'State=' + state;
  comp.layoutMode = 'HORIZONTAL';
  comp.primaryAxisSizingMode = 'AUTO';
  comp.counterAxisSizingMode = 'AUTO';
  comp.counterAxisAlignItems = 'CENTER';
  comp.itemSpacing = 6;
  comp.paddingTop = 8;
  comp.paddingBottom = 8;
  comp.paddingLeft = 10;
  comp.paddingRight = 10;
  comp.cornerRadius = 999;
  if (isLoading) {
    comp.fills = [bindPaint(accentVar, { r: 0.831, g: 0.686, b: 0.216 }, 0.15)];
  } else {
    comp.fills = [bindPaint(surface2Var, { r: 0.035, g: 0.067, b: 0.118 }, 0.5)];
  }
  comp.strokes = [];
  if (isDisabled) {
    comp.opacity = 0.45;
  }

  var iconNode;
  if (isLoading) {
    iconNode = createLoaderIconPlaceholder(accentVar);
  } else {
    iconNode = createWandIconPlaceholder(accentVar, mutedVar, false);
  }
  comp.appendChild(iconNode);

  var label = figma.createText();
  label.name = 'Label';
  label.characters = 'BIFF';
  label.fontName = { family: 'Inter', style: 'Medium' };
  label.fontSize = 12;
  label.fills = [bindPaint(isLoading ? accentVar : mutedVar, isLoading ? { r: 0.831, g: 0.686, b: 0.216 } : { r: 0.58, g: 0.64, b: 0.72 })];
  comp.appendChild(label);

  return comp;
}

function createStatusBadgeVariant(variantKey, labelText, accentVar, mutedVar, borderVar, surface2Var, successVar, accentSecondaryVar) {
  var comp = figma.createComponent();
  comp.name = 'Variant=' + variantKey;
  comp.layoutMode = 'HORIZONTAL';
  comp.primaryAxisSizingMode = 'AUTO';
  comp.counterAxisSizingMode = 'AUTO';
  comp.paddingTop = 6;
  comp.paddingBottom = 6;
  comp.paddingLeft = 12;
  comp.paddingRight = 12;
  comp.cornerRadius = 999;

  if (variantKey === 'worm') {
    comp.fills = [bindPaint(successVar, { r: 0.063, g: 0.725, b: 0.506 }, 0.15)];
    comp.strokes = [bindPaint(successVar, { r: 0.063, g: 0.725, b: 0.506 }, 0.45)];
  } else if (variantKey === 'locked') {
    comp.fills = [bindPaint(surface2Var, { r: 0.035, g: 0.067, b: 0.118 }, 0.6)];
    comp.strokes = [bindPaint(borderVar, { r: 0.831, g: 0.686, b: 0.216 }, 0.35)];
  } else if (variantKey === 'risk') {
    comp.fills = [{ type: 'SOLID', color: { r: 0.937, g: 0.267, b: 0.267 }, opacity: 0.12 }];
    comp.strokes = [{ type: 'SOLID', color: { r: 0.937, g: 0.267, b: 0.267 }, opacity: 0.45 }];
  } else {
    comp.fills = [bindPaint(accentSecondaryVar, { r: 0.388, g: 0.4, b: 0.945 }, 0.15)];
    comp.strokes = [bindPaint(accentSecondaryVar, { r: 0.388, g: 0.4, b: 0.945 }, 0.45)];
  }
  comp.strokeWeight = 1;

  var label = figma.createText();
  label.name = 'Label';
  label.characters = labelText;
  label.fontName = { family: 'Inter', style: 'Medium' };
  label.fontSize = 10;
  label.letterSpacing = { unit: 'PERCENT', value: 10 };
  label.textCase = 'UPPER';
  if (variantKey === 'worm') {
    label.fills = [bindPaint(successVar, { r: 0.063, g: 0.725, b: 0.506 })];
  } else if (variantKey === 'locked') {
    label.fills = [bindPaint(mutedVar, { r: 0.58, g: 0.64, b: 0.72 })];
  } else if (variantKey === 'risk') {
    label.fills = [{ type: 'SOLID', color: { r: 0.973, g: 0.443, b: 0.443 } }];
  } else {
    label.fills = [bindPaint(accentSecondaryVar, { r: 0.506, g: 0.549, b: 0.973 })];
  }
  comp.appendChild(label);
  return comp;
}

function collectCodeConnectNodes(page) {
  var out = {};
  var bento = page.findOne(function (n) {
    return n.name === 'BentoCard' && n.type === 'COMPONENT_SET';
  });
  if (bento) out.BentoCard = bento.id;

  var singleNames = ['Hub/Header', 'EmptyState', 'HubPanelSkeleton', 'Dock/Shell'];
  var ni;
  for (ni = 0; ni < singleNames.length; ni++) {
    var nm = singleNames[ni];
    var node = page.findOne(function (n) {
      return n.name === nm && n.type === 'COMPONENT';
    });
    if (node) out[nm] = node.id;
  }

  var setNames = ['DockNavButton', 'Button/BIFF', 'StatusBadge'];
  for (ni = 0; ni < setNames.length; ni++) {
    var setNm = setNames[ni];
    var setNode = page.findOne(function (n) {
      return n.name === setNm && n.type === 'COMPONENT_SET';
    });
    if (setNode) out[setNm] = setNode.id;
  }
  return out;
}

function run() {
  var lines = [];

  var PAGE_NAME = '00 — Tokens & Components';
  var page = null;
  var i;
  for (i = 0; i < figma.root.children.length; i++) {
    if (figma.root.children[i].name === PAGE_NAME) {
      page = figma.root.children[i];
      break;
    }
  }
  if (!page) {
    throw new Error('Sidan "' + PAGE_NAME + '" saknas.');
  }

  return figma.setCurrentPageAsync(page).then(function () {
    return figma.variables.getLocalVariableCollectionsAsync();
  }).then(function (collections) {
    var collection = null;
    for (i = 0; i < collections.length; i++) {
      if (collections[i].name === 'Obsidian Calm / I-stone') {
        collection = collections[i];
        break;
      }
    }
    if (!collection) throw new Error('Collection "Obsidian Calm / I-stone" saknas.');
    return figma.variables.getLocalVariablesAsync().then(function (allVars) {
      return { collection: collection, allVars: allVars, page: page };
    });
  }).then(function (ctx) {
    var collection = ctx.collection;
    var allVars = ctx.allVars;
    var page = ctx.page;
    var modeId = collection.modes[0].modeId;

    function getVar(name) {
      for (var j = 0; j < allVars.length; j++) {
        if (allVars[j].name === name && allVars[j].variableCollectionId === collection.id) {
          return allVars[j];
        }
      }
      return null;
    }

    var accentVar = getVar('color/accent');
    var mutedVar = getVar('color/text-muted');
    var surface2Var = getVar('color/surface-2');
    var bgVar = getVar('color/bg');
    var borderVar = getVar('color/border');
    var textVar = getVar('color/text');
    var successVar = getVar('color/success');
    var accentSecondaryVar = getVar('color/accent-secondary');

    return figma.loadFontAsync({ family: 'Inter', style: 'Medium' }).then(function () {
      return figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
    }).then(function () {
      return figma.loadFontAsync({ family: 'Outfit', style: 'Medium' }).catch(function () {
        return null;
      });
    }).then(function () {
      // ===== A1 (idempotent) =====

      var pillSet = page.findOne(function (n) {
        return n.name === 'Pill' && n.type === 'COMPONENT_SET';
      });
      if (!pillSet) {
        var activePill = page.findOne(function (n) {
          return n.name === 'State=Active' && n.type === 'COMPONENT';
        });
        var existingPill = page.findOne(function (n) {
          return n.name === 'Pill' && n.type === 'COMPONENT';
        });
        if (existingPill && !activePill) {
          existingPill.name = 'State=Active';
          activePill = existingPill;
        }
        if (activePill) {
          var idle = figma.createComponent();
          idle.name = 'State=Idle';
          idle.layoutMode = 'HORIZONTAL';
          idle.primaryAxisSizingMode = 'AUTO';
          idle.counterAxisSizingMode = 'AUTO';
          idle.paddingTop = 8;
          idle.paddingBottom = 8;
          idle.paddingLeft = 16;
          idle.paddingRight = 16;
          idle.cornerRadius = 999;
          idle.fills = [bindPaint(surface2Var, { r: 0.1, g: 0.1, b: 0.1 })];
          idle.strokes = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0.1 }];
          idle.strokeWeight = 1;
          var idleLabel = figma.createText();
          idleLabel.name = 'Label';
          idleLabel.characters = 'Idle';
          idleLabel.fontName = { family: 'Inter', style: 'Medium' };
          idleLabel.fontSize = 12;
          idleLabel.letterSpacing = { unit: 'PERCENT', value: 8 };
          idleLabel.textCase = 'UPPER';
          idleLabel.fills = [bindPaint(mutedVar, { r: 0.58, g: 0.64, b: 0.72 })];
          idle.appendChild(idleLabel);
          activePill.name = 'State=Active';
          page.appendChild(idle);
          pillSet = figma.combineAsVariants([idle, activePill], page);
          pillSet.name = 'Pill';
          pillSet.x = 580;
          pillSet.y = 220;
          pillSet.layoutMode = 'HORIZONTAL';
          pillSet.itemSpacing = 16;
          lines.push('A1 Pill: Idle + Active');
        }
      }

      var specimen = page.findOne(function (n) {
        return n.name === 'Typography Specimens';
      });
      if (!page.findOne(function (n) { return n.name === 'Color Swatches'; })) {
        var swatches = createLayoutFrame('VERTICAL', {
          name: 'Color Swatches',
          itemSpacing: 10,
          paddingTop: 20,
          paddingBottom: 20,
          paddingLeft: 24,
          paddingRight: 24,
        });
        swatches.fills = [bindPaint(bgVar, { r: 0.04, g: 0.04, b: 0.04 })];
        swatches.strokes = [bindPaint(borderVar, { r: 0.83, g: 0.69, b: 0.22 })];
        swatches.strokeWeight = 1;
        swatches.cornerRadius = 16;
        var tokens = [
          ['color/bg', 'var(--bg)'],
          ['color/surface', 'var(--surface)'],
          ['color/surface-2', 'var(--surface-2)'],
          ['color/accent', 'var(--accent)'],
          ['color/success', 'var(--success)'],
          ['color/glass', 'var(--glass)'],
          ['color/border', 'var(--border)'],
        ];
        for (i = 0; i < tokens.length; i++) {
          var tokenName = tokens[i][0];
          var cssLabel = tokens[i][1];
          var v = getVar(tokenName);
          if (!v) continue;
          var row = createLayoutFrame('HORIZONTAL', {
            name: tokenName,
            itemSpacing: 12,
            counterAxisAlignItems: 'CENTER',
          });
          swatches.appendChild(row);
          row.layoutSizingHorizontal = 'FILL';
          var chip = figma.createFrame();
          chip.name = 'Swatch';
          chip.resize(36, 36);
          chip.cornerRadius = 8;
          if (tokenName === 'color/border') {
            chip.fills = [bindPaint(bgVar, { r: 0.04, g: 0.04, b: 0.04 })];
            chip.strokes = [bindPaint(v, resolveRgb(v, modeId, { r: 0.83, g: 0.69, b: 0.22 }))];
            chip.strokeWeight = 2;
          } else {
            chip.fills = [bindPaint(v, resolveRgb(v, modeId, { r: 0.2, g: 0.2, b: 0.2 }))];
          }
          row.appendChild(chip);
          var lbl = figma.createText();
          lbl.characters = cssLabel;
          lbl.fontSize = 11;
          lbl.fontName = { family: 'Inter', style: 'Regular' };
          lbl.fills = [bindPaint(mutedVar, { r: 0.58, g: 0.64, b: 0.72 })];
          row.appendChild(lbl);
          lbl.layoutSizingHorizontal = 'FILL';
          lbl.textAutoResize = 'HEIGHT';
          lbl.resize(400, lbl.height);
        }
        swatches.x = specimen ? specimen.x : 0;
        swatches.y = specimen ? specimen.y + specimen.height + 24 : 280;
        page.appendChild(swatches);
        lines.push('A1 Color Swatches');
      }

      var primaryBtn = page.findOne(function (n) {
        return n.name === 'Button/Primary' && n.type === 'COMPONENT';
      });
      if (primaryBtn && accentVar) {
        var accentVal = resolveRgb(accentVar, modeId, { r: 0.83, g: 0.69, b: 0.22 });
        primaryBtn.fills = [{
          type: 'GRADIENT_LINEAR',
          gradientTransform: [[0, 1, 0], [-1, 0, 1]],
          gradientStops: [
            { color: { r: 0.91, g: 0.79, b: 0.42, a: 1 }, position: 0 },
            { color: { r: accentVal.r, g: accentVal.g, b: accentVal.b, a: 1 }, position: 0.48 },
            { color: { r: accentVal.r * 0.78, g: accentVal.g * 0.78, b: accentVal.b * 0.78, a: 1 }, position: 1 },
          ],
        }];
        primaryBtn.strokes = [bindPaint(accentVar, accentVal)];
        primaryBtn.strokeWeight = 1;
      }

      // ===== A2 =====

      var glassCard = page.findOne(function (n) {
        return n.name === 'Glass Card' && n.type === 'COMPONENT';
      });
      if (glassCard) {
        applyGlassCardChrome(glassCard, surface2Var, borderVar);
        lines.push('A2 Glass Card: TopHighlight + calm-card shadow');
      } else {
        lines.push('A2 Glass Card: hittades inte');
      }

      var glowGoldCard = page.findOne(function (n) {
        return n.name === 'Glass Card/Glow Gold' && n.type === 'COMPONENT';
      });
      if (!glowGoldCard && glassCard) {
        glowGoldCard = glassCard.clone();
        glowGoldCard.name = 'Glass Card/Glow Gold';
        glowGoldCard.x = glassCard.x;
        glowGoldCard.y = glassCard.y + glassCard.height + 32;
        applyGlassCardChrome(glowGoldCard, surface2Var, borderVar);
        upsertGlowBottom(glowGoldCard, 0.831, 0.686, 0.216, 0.14);
        upsertBottomAccentBar(glowGoldCard, accentVar, { r: 0.831, g: 0.686, b: 0.216 });
        page.appendChild(glowGoldCard);
        lines.push('A2 Glass Card/Glow Gold: skapad');
      } else if (glowGoldCard) {
        applyGlassCardChrome(glowGoldCard, surface2Var, borderVar);
        upsertGlowBottom(glowGoldCard, 0.831, 0.686, 0.216, 0.14);
        lines.push('A2 Glass Card/Glow Gold: uppdaterad');
      }

      if (primaryBtn) {
        applyPrimaryShadows(primaryBtn);
        lines.push('A2 Button/Primary: inset + drop shadows');
      }

      var oldGlowPanel = page.findOne(function (n) {
        return n.name === 'Glow Specimens';
      });
      if (oldGlowPanel) oldGlowPanel.remove();

      var swatchPanel = page.findOne(function (n) {
        return n.name === 'Color Swatches';
      });
      var glowPanel = createLayoutFrame('VERTICAL', {
        name: 'Glow Specimens',
        itemSpacing: 12,
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 24,
        paddingRight: 24,
      });
      glowPanel.fills = [bindPaint(bgVar, { r: 0.04, g: 0.04, b: 0.04 })];
      glowPanel.strokes = [bindPaint(borderVar, { r: 0.83, g: 0.69, b: 0.22 })];
      glowPanel.strokeWeight = 1;
      glowPanel.cornerRadius = 16;

      var glowDefs = [
        { name: 'glow-bottom-gold', label: 'glow-bottom-gold', r: 0.831, g: 0.686, b: 0.216, a: 0.14, br: 0.831, bg: 0.686, bb: 0.216 },
        { name: 'glow-bottom-blue', label: 'glow-bottom-blue', r: 0.388, g: 0.4, b: 0.945, a: 0.12, br: 0.388, bg: 0.4, bb: 0.945 },
        { name: 'glow-bottom-green', label: 'glow-bottom-green', r: 0.063, g: 0.725, b: 0.506, a: 0.12, br: 0.063, bg: 0.725, bb: 0.506 },
      ];

      var rowGlow = createLayoutFrame('HORIZONTAL', {
        name: 'Glow row',
        itemSpacing: 16,
        counterAxisAlignItems: 'CENTER',
      });
      glowPanel.appendChild(rowGlow);

      for (i = 0; i < glowDefs.length; i++) {
        var gd = glowDefs[i];
        var mini = figma.createFrame();
        mini.name = gd.name;
        mini.resize(140, 88);
        mini.cornerRadius = 24;
        mini.clipsContent = true;
        mini.fills = [bindPaint(surface2Var, { r: 0.1, g: 0.1, b: 0.1 })];
        mini.strokes = [bindPaint(borderVar, { r: 0.83, g: 0.69, b: 0.22 })];
        mini.strokeWeight = 1;
        mini.effects = [{
          type: 'DROP_SHADOW',
          color: { r: 0, g: 0, b: 0, a: 0.5 },
          offset: { x: 0, y: 10 },
          radius: 30,
          spread: 0,
          visible: true,
          blendMode: 'NORMAL',
        }];
        upsertTopHighlight(mini);
        upsertGlowBottom(mini, gd.r, gd.g, gd.b, gd.a);
        upsertBottomAccentBar(mini, null, { r: gd.br, g: gd.bg, b: gd.bb });

        var cap = figma.createText();
        cap.characters = gd.label;
        cap.fontSize = 9;
        cap.fontName = { family: 'Inter', style: 'Regular' };
        cap.fills = [bindPaint(mutedVar, { r: 0.58, g: 0.64, b: 0.72 })];
        rowGlow.appendChild(mini);
        placeOverlayChild(mini, cap, 12, 12, null);
      }

      glowPanel.x = swatchPanel ? swatchPanel.x : 0;
      glowPanel.y = swatchPanel ? swatchPanel.y + swatchPanel.height + 24 : 700;
      page.appendChild(glowPanel);
      lines.push('A2 Glow Specimens: gold / blue / green');

      // ===== A3 — L1 components =====
      var a3x = 920;
      var a3y = 0;

      if (!page.findOne(function (n) {
        return n.name === 'BentoCard' && n.type === 'COMPONENT_SET';
      })) {
        var bentoGlows = [
          { key: 'None', def: null },
          { key: 'Gold', def: { r: 0.831, g: 0.686, b: 0.216, a: 0.14, br: 0.831, bg: 0.686, bb: 0.216 } },
          { key: 'Blue', def: { r: 0.388, g: 0.4, b: 0.945, a: 0.12, br: 0.388, bg: 0.4, bb: 0.945 } },
          { key: 'Green', def: { r: 0.063, g: 0.725, b: 0.506, a: 0.12, br: 0.063, bg: 0.725, bb: 0.506 } },
        ];
        var bentoParts = [];
        for (i = 0; i < bentoGlows.length; i++) {
          var bg = bentoGlows[i];
          var bentoComp = buildBentoVariant(
            bg.key,
            bg.def,
            accentVar,
            mutedVar,
            textVar,
            surface2Var,
            borderVar,
          );
          page.appendChild(bentoComp);
          bentoParts.push(bentoComp);
        }
        var bentoSet = figma.combineAsVariants(bentoParts, page);
        bentoSet.name = 'BentoCard';
        bentoSet.x = a3x;
        bentoSet.y = a3y;
        bentoSet.layoutMode = 'HORIZONTAL';
        bentoSet.itemSpacing = 16;
        lines.push('A3 BentoCard: Glow None/Gold/Blue/Green');
      } else {
        lines.push('A3 BentoCard: fanns redan');
      }

      if (!page.findOne(function (n) {
        return n.name === 'Hub/Header' && n.type === 'COMPONENT';
      })) {
        var hubHeader = createHubHeader(accentVar, mutedVar, textVar, borderVar);
        hubHeader.x = a3x;
        hubHeader.y = 200;
        page.appendChild(hubHeader);
        lines.push('A3 Hub/Header');
      }

      if (!page.findOne(function (n) {
        return n.name === 'EmptyState' && n.type === 'COMPONENT';
      })) {
        var empty = createEmptyState(mutedVar);
        empty.x = a3x;
        empty.y = 340;
        page.appendChild(empty);
        lines.push('A3 EmptyState');
      }

      if (!page.findOne(function (n) {
        return n.name === 'HubPanelSkeleton' && n.type === 'COMPONENT';
      })) {
        var skeleton = createHubPanelSkeleton(mutedVar, borderVar, surface2Var);
        skeleton.x = a3x;
        skeleton.y = 420;
        page.appendChild(skeleton);
        lines.push('A3 HubPanelSkeleton');
      }

      var codeConnect = collectCodeConnectNodes(page);
      var ccKeys = Object.keys(codeConnect);
      if (ccKeys.length > 0) {
        lines.push('');
        lines.push('--- Code Connect node IDs ---');
        lines.push(JSON.stringify(codeConnect, null, 2));
        lines.push('');
        lines.push('Kör i terminal:');
        lines.push('node scripts/figma/apply-code-connect-nodes.mjs \'' + JSON.stringify(codeConnect) + '\'');
      }

      figma.ui.postMessage({ type: 'done', text: lines.join('\n'), codeConnect: codeConnect });
    });
  });
}

run().catch(function (err) {
  figma.ui.postMessage({
    type: 'error',
    text: (err && err.message) ? err.message : String(err),
  });
});
