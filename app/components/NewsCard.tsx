import Link from 'next/link';

type NewsCardProps = {
  title: string;
  description: string;
  source: string;
};

export default function NewsCard({ title, description, source }: NewsCardProps) {
  return (
    <div className="card animate-fade-in">
      <h2 className="text-xl font-semibold text-secondary mb-2">{title}</h2>
      <p className="text-gray-600 mb-4 line-clamp-3">{description}</p>
      <Link href={source} className="btn">
        Læs mere →
      </Link>
    </div>
  );
}