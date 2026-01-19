export const colors = [
  'bg-red-300',
  'bg-orange-300',
  'bg-amber-300',
  'bg-green-300',
  'bg-teal-300',
  'bg-blue-300',
  'bg-indigo-300',
  'bg-purple-300',
  'bg-pink-300',
];

export function getColorIndex(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % colors.length;
}
