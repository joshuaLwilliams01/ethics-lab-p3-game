import Link from "next/link";
export default function Modes(){
  const card = (href:string, title:string, desc:string) => (
    <a href={href} className="block p-4 rounded border hover:shadow">
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-gray-600">{desc}</div>
    </a>
  );
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {card("/play/individual/1","Individual","Play solo and reflect with expert review.")}
      {card("/play/group/create","Group","Host a room and discuss choices together.")}
      {card("/play/lecture/DEMO","Lecture","Live stats and charts for classrooms.")}
    </div>
  );
}

