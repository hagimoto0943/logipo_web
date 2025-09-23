import { Feather, Layers, List, AlignLeft } from "lucide-react";

export function StructureKindBadge({ structureKind, ...props }) {
  let bgClass = "bg-gray-500";
  let darkBgClass = "dark:bg-gray-900";
  let darkTextClass = "dark:text-gray-300";
  let icon = <Feather className="w-3 h-3 me-1"/>;
  let size = props.size || "text-[10px]";

  switch (structureKind) {
    case "free":
      bgClass = "bg-emerald-500";
      darkBgClass = "dark:bg-emerald-900";
      darkTextClass = "dark:text-emerald-300";
      icon  = <Feather className="w-3 h-3 me-1"/>;
      break;
    case "prep":
      bgClass = "bg-sky-500";
      darkBgClass = "dark:bg-sky-900";
      darkTextClass = "dark:text-sky-300";
      icon  = <Layers className="w-3 h-3 me-1"/>;
      break;
    case "sds":
      bgClass = "bg-amber-500";
      darkBgClass = "dark:bg-amber-900";
      darkTextClass = "dark:text-amber-300";
      icon  = <List className="w-3 h-3 me-1"/>;
      break;
    case "desc":
      bgClass = "bg-gray-500";
      darkBgClass = "dark:bg-gray-900";
      darkTextClass = "dark:text-gray-300";
      icon  = <AlignLeft className="w-3 h-3 me-1"/>;
      break;
  }

  return (
    <span className={`${bgClass} text-white ${size} font-small inline-flex items-center me-2 px-2.5 py-0.5 rounded-full ${darkBgClass} ${darkTextClass}`}>
      {icon}
      {structureKind?.toUpperCase()}
    </span>
  )
}