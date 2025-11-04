export default function IndividualLevel({params}:{params:{id:string}}){
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Level {params.id}</h2>
      <p>Scenario runner will render here. (Wire in ScenarioCard, ToolkitCard, P3Strip.)</p>
    </div>
  );
}

