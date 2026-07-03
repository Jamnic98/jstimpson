interface ProjectDescriptionsProps {
  paragraphs: string[]
}

export const ProjectDescriptions: React.FC<ProjectDescriptionsProps> = ({ paragraphs }) => (
  <>
    {paragraphs.map((paragraph: string, index) => (
      <p className="mb-4 text-justify text-lg text-neutral-500" key={index}>
        {paragraph}
      </p>
    ))}
  </>
)
