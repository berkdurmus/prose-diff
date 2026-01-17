import { useMemo, useState } from "react";
import { DiffViewer } from "@/components/DiffViewer/DiffViewer";
import type { DiffOptions } from "@/core/types/options";
import { sampleAfter, sampleBefore } from "@/demo/data";

const modes = ["side-by-side", "inline", "hybrid"] as const;
const granularities = ["sentence", "paragraph"] as const;

export function App() {
  const [mode, setMode] = useState<(typeof modes)[number]>("side-by-side");
  const [granularity, setGranularity] =
    useState<(typeof granularities)[number]>("sentence");
  const [semantic, setSemantic] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [beforeText, setBeforeText] = useState(sampleBefore);
  const [afterText, setAfterText] = useState(sampleAfter);

  const diffOptions = useMemo<DiffOptions>(
    () => ({
      granularity,
      enableSemanticMatching: semantic,
      semanticThreshold: 0.6,
    }),
    [granularity, semantic],
  );

  return (
    <div className={`app theme-${theme}`}>
      <header className="app-header">
        <div>
          <p className="eyebrow">Prose Diff</p>
          <h1>Semantic diffs for writers</h1>
          <p className="subtitle">
            Inspect edits the way editors do: sentence-level meaning with
            word-level clarity.
          </p>
        </div>
        <div className="theme-toggle">
          <button
            className={theme === "light" ? "active" : ""}
            type="button"
            onClick={() => setTheme("light")}
          >
            Light
          </button>
          <button
            className={theme === "dark" ? "active" : ""}
            type="button"
            onClick={() => setTheme("dark")}
          >
            Dark
          </button>
        </div>
      </header>

      <section className="controls">
        <div className="segmented">
          {modes.map((value) => (
            <button
              key={value}
              className={mode === value ? "active" : ""}
              type="button"
              onClick={() => setMode(value)}
            >
              {value.replace("-", " ")}
            </button>
          ))}
        </div>
        <div className="field">
          <label htmlFor="granularity">Granularity</label>
          <select
            id="granularity"
            value={granularity}
            onChange={(event) =>
              setGranularity(
                event.target.value as (typeof granularities)[number],
              )
            }
          >
            {granularities.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="field toggle">
          <label htmlFor="semantic">Semantic matching</label>
          <input
            id="semantic"
            type="checkbox"
            checked={semantic}
            onChange={(event) => setSemantic(event.target.checked)}
          />
        </div>
        <div className="actions">
          <button
            type="button"
            className="ghost"
            onClick={() => {
              setBeforeText(sampleBefore);
              setAfterText(sampleAfter);
            }}
          >
            Reset sample
          </button>
          <button
            type="button"
            onClick={() => {
              setBeforeText(afterText);
              setAfterText(beforeText);
            }}
          >
            Swap
          </button>
        </div>
      </section>

      <section className="editor-grid">
        <div className="editor-card">
          <div className="editor-head">
            <h3>Before</h3>
            <span className="badge">Original</span>
          </div>
          <textarea
            value={beforeText}
            onChange={(event) => setBeforeText(event.target.value)}
            spellCheck={false}
          />
        </div>
        <div className="editor-card">
          <div className="editor-head">
            <h3>After</h3>
            <span className="badge accent">Revised</span>
          </div>
          <textarea
            value={afterText}
            onChange={(event) => setAfterText(event.target.value)}
            spellCheck={false}
          />
        </div>
      </section>

      <section className="viewer-card">
        <DiffViewer
          before={beforeText}
          after={afterText}
          mode={mode}
          theme={theme}
          showStats
          enableNavigation
          enableKeyboardShortcuts
          diffOptions={diffOptions}
        />
      </section>

      <section className="compare">
        <div className="panel">
          <h3>Before</h3>
          <pre>{beforeText}</pre>
        </div>
        <div className="panel">
          <h3>After</h3>
          <pre>{afterText}</pre>
        </div>
      </section>
    </div>
  );
}
