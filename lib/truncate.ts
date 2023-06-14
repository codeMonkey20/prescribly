export default function truncate(sentence: string, maxLength: number) {
  if (sentence.length <= maxLength) {
    return sentence;
  }

  return sentence.substring(0, maxLength).trim() + "...";
}
