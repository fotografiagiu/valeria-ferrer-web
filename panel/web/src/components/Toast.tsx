type Props = {
  message: string | null;
  tone?: 'success' | 'error';
};

export function Toast({ message, tone = 'success' }: Props) {
  if (!message) return null;
  return <div className={`toast ${tone}`}>{message}</div>;
}
