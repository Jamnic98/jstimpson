import { render, screen } from '@testing-library/react'

import { PageHeader } from './PageHeader'
import { LOREM_IPSUM } from 'utils/constants'

const testTitle = 'Test Title'
const testDescription = LOREM_IPSUM

describe('test PageHeader component', () => {
  it('renders correctly', () => {
    render(<PageHeader title={testTitle} description={testDescription} />)
    const header = screen.getByText(testTitle)
    expect(header).toBeInTheDocument()

    const description = screen.getByText(testDescription)
    expect(description).toBeInTheDocument()
  })
})
