import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Select, type SelectProps } from './Select'

const defaultprops: SelectProps = { items: [], onChange: () => {} }

const renderSelect = (selectProps?: SelectProps) =>
  render(<Select {...defaultprops} {...selectProps} />)

describe('Test Select', () => {
  const user = userEvent.setup()

  test('renders correctly with default props', () => {
    renderSelect()
    const select = screen.queryByTestId('select')
    expect(select).toBeInTheDocument()
  })

  test('renders all items correctly', () => {
    const defaultValue = 'default'
    const items = ['a', 'b', 'c']
    renderSelect({ defaultValue, items, onChange: () => {} })

    // default value to appear in select
    const defaultItems = screen.getAllByText(defaultValue)
    expect(defaultItems[0]).toBeVisible()

    // all items should be in the document and hidden
    items.forEach((item) => {
      const testItem = screen.getByText(item)
      expect(testItem).toBeInTheDocument()
      expect(testItem).not.toBeVisible()
    })
  })

  test('updates dropdown styles correctly', async () => {
    renderSelect({ items: ['testItem'], onChange: () => {} })
    const select = screen.getByTestId('select')
    const dropdownIcon = screen.getByTestId('dropdown-icon')
    expect(dropdownIcon).not.toHaveClass('rotate-180')

    // dropdown should be hidden
    const dropdown = screen.getByTestId('select-dropdown')
    expect(dropdown).not.toBeVisible()

    // dropdown should be visible and icon flipped upon clicking select
    await user.click(select)
    expect(dropdown).toBeVisible()
    expect(dropdownIcon).toHaveClass('rotate-180')

    // clicking a dropdown option should hide the dropdown and reset icon rotation
    const dropdownOption = screen.getAllByTestId('select-option')[0]
    await user.click(dropdownOption)
    expect(dropdown).not.toBeVisible()
    expect(dropdownIcon).not.toHaveClass('rotate-180')
  })

  test('triggers onChange function when dropdown option clicked', async () => {
    const item = 'testItem'
    const onChange = jest.fn()
    renderSelect({ items: [item], onChange })

    // Open the dropdown
    const select = screen.getByTestId('select')
    await user.click(select)

    // Click the dropdown option
    const option = screen.getByText(item)
    await user.click(option)

    expect(onChange).toHaveBeenCalledWith(item)
  })
})
