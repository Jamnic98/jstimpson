import type { Meta, StoryObj } from '@storybook/react-vite'

import { NavLogo } from 'components'

const meta: Meta<typeof NavLogo> = {
  title: 'Components/NavLogo',
  component: NavLogo,
}

export default meta

type Story = StoryObj<typeof NavLogo>
export const NavLogoStory: Story = {
  args: {
    linkURL: '/',
  },
}
