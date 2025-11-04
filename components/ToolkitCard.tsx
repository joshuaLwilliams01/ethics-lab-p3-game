'use client';
import { useState } from 'react';
export default function ToolkitCard(){
  const [ok,setOk]=useState(false);
  return (
    <div className="border rounded p-3">
      <div className="font-medium">Toolkit (stub)</div>
      <label className="flex items-center gap-2 mt-2">
        <input type="checkbox" checked={ok} onChange={e=>setOk(e.target.checked)} />
        I completed the required fields
      </label>
    </div>
  );
}

