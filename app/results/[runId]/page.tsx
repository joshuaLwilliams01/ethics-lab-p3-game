'use client';
import { useEffect, useMemo, useState } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import Link from 'next/link';
import { playButtonClick } from '@/lib/sounds';

export default function Results({ params }:{ params:{ runId:string } }) {
  const [run, setRun] = useState<any>(null);
  useEffect(() => { const raw = sessionStorage.getItem('LATEST_RUN'); if (raw) setRun(JSON.parse(raw)); }, []);
  const totals = useMemo(() => {
    if (!run?.steps?.length) return { total:0, count:0 };
    const total = run.steps.reduce((acc:number, s:any)=> acc + (s.score?.total||0), 0);
    return { total, count: run.steps.length, avg: Math.round(total/run.steps.length) };
  }, [run]);

  const generateCertificate = async () => {
    playButtonClick();
    const pdf = await PDFDocument.create();
    const page = pdf.addPage([612, 396]);
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
    page.drawText('Ethics+Tech Simulator — Certificate of Completion', { x: 40, y: 320, size: 16, font: bold, color: rgb(0.2,0.2,0.2) });
    page.drawText(`Awarded to: ${'Player'}`, { x: 40, y: 270, size: 14, font: bold });
    page.drawText(`Completed: ${new Date().toLocaleDateString()}`, { x: 40, y: 245, size: 12, font });
    page.drawText(`Average Score: ${totals.avg ?? 0}`, { x: 40, y: 225, size: 12, font });
    page.drawText('People · Planet · Parity', { x: 40, y: 200, size: 12, font: bold, color: rgb(0.55,0,0) });
    const bytes = await pdf.save();
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'certificate.pdf'; a.click();
  };

  if (!run) return <div>No local run found.</div>;
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Results</h2>
      <div className="border rounded p-3 bg-white/70">
        <div>Total steps: {totals.count}</div>
        <div>Average score: <strong>{totals.avg ?? 0}</strong></div>
      </div>
      <div className="space-y-3">
        {run.steps.map((s:any, i:number)=>(
          <div key={i} className="border rounded p-3">
            <div className="font-medium">{s.scenario_id}</div>
            <div className="text-sm text-gray-600">Choice: {s.choice}</div>
            <div className="text-sm">Total: {s.score.total}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={generateCertificate} className="btn px-6 py-3 text-base font-semibold">Generate Certificate</button>
        <Link href="/" onClick={() => playButtonClick()} className="btn-ghost px-6 py-3 text-base font-semibold">Back Home</Link>
      </div>
    </div>
  );
}
