'use client';
import { useState } from 'react';
export default function P3Strip(){
  const [p,setP]=useState(false),[pl,setPl]=useState(false),[pa,setPa]=useState(false);
  return (
    <div className="flex items-center gap-4 text-sm">
      <label className="flex items-center gap-2"><input type="checkbox" checked={p} onChange={e=>setP(e.target.checked)}/>People</label>
      <label className="flex items-center gap-2"><input type="checkbox" checked={pl} onChange={e=>setPl(e.target.checked)}/>Planet</label>
      <label className="flex items-center gap-2"><input type="checkbox" checked={pa} onChange={e=>setPa(e.target.checked)}/>Parity</label>
    </div>
  );
}

