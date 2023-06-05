import { truncate } from '../utils/HelperUtil'
import { Card, Checkbox, Row, Text } from '@nextui-org/react'

/**
 * Types
 */
interface IProps {
  address: string
  index: number
  selected: boolean
  onSelect: () => void
}

/**
 * Component
 */
export default function AccountSelectCard({ address, selected, index, onSelect }: IProps) {
  console.log('AccountSelectCard', address, selected, index, onSelect)
  return (
    <Card
      onPress={onSelect}
      key={address}
      css={{
        marginTop: '$5',
        backgroundColor: selected ? 'rgba(23, 200, 100, 0.2)' : '$accents2'
      }}
    >
      <Row justify="space-between" align="center">
        <input type="checkbox" color="success" checked={selected} onChange={onSelect} />

        <Text>{`${truncate(address, 14)} - Account ${index + 1}`} </Text>
      </Row>
    </Card>
  )
}
