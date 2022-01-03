// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import pb from "@/lib/family_pb";

export type FamilyTreeData = {
  name: string;
  tooltip: string;
  children: FamilyTreeData[];
};

export function formatFamily(family: pb.Family): FamilyTreeData {
  const person = family.getPerson();
  const result: FamilyTreeData = {
    name: formatPerson(person, false),
    tooltip: formatPerson(person, true),
    children: [],
  };
  if (family.hasPartner()) {
    const partner = family.getPartner();
    const spouse = partner.getPerson();
    result.name += "\n" + formatPerson(spouse, false);
    result.tooltip += "\n" + formatPerson(spouse, true);
    if (partner.hasMarried()) {
      result.tooltip +=
        "\nDatum poroke: " + formatDate(parseUtcTs(partner.getMarried()));
    }
  }
  for (const child of family.getChildList()) {
    result.children.push(formatFamily(child));
  }
  if (result.children.length > 0) {
    result.tooltip += `\nŠtevilo otrok: ${result.children.length}`;
  }
  result.tooltip = result.tooltip.replace(/\n/g, "<br>");
  return result;
}

function formatPerson(person: pb.Person, full: boolean): string {
  if (!full) {
    let result = person.getFirstName();
    if (person.hasBirth()) {
      result += ` (${parseUtcTs(person.getBirth()).getFullYear()})`;
    }
    return result;
  }

  let name = `${person.getFirstName()} ${person.getLastName()}`;
  if (person.hasMaidenName()) {
    name += ` (roj. ${person.getMaidenName()})`;
  }
  if (person.hasBirth()) {
    let lifetime = ` (${formatDate(parseUtcTs(person.getBirth()))}`;
    if (person.hasDeath()) {
      lifetime += ` - ${formatDate(parseUtcTs(person.getDeath()))}`;
    }
    lifetime += ")";
    return name + lifetime;
  }
  return name;
}

function formatDate(date: Date): string {
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}

function parseUtcTs(ts: number): Date {
  const date = new Date(ts * 1000);
  const utcTs = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
  return new Date(utcTs);
}
