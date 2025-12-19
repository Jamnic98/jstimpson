export const Error = ({ error }: { error: Error }) => (
  <>
    <h1 className="mb-8 text-3xl">An error occurred</h1>
    <p>{error.message}</p>
  </>
)
