// Note: This script requires Node.js with ES modules support or tsx/ts-node
// For now, using dynamic import to work with TypeScript files
(async ()=>{
  try{
    // Use dynamic import to load the TypeScript module
    // In production, you may want to use tsx: npx tsx scripts/validate-content.js
    const { loadAllLevels } = await import("../lib/content.ts");
    const packs = await loadAllLevels();
    let total=0;
    packs.forEach(p=> total += p.scenarios.length);
    console.log(`OK: Loaded ${packs.length} levels, ${total} scenarios.`);
    process.exit(0);
  }catch(e){
    console.error("Validation failed:\n", e?.issues || e);
    process.exit(1);
  }
})();

