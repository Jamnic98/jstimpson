import type { Meta, StoryObj } from '@storybook/react-vite'

import { Select } from 'components'
import { projectCodingLanguages } from 'utils'

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
}

export default meta

type Story = StoryObj<typeof Select>

export const SelectStory: Story = {
  args: {
    items: projectCodingLanguages,
  },
}
