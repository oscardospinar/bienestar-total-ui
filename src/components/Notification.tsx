'use client';
type Props = {
  message?: string;
};

export default function Notification({ message }: Props) {
  return message ? <p className="text-sm text-green-600 mt-2">{message}</p> : null;
}
