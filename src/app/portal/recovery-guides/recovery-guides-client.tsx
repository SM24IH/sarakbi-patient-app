"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui";
import { recoveryGuides, type RecoveryGuide } from "@/lib/recovery-guides";

function MilestoneChecklist({ guideId, stepId, milestones }: { guideId: string; stepId: string; milestones: string[] }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  return (
    <div className="mt-4 space-y-2">
      {milestones.map((m, idx) => {
        const key = `${guideId}:${stepId}:${idx}`;
        const isOn = checked[key] ?? false;
        return (
          <label key={key} className="flex items-start gap-2 text-sm text-ink-muted">
            <input
              type="checkbox"
              checked={isOn}
              onChange={(e) => setChecked((prev) => ({ ...prev, [key]: e.target.checked }))}
              className="mt-1 h-4 w-4 accent-teal"
            />
            <span>{m}</span>
          </label>
        );
      })}
    </div>
  );
}

export default function RecoveryGuidesClient() {
  const [guideId, setGuideId] = useState(recoveryGuides[0]?.id ?? "");

  const guide: RecoveryGuide | undefined = useMemo(
    () => recoveryGuides.find((g) => g.id === guideId),
    [guideId],
  );

  if (!guide) {
    return (
      <div className="mt-6">
        <p className="text-sm text-ink-muted">No guides available.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h2 className="font-serif text-xl font-semibold text-teal">Recovery guides</h2>
          <p className="text-sm text-ink-muted">{guide.subtitle}</p>
        </div>

        <div className="w-full sm:w-72">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">Procedure guide</label>
          <select
            className="mt-1 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
            value={guideId}
            onChange={(e) => setGuideId(e.target.value)}
          >
            {recoveryGuides.map((g) => (
              <option key={g.id} value={g.id}>
                {g.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Card className="!p-6">
        <p className="text-sm text-ink-muted">
          General education only. Your discharge letter and clinic advice always take priority.
        </p>
      </Card>

      <div className="space-y-4">
        {guide.steps.map((s) => (
          <Card key={s.id} className="!p-6">
            <h3 className="font-serif text-lg font-semibold text-ink">{s.when}</h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Step-by-step</p>
                <ul className="mt-2 space-y-2 text-sm text-ink-muted">
                  {s.instructions.map((line) => (
                    <li key={line} className="flex gap-2">
                      <span className="text-gold">•</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Activity milestones</p>
                <MilestoneChecklist guideId={guide.id} stepId={s.id} milestones={s.activityMilestones} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

