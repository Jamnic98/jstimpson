interface PageHeaderProps {
  title: string
  description?: string
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => (
  <header id="page-header">
    <h1 className="mb-8 text-5xl font-semibold">{title}</h1>
    <p className="mb-4 text-left text-2xl">{description}</p>
    <hr className="w-full border-none bg-gray-950" style={{ height: '1px' }} />
  </header>
)
