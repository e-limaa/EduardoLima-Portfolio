"use strict";

const fs = require("fs");
const path = require("path");
const PptxGenJS = require("pptxgenjs");
const {
  warnIfSlideHasOverlaps,
  warnIfSlideElementsOutOfBounds,
} = require("./pptxgenjs_helpers/layout");
const { safeOuterShadow } = require("./pptxgenjs_helpers/util");

const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, "analytics-data.json"), "utf8")
);

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "OpenAI Codex";
pptx.company = "OpenAI";
pptx.subject = "PostHog analytics summary";
pptx.title = "PostHog analytics - last 3 days";
pptx.lang = "pt-BR";
pptx.theme = {
  headFontFace: "Aptos Display",
  bodyFontFace: "Aptos",
  lang: "pt-BR",
};

const COLORS = {
  bg: "F6F1E8",
  ink: "132238",
  muted: "6E7B8B",
  panel: "FFFDFC",
  line: "DCCFBE",
  navy: "16324F",
  teal: "1E6F74",
  gold: "C78A2C",
  coral: "C65D4B",
  green: "557C55",
  blue: "4F6D8A",
  pale: "EFE4D3",
  white: "FFFFFF",
};

function addBackground(slide) {
  slide.background = { color: COLORS.bg };
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 7.5,
    line: { color: COLORS.bg, transparency: 100 },
    fill: { color: COLORS.bg },
  });
}

function addHeader(slide, eyebrow, title, subtitle) {
  slide.addText(eyebrow, {
    x: 0.7,
    y: 0.45,
    w: 4.5,
    h: 0.25,
    fontFace: "Aptos",
    fontSize: 10,
    bold: true,
    color: COLORS.teal,
    charSpace: 1.2,
    margin: 0,
  });
  slide.addText(title, {
    x: 0.7,
    y: 0.75,
    w: 8.2,
    h: 0.48,
    fontFace: "Aptos Display",
    fontSize: 24,
    bold: true,
    color: COLORS.ink,
    margin: 0,
  });
  slide.addText(subtitle, {
    x: 0.7,
    y: 1.42,
    w: 8.8,
    h: 0.24,
    fontFace: "Aptos",
    fontSize: 10.5,
    color: COLORS.muted,
    margin: 0,
  });
}

function addFooter(slide, pageNum) {
  slide.addText(
    `Fonte: ${data.project.source} | Projeto ${data.project.id} | Timezone ${data.project.timezone}`,
    {
      x: 0.7,
      y: 7.05,
      w: 8.8,
      h: 0.18,
      fontSize: 8,
      color: COLORS.muted,
      margin: 0,
    }
  );
  slide.addText(String(pageNum), {
    x: 12.0,
    y: 7.0,
    w: 0.5,
    h: 0.2,
    fontSize: 9,
    color: COLORS.muted,
    align: "right",
    margin: 0,
  });
}

function addPanel(slide, x, y, w, h, opts = {}) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.08,
    line: { color: opts.lineColor || COLORS.line, pt: 1 },
    fill: { color: opts.fillColor || COLORS.panel },
    shadow: safeOuterShadow("6F5B40", 0.08, 45, 1.5, 1),
  });
}

function addKpi(slide, x, y, w, h, label, value, note, accent) {
  addPanel(slide, x, y, w, h, { fillColor: COLORS.white });
  slide.addShape(pptx.ShapeType.rect, {
    x: x + 0.12,
    y: y + 0.12,
    w: 0.12,
    h: h - 0.24,
    line: { color: accent, transparency: 100 },
    fill: { color: accent },
  });
  slide.addText(label, {
    x: x + 0.35,
    y: y + 0.22,
    w: w - 0.5,
    h: 0.18,
    fontSize: 9,
    bold: true,
    color: COLORS.muted,
    margin: 0,
  });
  slide.addText(String(value), {
    x: x + 0.35,
    y: y + 0.5,
    w: w - 0.5,
    h: 0.4,
    fontFace: "Aptos Display",
    fontSize: 22,
    bold: true,
    color: COLORS.ink,
    margin: 0,
  });
  slide.addText(note, {
    x: x + 0.35,
    y: y + 0.98,
    w: w - 0.5,
    h: 0.22,
    fontSize: 8.5,
    color: COLORS.muted,
    margin: 0,
  });
}

function pct(value, total) {
  return total === 0 ? "0%" : `${Math.round((value / total) * 100)}%`;
}

function buildSlide1() {
  const slide = pptx.addSlide();
  addBackground(slide);
  addHeader(
    slide,
    "POSTHOG ANALYTICS",
    "Resumo operacional dos ultimos 3 dias",
    `Periodo: ${data.period.label} | Janela consultada: 2026-03-15 a 2026-03-17 (UTC)`
  );

  addKpi(
    slide,
    0.7,
    1.9,
    2.85,
    1.35,
    "Pageviews",
    data.summary.pageviews,
    "46 eventos de $pageview no periodo",
    COLORS.navy
  );
  addKpi(
    slide,
    3.72,
    1.9,
    2.85,
    1.35,
    "Visitantes unicos",
    data.summary.unique_visitors,
    "Base deduplicada por distinct_id",
    COLORS.teal
  );
  addKpi(
    slide,
    6.74,
    1.9,
    2.85,
    1.35,
    "PV por visitante",
    data.summary.pageviews_per_visitor,
    "Indicador de profundidade de navegacao",
    COLORS.gold
  );
  addKpi(
    slide,
    9.76,
    1.9,
    2.85,
    1.35,
    "Newsletter",
    data.summary.newsletter_subscribed,
    "1 tentativa e 1 inscricao concluida",
    COLORS.coral
  );

  addPanel(slide, 0.7, 3.55, 6.05, 2.6);
  slide.addText("Destaques", {
    x: 0.95,
    y: 3.82,
    w: 2.0,
    h: 0.2,
    fontSize: 12,
    bold: true,
    color: COLORS.ink,
    margin: 0,
  });
  const highlights = [
    `O pico ocorreu em 15 Mar, com ${data.daily.pageviews[0]} pageviews, ou ${pct(
      data.daily.pageviews[0],
      data.summary.pageviews
    )} do periodo.`,
    `A home (/) concentrou ${data.pages[0].views} pageviews, equivalentes a ${pct(
      data.pages[0].views,
      data.summary.pageviews
    )} do trafego.`,
    `Desktop dominou o acesso: ${data.devices[0].views} pageviews, contra ${data.devices[1].views} em mobile.`,
    `O Brasil liderou a origem do trafego com ${data.countries[0].views} pageviews.`
  ];
  slide.addText(
    highlights.map((text) => ({ text, options: { bullet: { indent: 14 } } })),
    {
      x: 0.95,
      y: 4.15,
      w: 5.4,
      h: 1.55,
      fontSize: 11,
      color: COLORS.ink,
      breakLine: true,
      paraSpaceAfterPt: 10,
      margin: 0,
    }
  );

  addPanel(slide, 6.95, 3.55, 5.68, 2.6, { fillColor: "F1E8DA" });
  slide.addText("Leitura executiva", {
    x: 7.2,
    y: 3.82,
    w: 2.6,
    h: 0.2,
    fontSize: 12,
    bold: true,
    color: COLORS.ink,
    margin: 0,
  });
  slide.addText(
    "O volume ainda e baixo, mas a instrumentacao esta ativa e consistente: pageviews, CTAs, troca de idioma, toggle de tema e fluxo de newsletter apareceram no periodo.",
    {
      x: 7.2,
      y: 4.2,
      w: 4.95,
      h: 0.95,
      fontSize: 11,
      color: COLORS.ink,
      margin: 0,
    }
  );
  slide.addText(
    "A principal oportunidade imediata e converter melhor a atencao da home para o cadastro da newsletter, mantendo a home como hub principal de descoberta.",
    {
      x: 7.2,
      y: 5.18,
      w: 4.95,
      h: 0.72,
      fontSize: 11,
      color: COLORS.ink,
      italic: true,
      margin: 0,
    }
  );

  addFooter(slide, 1);
  warnIfSlideHasOverlaps(slide, pptx);
  warnIfSlideElementsOutOfBounds(slide, pptx);
}

function buildSlide2() {
  const slide = pptx.addSlide();
  addBackground(slide);
  addHeader(
    slide,
    "TRAFEGO",
    "Evolucao diaria e distribuicao por pagina",
    "Pageviews e visitantes unicos por dia, com foco no mix entre home e newsletter."
  );

  addPanel(slide, 0.7, 1.9, 7.0, 4.65);
  slide.addText("Tendencia diaria", {
    x: 0.95,
    y: 2.12,
    w: 2.2,
    h: 0.2,
    fontSize: 12,
    bold: true,
    color: COLORS.ink,
    margin: 0,
  });
  slide.addChart(
    pptx.ChartType.line,
    [
      {
        name: "Pageviews",
        labels: data.daily.labels,
        values: data.daily.pageviews,
      },
      {
        name: "Visitantes unicos",
        labels: data.daily.labels,
        values: data.daily.unique_visitors,
      },
    ],
    {
      x: 1.0,
      y: 2.45,
      w: 6.35,
      h: 3.55,
      catAxisLabelFontFace: "Aptos",
      catAxisLabelFontSize: 10,
      valAxisLabelFontFace: "Aptos",
      valAxisLabelFontSize: 9,
      showLegend: true,
      legendPos: "b",
      showTitle: false,
      showValue: false,
      chartColors: [COLORS.navy, COLORS.teal],
      valAxisMinVal: 0,
      valAxisMaxVal: 32,
      valAxisMajorUnit: 8,
      lineSize: 2,
      markerSize: 6,
    }
  );

  addPanel(slide, 7.95, 1.9, 4.68, 2.25);
  slide.addText("Paginas mais vistas", {
    x: 8.2,
    y: 2.12,
    w: 2.2,
    h: 0.2,
    fontSize: 12,
    bold: true,
    color: COLORS.ink,
    margin: 0,
  });
  slide.addChart(
    pptx.ChartType.bar,
    [
      {
        name: "Pageviews",
        labels: data.pages.map((item) => item.pathname),
        values: data.pages.map((item) => item.views),
      },
    ],
    {
      x: 8.2,
      y: 2.45,
      w: 3.95,
      h: 1.3,
      chartColors: [COLORS.gold],
      showLegend: false,
      showTitle: false,
      catAxisLabelFontSize: 10,
      valAxisLabelFontSize: 9,
      valAxisMinVal: 0,
      valAxisMaxVal: 40,
      valAxisMajorUnit: 10,
      showValue: true,
      dataLabelPosition: "outEnd",
    }
  );

  addPanel(slide, 7.95, 4.3, 4.68, 2.25, { fillColor: "F4ECE0" });
  slide.addText("Interpretacao", {
    x: 8.2,
    y: 4.55,
    w: 2.0,
    h: 0.2,
    fontSize: 12,
    bold: true,
    color: COLORS.ink,
    margin: 0,
  });
  slide.addText(
    [
      {
        text: `A home concentrou ${pct(data.pages[0].views, data.summary.pageviews)} do trafego total.`,
        options: { bullet: { indent: 14 } },
      },
      {
        text: "O segundo dia caiu para 12 pageviews, sugerindo um padrao concentrado de acesso.",
        options: { bullet: { indent: 14 } },
      },
      {
        text: "A /newsletter responde por 9 pageviews e sustenta o principal objetivo de conversao capturado.",
        options: { bullet: { indent: 14 } },
      },
    ],
    {
      x: 8.2,
      y: 4.9,
      w: 3.95,
      h: 1.25,
      fontSize: 10.5,
      color: COLORS.ink,
      breakLine: true,
      paraSpaceAfterPt: 8,
      margin: 0,
    }
  );

  addFooter(slide, 2);
  warnIfSlideHasOverlaps(slide, pptx);
  warnIfSlideElementsOutOfBounds(slide, pptx);
}

function buildSlide3() {
  const slide = pptx.addSlide();
  addBackground(slide);
  addHeader(
    slide,
    "ENGAJAMENTO",
    "Eventos customizados e sinais de conversao",
    "Leitura dos eventos instrumentados no portfolio para entender interacao e intencao."
  );

  addPanel(slide, 0.7, 1.9, 7.15, 4.75);
  slide.addText("Top eventos customizados", {
    x: 0.95,
    y: 2.12,
    w: 2.8,
    h: 0.2,
    fontSize: 12,
    bold: true,
    color: COLORS.ink,
    margin: 0,
  });
  const customEvents = data.events.filter((item) => item.event !== "$pageview");
  slide.addChart(
    pptx.ChartType.bar,
    [
      {
        name: "Eventos",
        labels: customEvents.map((item) => item.event),
        values: customEvents.map((item) => item.total),
      },
    ],
    {
      x: 1.0,
      y: 2.45,
      w: 6.35,
      h: 3.7,
      chartColors: [COLORS.coral],
      showLegend: false,
      showTitle: false,
      catAxisLabelFontSize: 9,
      valAxisLabelFontSize: 9,
      valAxisMinVal: 0,
      valAxisMaxVal: 10,
      valAxisMajorUnit: 2,
      showValue: true,
      dataLabelPosition: "outEnd",
    }
  );

  addPanel(slide, 8.05, 1.9, 4.58, 2.2);
  slide.addText("Hero CTA", {
    x: 8.3,
    y: 2.12,
    w: 1.5,
    h: 0.2,
    fontSize: 12,
    bold: true,
    color: COLORS.ink,
    margin: 0,
  });
  slide.addChart(
    pptx.ChartType.doughnut,
    [
      {
        name: "CTA",
        labels: data.hero_cta.map((item) => item.type),
        values: data.hero_cta.map((item) => item.total),
      },
    ],
    {
      x: 8.25,
      y: 2.4,
      w: 2.1,
      h: 1.35,
      holeSize: 58,
      chartColors: [COLORS.teal, COLORS.gold],
      showLegend: true,
      legendPos: "r",
      showTitle: false,
      showValue: true,
      dataLabelPosition: "bestFit",
      dataLabelColor: COLORS.ink,
    }
  );

  addPanel(slide, 8.05, 4.3, 4.58, 2.35, { fillColor: "F4ECE0" });
  slide.addText("Conversao da newsletter", {
    x: 8.3,
    y: 4.55,
    w: 2.7,
    h: 0.2,
    fontSize: 12,
    bold: true,
    color: COLORS.ink,
    margin: 0,
  });
  slide.addText(`${data.summary.newsletter_subscribed}/${data.summary.newsletter_attempts}`, {
    x: 8.3,
    y: 4.95,
    w: 1.6,
    h: 0.45,
    fontFace: "Aptos Display",
    fontSize: 24,
    bold: true,
    color: COLORS.green,
    margin: 0,
  });
  slide.addText("100% no periodo", {
    x: 9.95,
    y: 5.08,
    w: 1.5,
    h: 0.2,
    fontSize: 11,
    bold: true,
    color: COLORS.ink,
    margin: 0,
  });
  slide.addText(
    "A amostra e pequena, mas valida o funcionamento do fluxo. O CTA principal do hero direcionou 75% dos cliques para a newsletter.",
    {
      x: 8.3,
      y: 5.52,
      w: 3.85,
      h: 0.7,
      fontSize: 10.5,
      color: COLORS.ink,
      margin: 0,
    }
  );

  addFooter(slide, 3);
  warnIfSlideHasOverlaps(slide, pptx);
  warnIfSlideElementsOutOfBounds(slide, pptx);
}

function buildSlide4() {
  const slide = pptx.addSlide();
  addBackground(slide);
  addHeader(
    slide,
    "AUDIENCIA",
    "Origem geografica, device mix e limites de leitura",
    "Contexto complementar para interpretar o volume e priorizar proximos ajustes de produto."
  );

  addPanel(slide, 0.7, 1.9, 5.7, 2.4);
  slide.addText("Pais de origem", {
    x: 0.95,
    y: 2.12,
    w: 1.8,
    h: 0.2,
    fontSize: 12,
    bold: true,
    color: COLORS.ink,
    margin: 0,
  });
  slide.addChart(
    pptx.ChartType.bar,
    [
      {
        name: "Pageviews",
        labels: data.countries.map((item) => item.country),
        values: data.countries.map((item) => item.views),
      },
    ],
    {
      x: 0.95,
      y: 2.45,
      w: 5.0,
      h: 1.35,
      chartColors: [COLORS.navy],
      showLegend: false,
      showTitle: false,
      catAxisLabelFontSize: 10,
      valAxisLabelFontSize: 9,
      valAxisMinVal: 0,
      valAxisMaxVal: 36,
      valAxisMajorUnit: 9,
      showValue: true,
      dataLabelPosition: "outEnd",
    }
  );

  addPanel(slide, 6.65, 1.9, 2.95, 2.4);
  slide.addText("Devices", {
    x: 6.9,
    y: 2.12,
    w: 1.4,
    h: 0.2,
    fontSize: 12,
    bold: true,
    color: COLORS.ink,
    margin: 0,
  });
  slide.addChart(
    pptx.ChartType.doughnut,
    [
      {
        name: "Devices",
        labels: data.devices.map((item) => item.device_type),
        values: data.devices.map((item) => item.views),
      },
    ],
    {
      x: 6.95,
      y: 2.45,
      w: 2.2,
      h: 1.35,
      holeSize: 60,
      chartColors: [COLORS.gold, COLORS.coral],
      showLegend: true,
      legendPos: "b",
      showTitle: false,
      showValue: true,
      dataLabelPosition: "bestFit",
      dataLabelColor: COLORS.ink,
    }
  );

  addPanel(slide, 9.85, 1.9, 2.78, 2.4, { fillColor: "F4ECE0" });
  slide.addText("Janela ativa", {
    x: 10.1,
    y: 2.12,
    w: 1.4,
    h: 0.2,
    fontSize: 12,
    bold: true,
    color: COLORS.ink,
    margin: 0,
  });
  slide.addText("Primeiro evento", {
    x: 10.1,
    y: 2.55,
    w: 1.4,
    h: 0.16,
    fontSize: 8.5,
    bold: true,
    color: COLORS.muted,
    margin: 0,
  });
  slide.addText("2026-03-15 02:58 UTC", {
    x: 10.1,
    y: 2.76,
    w: 2.0,
    h: 0.18,
    fontSize: 10.5,
    color: COLORS.ink,
    margin: 0,
  });
  slide.addText("Ultimo evento", {
    x: 10.1,
    y: 3.15,
    w: 1.4,
    h: 0.16,
    fontSize: 8.5,
    bold: true,
    color: COLORS.muted,
    margin: 0,
  });
  slide.addText("2026-03-17 14:30 UTC", {
    x: 10.1,
    y: 3.36,
    w: 2.0,
    h: 0.18,
    fontSize: 10.5,
    color: COLORS.ink,
    margin: 0,
  });

  addPanel(slide, 0.7, 4.55, 11.93, 2.0, { fillColor: COLORS.white });
  slide.addText("Recomendacoes imediatas", {
    x: 0.95,
    y: 4.82,
    w: 2.8,
    h: 0.2,
    fontSize: 12,
    bold: true,
    color: COLORS.ink,
    margin: 0,
  });
  slide.addText(
    [
      {
        text: "Aumentar a distribuicao da home, porque ela ja concentra a maior parte do trafego e dos cliques de CTA.",
        options: { bullet: { indent: 14 } },
      },
      {
        text: "Instrumentar mais eventos de profundidade em projetos e newsletter para separar curiosidade de intencao real.",
        options: { bullet: { indent: 14 } },
      },
      {
        text: "Monitorar o mobile, que ainda representa pouco volume e pode esconder oportunidades de otimizar CTA e layout.",
        options: { bullet: { indent: 14 } },
      },
    ],
    {
      x: 0.95,
      y: 5.15,
      w: 11.1,
      h: 1.0,
      fontSize: 10.5,
      color: COLORS.ink,
      breakLine: true,
      paraSpaceAfterPt: 8,
      margin: 0,
    }
  );

  addFooter(slide, 4);
  warnIfSlideHasOverlaps(slide, pptx);
  warnIfSlideElementsOutOfBounds(slide, pptx);
}

buildSlide1();
buildSlide2();
buildSlide3();
buildSlide4();

const outputPath = path.join(__dirname, "posthog-analytics-last-3-days.pptx");
pptx.writeFile({ fileName: outputPath });
console.log(`Wrote ${outputPath}`);
