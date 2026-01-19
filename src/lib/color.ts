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

export const textColors = [
  'text-red-600',
  'text-orange-600',
  'text-amber-600',
  'text-green-600',
  'text-teal-600',
  'text-blue-600',
  'text-indigo-600',
  'text-purple-600',
  'text-pink-600',
];

export const ringColors = [
  'ring-red-300',
  'ring-orange-300',
  'ring-amber-300',
  'ring-green-300',
  'ring-teal-300',
  'ring-blue-300',
  'ring-indigo-300',
  'ring-purple-300',
  'ring-pink-300',
];
export function getColorIndex(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % colors.length;
}
