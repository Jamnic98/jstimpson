interface PageHeaderProps {
  title: string
  description?: string
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => (
  <header id="page-header">
    <h1 className="mb-4 text-4xl font-semibold text-white max-w-96">{title}</h1>
    <p className="font-mono text-left text-md text-gray-400 tracking-wide">{description}</p>
  </header>
)
