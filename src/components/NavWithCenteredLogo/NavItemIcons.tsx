import { AiOutlineUser } from 'react-icons/ai'
import { RiHeartLine, RiSearchLine, RiShoppingCartLine } from 'react-icons/ri'

export const items = {
  wishlist: {
    label: 'Wishlist',
    icon: RiHeartLine,
    href: '/wishlist',
  },
  user: {
    label: 'Profile',
    icon: AiOutlineUser,
    href: '/profile',
  },
  cart: {
    label: 'Cart',
    icon: RiShoppingCartLine,
    href: '/shoppingcart',
  },
  // search: {
  //   label: 'Search',
  //   icon: RiSearchLine,
  //   href: '#',
  // },
}
