import type { Meta, StoryObj } from '@storybook/react-vite'

import { Card } from 'components'
import { LOREM_IPSUM } from 'utils/constants'

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
}

export default meta

type Story = StoryObj<typeof Card>

export const CardStory: Story = {
  args: {
    title: 'Card Title',
    description: LOREM_IPSUM,
    imageURI: '/images/profile-picture/me.webp',
    linkURI: '',
  },
}
