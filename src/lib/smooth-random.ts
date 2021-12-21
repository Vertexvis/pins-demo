//http://bl.ocks.org/telic/9376360
// The bigger the factor, the more smooth the trend
export default function SmoothRandom(
  factor: number,
  initial = 0.7
): () => number {
  let last = initial;
  const halfEnvelope = 1 / factor / 2;

  return function () {
    // clamp output range to [0,1] as Math.random()
    const max = Math.min(1, last + halfEnvelope);
    const min = Math.max(0, last - halfEnvelope);

    // return a number within halfRange of the last returned value
    return (last = Math.random() * (max - min) + min);
  };
}
